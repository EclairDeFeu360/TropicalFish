import { ensureDir } from 'std/fs/mod.ts';

import { config } from '../config.ts';
import { colors, types } from './variant.ts';

export const DATAPACK_FOLDER_PATH = 'datapack';
export const RESOURCEPACK_FOLDER_PATH = 'resourcepack';

export async function generateFolders() {
    const promises: Promise<void>[] = [];
    for (const type of types) {
        for (const color of colors) {
            const path = getAdvancementsPathBodyColor(type, color);
            promises.push(ensureDir(path));
        }
    }
    promises.push(ensureDir(getMinecraftFunctionPath()), ensureDir(getDatapackFunctionPath()));

    await Promise.all(promises);
}

export async function writeFile(path: string, content: object) {
    let stringify: string;
    if (config.jsonMinified) {
        stringify = JSON.stringify(content);
    } else {
        stringify = JSON.stringify(content, null, 2);
    }
    await writeStringFile(path, stringify);
}

export async function writeStringFile(path: string, content: string) {
    await Deno.writeTextFile(path, content);
}

export function getDatapackName(): string {
    return config.techName;
}

export function getMinecraftFunctionPath() {
    return `${DATAPACK_FOLDER_PATH}/data/minecraft/tags/function`;
}

export function getDatapackFunctionPath() {
    return `${DATAPACK_FOLDER_PATH}/data/${getDatapackName()}/function`;
}

export function getAdvancementsPath() {
    return `${DATAPACK_FOLDER_PATH}/data/${getDatapackName()}/advancement`;
}

export function getAdvancementsPathType(type: string) {
    return `${getAdvancementsPath()}/${type}`;
}

export function getAdvancementsPathBodyColor(type: string, color: string) {
    return `${getAdvancementsPathType(type)}/${color}`;
}

export function getGlobalRewardFileName() {
    return 'global_reward';
}

export function getTypeRewardFileName() {
    return 'type_reward';
}
