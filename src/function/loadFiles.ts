import { getDatapackFunctionPath, getDatapackName, getMinecraftFunctionPath, writeFile, writeStringFile } from '../utils/pack.ts';

const TELLRAW_DATA: string = JSON.stringify([
    {
        text: '[',
        color: '#CCCCCC',
        hoverEvent: {
            action: 'show_text',
            value: {
                translate: 'load.hover.preMessage',
                color: '#CCCCCC',
            },
        },
    },
    {
        text: '✔',
        color: '#33CC33',
    },
    {
        text: '] ',
    },
    {
        translate: 'global.name',
        hoverEvent: {
            action: 'show_text',
            value: {
                translate: 'load.hover.postMessage',
                with: [
                    {
                        translate: 'global.author',
                    },
                ],
                color: '#CCCCCC',
            },
        },
        clickEvent: { action: 'open_url', value: 'https://github.com/AntoninHuaut/TropicalFish' },
    },
]);

const loadContent = `tellraw @a ${TELLRAW_DATA}`;

export default async function generateLoadFiles() {
    await writeStringFile(`${getDatapackFunctionPath()}/load.mcfunction`, loadContent);
    await writeFile(`${getMinecraftFunctionPath()}/load.json`, { values: [`${getDatapackName()}:load`] });
}
