import { ensureDir } from 'std/fs/ensure_dir.ts';

import { config } from '../config.ts';
import { RESOURCEPACK_FOLDER_PATH, writeFile } from '../utils/pack.ts';
import { calculateModelData, colors, types } from '../utils/variant.ts';

export interface LinkItemsFile {
    parent: string;
    textures: Textures;
    overrides: OverridesEntity[];
}

export interface Textures {
    layer0: string;
}

export interface OverridesEntity {
    predicate: Predicate;
    model: string;
}

export interface Predicate {
    custom_model_data: number;
}

async function createModelsFiles() {
    const promisesFiles: Promise<void>[] = [];

    for (const type of types) {
        const modelsPathType = `${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/models/${config.techName}/${type}/`;

        for (const colorBody of colors) {
            const modelPathTypeColorBody = `${modelsPathType}/${colorBody}/`;

            for (const colorPattern of colors) {
                const finalPath = `${modelPathTypeColorBody}/${colorPattern}.json`;

                promisesFiles.push(
                    writeFile(finalPath, {
                        parent: 'item/generated',
                        textures: {
                            layer0: `${config.techName}/${type}/${colorBody}/${colorPattern}`,
                        },
                    })
                );
            }
        }
    }

    await Promise.all(promisesFiles);
}

async function createLinkTexturesModelsFile() {
    const content: LinkItemsFile = {
        parent: 'item/generated',
        textures: {
            layer0: 'item/tropical_fish',
        },
        overrides: [],
    };

    types.forEach((type, typeIndex) => {
        colors.forEach((bodyColor, bodyColorIndex) => {
            colors.forEach((patternColor, patternColorIndex) => {
                const modelData: number = calculateModelData(typeIndex, bodyColorIndex, patternColorIndex);
                const model = `${config.techName}/${type}/${bodyColor}/${patternColor}`;

                content.overrides.push({
                    predicate: {
                        custom_model_data: modelData,
                    },
                    model: model,
                });
            });
        });
    });

    await writeFile(`${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/models/item/tropical_fish.json`, content);
}

export async function createAtlases() {
    await ensureDir(`${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/atlases`);
    await writeFile(`${RESOURCEPACK_FOLDER_PATH}/assets/minecraft/atlases/blocks.json`, {
        sources: [
            {
                type: 'directory',
                source: config.techName,
                prefix: config.techName + '/',
            },
        ],
    });
}

export default async function initTextures() {
    await createModelsFiles();
    await createLinkTexturesModelsFile();
    await createAtlases();
}
