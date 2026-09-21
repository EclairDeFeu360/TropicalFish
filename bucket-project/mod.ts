import type { Dirent } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Image } from 'imagescript';

import { config } from '../src/config.ts';

const imageConfig = {
    overlayPath: fileURLToPath(new URL('./overlay.png', import.meta.url)),
    assetsDir: fileURLToPath(new URL(`../static/textures/${config.techName}`, import.meta.url)),
    distDir: fileURLToPath(new URL('./dist', import.meta.url)),
};

const imgPending: Promise<void>[] = [];
const overlay = await Image.decode(await readFile(imageConfig.overlayPath));

async function generateImage(imgAssetsFolder: string, entry: Dirent) {
    const imgAssetsPath = `${imgAssetsFolder}/${entry.name}`;
    const imgDistFolder = join(imageConfig.distDir, relative(imageConfig.assetsDir, imgAssetsFolder));
    const imgDistPath = `${imgDistFolder}/${entry.name}`;

    const image = await Image.decode(await readFile(imgAssetsPath));
    image.composite(overlay, image.width - overlay.width, image.height - overlay.height);

    await mkdir(imgDistFolder, { recursive: true });
    await writeFile(imgDistPath, await image.encode());
}

async function checkImage(folder: string) {
    const childPending: Promise<void>[] = [];
    for (const entry of await readdir(folder, { withFileTypes: true })) {
        if (entry.isFile()) imgPending.push(generateImage(folder, entry));
        else if (entry.isDirectory()) childPending.push(checkImage(`${folder}/${entry.name}`));
    }
    await Promise.all(childPending);
}

console.time('Generate images');
await checkImage(imageConfig.assetsDir);
await Promise.all(imgPending);
console.timeEnd('Generate images');

console.log(`Dist path: ${resolve(imageConfig.distDir)}`);
