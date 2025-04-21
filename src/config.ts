export const config: IConfig = {
    globalRewardCommands: ['xp add @s 3072 levels'],
    typeRewardCommands: ['xp add @s 3072 points'],
    datapackFormat: 71,
    resourcepackFormat: 46,
    defaultPrimaryColorIndex: 10, // Index in the colorsMapping object, not the minecraft color value
    defaultSecondaryColorIndex: 14, // Index in the colorsMapping object, not the minecraft color value
    techName: 'tropicalfish',
    i18nName: 'Tropical Fish',
    jsonMinified: true,
};

export interface IConfig {
    globalRewardCommands: string[];
    typeRewardCommands: string[];
    datapackFormat: number;
    resourcepackFormat: number;
    defaultPrimaryColorIndex: number;
    defaultSecondaryColorIndex: number;
    techName: string;
    i18nName: string;
    jsonMinified: boolean;
}
