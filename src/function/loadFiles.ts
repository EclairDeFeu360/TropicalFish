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

const loadContent = `scoreboard objectives add ${getDatapackName()} dummy
scoreboard players set #1 ${getDatapackName()} 1
tellraw @a ${TELLRAW_DATA}`;

const convertFunction = `#Get all buckets in the player's inventory
data modify storage ${getDatapackName()}:bucket list append from entity @s Inventory.[{id: "minecraft:tropical_fish_bucket"}]

#Count number of buckets and loop through them
execute store result score $nbBucket ${getDatapackName()} run data get storage ${getDatapackName()}:bucket list
function ${getDatapackName()}:each

#Revoke advancement at the end to prevent modified bucket from being detected
advancement revoke @s only ${getDatapackName()}:detect`;

const eachFunction = `#Copy BucketVariantTag to custom_data to be able to detect it
data modify storage ${getDatapackName()}:bucket list[-1].components."minecraft:custom_data".BucketVariantTag set from storage ${getDatapackName()}:bucket list[-1].components."minecraft:bucket_entity_data".BucketVariantTag

#Replace the bucket with the new data
function ${getDatapackName()}:give with storage ${getDatapackName()}:bucket list[-1]

#Loop
data remove storage ${getDatapackName()}:bucket list[-1]
scoreboard players operation $nbBucket ${getDatapackName()} -= #1 ${getDatapackName()}
execute unless score $nbBucket ${getDatapackName()} matches 0 run function ${getDatapackName()}:each`;

const giveFunction = `$item modify entity @s container.$(Slot) {"function":"minecraft:set_components","components":$(components)}`;

export default async function generateLoadFiles() {
    await writeStringFile(`${getDatapackFunctionPath()}/load.mcfunction`, loadContent);
    await writeStringFile(`${getDatapackFunctionPath()}/convert.mcfunction`, convertFunction);
    await writeStringFile(`${getDatapackFunctionPath()}/each.mcfunction`, eachFunction);
    await writeStringFile(`${getDatapackFunctionPath()}/give.mcfunction`, giveFunction);
    await writeFile(`${getMinecraftFunctionPath()}/load.json`, { values: [`${getDatapackName()}:load`] });
}
