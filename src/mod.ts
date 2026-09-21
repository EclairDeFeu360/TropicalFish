import { createWriteStream } from 'node:fs';
import { cp, rm } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import archiver from 'archiver';

import generatesFiles from './advancement/mod.ts';
import { config } from './config.ts';
import generatesFunctionFiles from './function/mod.ts';
//import initTextures from './texture/mod.ts';
import { DATAPACK_FOLDER_PATH, generateFolders, RESOURCEPACK_FOLDER_PATH } from './utils/pack.ts';

async function removeIfExists(path: string) {
    await rm(path, { recursive: true, force: true });
}

async function generateZIP(path: string, output: string) {
    const archive = archiver('zip');
    archive.on('warning', (error) => archive.destroy(error));
    const destination = createWriteStream(`${config.i18nName.replace(/ /g, '')}-${output}.zip`);
    const completion = pipeline(archive, destination);
    archive.directory(path, false);
    await Promise.all([archive.finalize(), completion]);
}

await removeIfExists(DATAPACK_FOLDER_PATH);
await removeIfExists(RESOURCEPACK_FOLDER_PATH);

console.log('Generating datapack folder and resourcepack folder...');

await generateFolders();
await cp('./static/items', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/items`, { recursive: true });
await cp('./static/lang', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/lang`, { recursive: true });
await cp('./static/models', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/models`, { recursive: true });
await cp('./static/textures', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/textures`, { recursive: true });
await cp('./static/pack.png', `${DATAPACK_FOLDER_PATH}/pack.png`);
await cp('./static/pack.png', `${RESOURCEPACK_FOLDER_PATH}/pack.png`);
await generatesFiles();
await generatesFunctionFiles();

console.log('Datapack/resourcepack folders have been generated');
console.log('Generating datapack archive and resourcepack archive...');

await Promise.all([generateZIP(DATAPACK_FOLDER_PATH, 'data'), generateZIP(RESOURCEPACK_FOLDER_PATH, 'resource')]);

console.log('Datapack/resourcepack archives have been generated');
