import { Image } from 'imagescript/mod.ts';
import { ensureDir } from 'std/fs/mod.ts';
import { resolve } from 'std/path/mod.ts';

import { config } from '../src/config.ts';

const imageConfig = {
    overlayPath: 'overlay.png',
    assetsDir: `../static/textures/${config.techName}`,
    distDir: 'dist',
};

const imgPending: Promise<void>[] = [];
const overlay = await Image.decode(await Deno.readFile(imageConfig.overlayPath));

async function generateImage(imgAssetsFolder: string, entry: Deno.DirEntry) {
    const imgAssetsPath = `${imgAssetsFolder}/${entry.name}`;
    const imgDistFolder = imgAssetsFolder.replace(new RegExp(imageConfig.assetsDir), imageConfig.distDir);
    const imgDistPath = `${imgDistFolder}/${entry.name}`;

    const image = await Image.decode(await Deno.readFile(imgAssetsPath));
    image.composite(overlay, image.width - overlay.width, image.height - overlay.height);

    await ensureDir(imgDistFolder);
    await Deno.writeFile(imgDistPath, await image.encode());
}

async function checkImage(folder: string) {
    const childPending: Promise<void>[] = [];
    for await (const entry of Deno.readDir(folder)) {
        if (entry.isFile) imgPending.push(generateImage(folder, entry));
        else childPending.push(checkImage(`${folder}/${entry.name}`));
    }
    await Promise.all(childPending);
}

console.time('Generate images');
await checkImage(imageConfig.assetsDir);
await Promise.all(imgPending);
console.timeEnd('Generate images');

console.log(`Dist path: ${resolve(imageConfig.distDir)}`);
