import { copy } from 'std/fs/mod.ts';
import { compress } from 'zip/mod.ts';

import generatesFiles from './advancement/mod.ts';
import { config } from './config.ts';
import generatesFunctionFiles from './function/mod.ts';
//import initTextures from './texture/mod.ts';
import { DATAPACK_FOLDER_PATH, generateFolders, RESOURCEPACK_FOLDER_PATH } from './utils/pack.ts';

async function removeIfExists(path: string) {
    try {
        await Deno.stat(path);
        await Deno.remove(path, { recursive: true });
    } catch (_e) {
        // Ignore
    }
}

async function generateZIP(path: string, output: string) {
    const fileNames: string[] = [];
    for await (const dirEntry of Deno.readDir(path)) {
        fileNames.push(path + '/' + dirEntry.name);
    }
    await compress(fileNames, `${config.i18nName.replace(/ /g, '')}-${output}.zip`, { overwrite: true, flags: [] });
}

await removeIfExists(DATAPACK_FOLDER_PATH);
await removeIfExists(RESOURCEPACK_FOLDER_PATH);

console.log('Generating datapack folder and resourcepack folder...');

await generateFolders();
// await copy('./static/textures', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/textures`);
// await copy('./static/lang', `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/lang`);
// await copy('./static/pack.png', `${DATAPACK_FOLDER_PATH}/pack.png`);
// await copy('./static/pack.png', `${RESOURCEPACK_FOLDER_PATH}/pack.png`);
// //await initTextures();
await generatesFiles();
await generatesFunctionFiles();

console.log('Datapack/resourcepack folders have been generated');
console.log('Generating datapack archive and resourcepack archive...');

await Promise.all([generateZIP(DATAPACK_FOLDER_PATH, 'data'), generateZIP(RESOURCEPACK_FOLDER_PATH, 'resource')]);

console.log('Datapack/resourcepack archives have been generated');
