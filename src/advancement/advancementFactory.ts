import { getDatapackName, getGlobalRewardFileName, getTypeRewardFileName } from '../utils/pack.ts';
import { Criteria, Display } from './IJson.ts';

const backgroundTexture = 'minecraft:block/tube_coral_block';

class AdvancementFactory {
    private json: Record<string, any> = {
        author: {
            translate: 'global.author',
        },
    };

    criteria(criteria: Criteria): this {
        this.json.criteria = criteria;
        return this;
    }

    display(display: Display): this {
        this.json.display = display;
        return this;
    }

    parent(parent: string): this {
        this.json.parent = `${getDatapackName()}:${parent}`;
        return this;
    }

    rewards(functionStr: string): this {
        this.json.rewards = {
            function: `${getDatapackName()}:${functionStr}`,
        };
        return this;
    }

    get() {
        return this.json;
    }
}

export function getActiveFileContent(params: { type: string; colorBody: string; colorPattern: string }) {
    return new AdvancementFactory()
        .parent(`${params.type}/${params.colorBody}/pattern_${params.colorPattern}`)
        .criteria({
            active: {
                trigger: 'minecraft:impossible',
            },
        })
        .get();
}

export function getGlobaleFileContent() {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                id: 'minecraft:tropical_fish',
            },
            title: {
                translate: 'advancement.catch.fish.title',
            },
            description: {
                translate: 'advancement.catch.fish.description',
            },
            background: backgroundTexture,
            frame: 'challenge',
            show_toast: true,
            announce_to_chat: true,
            hidden: false,
        })
        .rewards(getGlobalRewardFileName())
        .get();
}

export function getGlobalTypeFileContent(params: { modelData: JSON; parent: string; type: string }) {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                id: 'minecraft:tropical_fish',
                components: {
                    'minecraft:custom_model_data': params.modelData,
                },
            },
            title: {
                translate: 'advancement.catch.type.title',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                ],
            },
            description: {
                translate: 'advancement.catch.type.description',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                ],
            },
            background: backgroundTexture,
            frame: 'goal',
            show_toast: false,
            announce_to_chat: false,
            hidden: false,
        })
        .parent(params.parent)
        .rewards(getTypeRewardFileName())
        .get();
}

export function getMainFileContent(params: { modelData: JSON; type: string }) {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                id: 'minecraft:tropical_fish',
                components: {
                    'minecraft:custom_model_data': params.modelData,
                },
            },
            title: {
                translate: 'advancement.catch.type.title',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                ],
            },
            description: {
                translate: 'advancement.catch.type.description',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                ],
            },
            background: backgroundTexture,
            frame: 'challenge',
            show_toast: true,
            announce_to_chat: true,
            hidden: false,
        })
        .get();
}

export function getBodyFileContent(params: { bodyColor: string; modelData: JSON; type: string; variantsColor: { color: string; key: string }[] }) {
    const variants = params.variantsColor.map((variantColor) => {
        return {
            [`variant_${variantColor.color}`]: {
                trigger: 'minecraft:inventory_changed',
                conditions: {
                    items: [
                        {
                            items: 'minecraft:tropical_fish_bucket',
                            components: {
                                'minecraft:tropical_fish/pattern' : params.type,
                                'minecraft:tropical_fish/base_color' : params.bodyColor,
                                'minecraft:tropical_fish/pattern_color' : variantColor.color,
                            },
                        },
                    ],
                },
            },
        };
    });

    const criteria = {};
    Object.assign(criteria, ...variants);

    return new AdvancementFactory()
        .criteria(criteria)
        .display({
            icon: {
                id: 'minecraft:tropical_fish',
                components: {
                    'minecraft:custom_model_data': params.modelData,
                },
            },
            title: {
                translate: 'advancement.catch.type_bodyColor.title',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                    {
                        translate: `fish.color.${params.bodyColor}`,
                    },
                ],
            },
            description: {
                translate: 'advancement.catch.type_bodyColor.description',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                    {
                        translate: `fish.color.${params.bodyColor}`,
                    },
                ],
            },
            background: backgroundTexture,
            frame: 'goal',
            show_toast: true,
            announce_to_chat: false,
            hidden: false,
        })
        .parent(`${params.type}/main`)
        .get();
}

export function getPatternFileContent(params: { bodyColor: string; modelData: JSON; parent: string; patternColor: string; type: string }) {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                id: 'minecraft:tropical_fish',
                components: {
                    'minecraft:custom_model_data': params.modelData,
                },
            },
            title: {
                translate: 'advancement.catch.type_bodyColor_patternColor.title',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                    {
                        translate: `fish.color.${params.bodyColor}`,
                    },
                    {
                        translate: `fish.color.${params.patternColor}`,
                    },
                ],
            },
            description: {
                translate: 'advancement.catch.type_bodyColor_patternColor.description',
                with: [
                    {
                        translate: `fish.type.${params.type}`,
                    },
                    {
                        translate: `fish.color.${params.bodyColor}`,
                    },
                    {
                        translate: `fish.color.${params.patternColor}`,
                    },
                ],
            },
            background: backgroundTexture,
            frame: 'task',
            show_toast: true,
            announce_to_chat: false,
            hidden: false,
        })
        .parent(`${params.parent}`)
        .rewards(`${params.type}`)
        .get();
}
