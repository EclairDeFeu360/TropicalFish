import { config } from '../config.ts';
import {
    DATAPACK_FOLDER_PATH,
    getDatapackFunctionPath,
    getDatapackName,
    getGlobalRewardFileName,
    getTypeRewardFileName,
    RESOURCEPACK_FOLDER_PATH,
    writeStringFile,
} from '../utils/pack.ts';
import { colors, types } from '../utils/variant.ts';
import generateLoadFiles from './loadFiles.ts';

export default async function generatesFunctionFiles() {
    const promises: Promise<void>[] = [];
    types.forEach((type) => promises.push(generateFunctionFile(type)));
    promises.push(generateRewards());
    promises.push(generateLoadFiles());
    promises.push(generatePackMeta());
    await Promise.all(promises);
}

async function generateRewards() {
    await writeStringFile(`${getDatapackFunctionPath()}/${getGlobalRewardFileName()}.mcfunction`, config.globalRewardCommands.join('\n').trim());
    await writeStringFile(`${getDatapackFunctionPath()}/${getTypeRewardFileName()}.mcfunction`, config.typeRewardCommands.join('\n').trim());
}

async function generatePackMeta() {
    await writeStringFile(
        `${DATAPACK_FOLDER_PATH}/pack.mcmeta`,
        JSON.stringify(
            {
                pack: {
                    description: config.i18nName + ' Datapack',
                    pack_format: config.datapackFormat,
                    supported_formats: [config.datapackFormat,9e9],
                },
            },
            null,
            2
        ).trim()
    );
    await writeStringFile(
        `${RESOURCEPACK_FOLDER_PATH}/pack.mcmeta`,
        JSON.stringify(
            {
                pack: {
                    description: config.i18nName + ' Resourcepack',
                    pack_format: config.resourcepackFormat,
                    supported_formats: [config.resourcepackFormat,9e9],
                },
            },
            null,
            2
        ).trim()
    );
}

async function generateFunctionFile(type: string) {
    const getAdvancementCmd = (config: { type: string; bodyColor: string }) =>
        `advancement grant @s only ${getDatapackName()}:${config.type}/${config.bodyColor}/active`;

    const path = `${getDatapackFunctionPath()}/${type}.mcfunction`;
    let content = '';

    for (const bodyColor of colors) {
        content +=
            getAdvancementCmd({
                type: type,
                bodyColor: bodyColor,
            }) + '\n';
    }

    await writeStringFile(path, content.trim());
}
