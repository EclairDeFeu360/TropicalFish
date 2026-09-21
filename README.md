# TropicalFish

<p align="center">
  <img src="https://i.imgur.com/JDq39DL.png">
  <br/><b>Global Advancement tab</b>
</p>
<p align="center">
  <img src="https://i.imgur.com/chnRo4a.png">
  <br/><b>Flopper Advancement tab</b>
</p>

## Download
Datapack and resourcepack can be downloaded 

- On Modrinth
  * [All Tropical Fish Datapack](https://modrinth.com/datapack/all-tropical-fish-datapack)
  * [All Tropical Fish Collection](https://modrinth.com/resourcepack/all-tropical-fish-collection)
- On CurseForge
  * [All Tropical Fish Datapack](https://www.curseforge.com/minecraft/customization/all-tropical-fish-datapack)
  * [All Tropical Fish Collection](https://www.curseforge.com/minecraft/texture-packs/all-tropical-fish-ressourcepack)

## Generation

Install [Node.js](https://nodejs.org/) 22.18 or newer (Node.js 24 is pinned in `.nvmrc`)
and [pnpm](https://pnpm.io/installation) 10.30.2, then install dependencies from the project root:

```console
pnpm install
```

Then run the application to generate the datapack and the resourcepack

```console
pnpm start
```

This creates `datapack/`, `resourcepack/`, `TropicalFish-data.zip`, and `TropicalFish-resource.zip`.
Run `pnpm check` to type-check both generators, or `pnpm bucket-start` to generate bucket textures
in `bucket-project/dist/` (see the [source texture requirements](bucket-project/README.md)).
