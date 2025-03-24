export const types: string[] = ['betty', 'blockfish', 'brinely', 'clayfish', 'dasher', 'flopper', 'glitter', 'kob', 'snooper', 'spotty', 'stripey', 'sunstreak'];
export const typesMapping: Record<string, [number, number]> = {
    // first least byte / second-least byte: https://minecraft.wiki/w/Tropical_Fish#Entity_data
    betty: [1, 4],
    blockfish: [1, 3],
    brinely: [0, 4],
    clayfish: [1, 5],
    dasher: [0, 3],
    flopper: [1, 0],
    glitter: [1, 2],
    kob: [0, 0],
    snooper: [0, 2],
    spotty: [0, 5],
    stripey: [1, 1],
    sunstreak: [0, 1],
};

export const colors: string[] = [
    'black',
    'blue',
    'brown',
    'cyan',
    'gray',
    'green',
    'light_blue',
    'light_gray',
    'lime',
    'magenta',
    'orange',
    'pink',
    'purple',
    'red',
    'white',
    'yellow',
];
export const colorsMapping: Record<string, number> = {
    black: 15,
    blue: 11,
    brown: 12,
    cyan: 9,
    gray: 7,
    green: 13,
    light_blue: 3,
    light_gray: 8,
    lime: 5,
    magenta: 2,
    orange: 1,
    pink: 6,
    purple: 10,
    red: 14,
    white: 0,
    yellow: 4,
};

export function calculateModelData(typeIndex: number, bodyColorIndex: number, patternColorIndex: number): JSON {
    const size:number = typesMapping[types[typeIndex]][0];
    let sizeLiteral:string;
    if (size == 0)  sizeLiteral = "small";
    else  sizeLiteral = "big";

    const pattern:string = types[typeIndex];

    const colorBody:string = colors[bodyColorIndex];
    const colorPattern:string = colors[patternColorIndex];

    const CMD = {
        strings:[
            sizeLiteral,
            colorBody,
            pattern,
            colorPattern
        ]
    }

    return JSON.parse(JSON.stringify(CMD));
}

export function getVariantsWithTypeColor(typeStr: string, colorStr: string): number[] {
    const variantList: number[] = [];

    if (!Object.keys(typesMapping).includes(typeStr)) return [];
    if (!Object.keys(colorsMapping).includes(colorStr)) return [];

    const type = typesMapping[typeStr];

    const size = type[0];
    const pattern = type[1];
    const colorBody = colorsMapping[colorStr];

    for (let colorPattern = 0; colorPattern <= 15; colorPattern++) {
        variantList.push((colorPattern << 24) | (colorBody << 16) | (pattern << 8) | size);
    }

    return variantList;
}
