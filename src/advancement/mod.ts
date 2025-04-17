import { config } from '../config.ts';
import { getAdvancementsPath, getAdvancementsPathBodyColor, getAdvancementsPathType, getDatapackName, writeFile } from '../utils/pack.ts';
import { calculateModelData, colors, types } from '../utils/variant.ts';
import { getActiveFileContent, getBodyFileContent, getGlobaleFileContent, getGlobalTypeFileContent, getMainFileContent, getPatternFileContent } from './advancementFactory.ts';
import { Criteria, Variant } from './IJson.ts';

export default async function generatesFiles() {
    const promises: Promise<void>[] = [];
    const allTypeVariants: {
        [type: string]: { key: string; value: Variant }[];
    } = {};

    promises.push(createDetectFile());

    types.forEach((type, typeIndex) => {
        const typeVariants: {
            key: string;
            value: Variant;
        }[] = [];

        colors.forEach((bodyColor, bodyColorIndex) => {
            const path = `${getAdvancementsPathType(type)}/body_${bodyColor}.json`;
            const variantsColor = colors.map((colorVariant) => {
                return {
                    color: colorVariant,
                    key: `variant_${colorVariant}`,
                };
            });
            const content = getBodyFileContent({
                bodyColor: bodyColor,
                modelData: calculateModelData(typeIndex, bodyColorIndex, 0),
                variantsColor: variantsColor,
                type: type,
            });

            let patternColorIndex = 0;
            for (const variant of variantsColor) {
                const patternColor = colors[patternColorIndex];
                const criteriaKey = variant.key;
                const criteriaValue = content.criteria[criteriaKey];

                promises.push(
                    createPatternFiles({
                        type: type,
                        colorBody: bodyColor,
                        colorPattern: patternColor,
                        variantObj: {
                            key: criteriaKey,
                            value: criteriaValue,
                        },
                    })
                );

                patternColorIndex++;
                typeVariants.push({ key: criteriaKey, value: criteriaValue });
            }

            promises.push(createActiveFile(type, bodyColor));
            promises.push(writeFile(path, content));
        });

        allTypeVariants[type] = typeVariants;
        promises.push(createMainFile(type, typeVariants));
    });

    promises.push(createGlobalFiles(allTypeVariants));
    await Promise.all(promises);
}

async function createMainFile(
    type: string,
    typesVariants: {
        key: string;
        value: Variant;
    }[]
) {
    const path = `${getAdvancementsPathType(type)}/main.json`;
    const content = getMainFileContent({
        modelData: calculateModelData(types.indexOf(type), config.defaultPrimaryColorIndex, config.defaultSecondaryColorIndex),
        type: type,
    });

    for (const variant of typesVariants) {
        content.criteria[variant.key] = variant.value;
    }

    await writeFile(path, content);
}

async function createActiveFile(type: string, colorBody: string) {
    const colorPattern = 'yellow';

    const path = `${getAdvancementsPathBodyColor(type, colorBody)}/active.json`;
    const content = getActiveFileContent({
        type: type,
        colorBody: colorBody,
        colorPattern: colorPattern,
    });
    await writeFile(path, content);
}

async function createPatternFiles(params: { type: string; colorBody: string; colorPattern: string; variantObj: { key: string; value: Variant } }) {
    const criteriaItem: Criteria = {
        [params.variantObj.key]: params.variantObj.value,
    };

    const colorPatternIndex = colors.indexOf(params.colorPattern);
    let parent = params.type;
    if (colorPatternIndex == 0) {
        parent = `${parent}/body_${params.colorBody}`;
    } else {
        const previousColor = colors[colorPatternIndex - 1];
        parent = `${parent}/${params.colorBody}/pattern_${previousColor}`;
    }

    const content = getPatternFileContent({
        bodyColor: params.colorBody,
        modelData: calculateModelData(types.indexOf(params.type), colors.indexOf(params.colorBody), colorPatternIndex),
        parent: parent,
        patternColor: params.colorPattern,
        type: params.type,
    });

    content.criteria = criteriaItem;

    const path = `${getAdvancementsPathBodyColor(params.type, params.colorBody)}/pattern_${params.colorPattern}.json`;
    await writeFile(path, content);
}

async function createGlobalFiles(allTypesVariants: { [type: string]: { key: string; value: Variant }[] }) {
    const promises: Promise<void>[] = [];

    const path = `${getAdvancementsPath()}/global.json`;
    const content = getGlobaleFileContent();
    let lastParent = 'global';

    for (const type of Object.keys(allTypesVariants)) {
        const typePath = `${getAdvancementsPath()}/global_${type}.json`;
        const typeContent = getGlobalTypeFileContent({
            modelData: calculateModelData(types.indexOf(type), config.defaultPrimaryColorIndex, config.defaultSecondaryColorIndex),
            parent: lastParent,
            type: type,
        });

        for (const variant of allTypesVariants[type]) {
            content.criteria[variant.key] = variant.value;
            typeContent.criteria[variant.key] = variant.value;
        }

        promises.push(writeFile(typePath, typeContent));

        lastParent = `global_${type}`;
    }

    promises.push(
        writeFile(`${getAdvancementsPath()}/global_tick.json`, {
            criteria: { active: { trigger: 'minecraft:tick' } },
            parent: `${getDatapackName()}:${lastParent}`,
        })
    );
    promises.push(writeFile(path, content));
    await Promise.all(promises);
}

async function createDetectFile() {
    await writeFile(`${getAdvancementsPath()}/detect.json`, {
        criteria: {
            requirement: {
                trigger: 'minecraft:inventory_changed',
                conditions: {
                    items: [
                        {
                            items: 'minecraft:tropical_fish_bucket',
                        },
                    ],
                },
            },
        },
        rewards: {
            function: `${getDatapackName()}:convert`,
        },
    });
}
