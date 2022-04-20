import {copy, exists} from "https://deno.land/std/fs/mod.ts"
import generatesFiles from "./advancement/mod.ts"
import {generateFolders, PACK_FOLDER_PATH} from "./utils/pack.ts"
import initTextures from "./texture/mod.ts"
import generatesFunctionFiles from "./function/mod.ts"


if (await exists(PACK_FOLDER_PATH)) {
    await Deno.remove(PACK_FOLDER_PATH, {recursive: true})
}

await generateFolders()
await copy("./static/textures", `${PACK_FOLDER_PATH}/assets/minecraft/textures`)
await copy("./static/lang", `${PACK_FOLDER_PATH}/assets/minecraft/lang`)
await initTextures()
await generatesFiles()
await generatesFunctionFiles()

console.log("Generated datapack folder, zip the contents of the pack/ folder to turn it into a datapack")