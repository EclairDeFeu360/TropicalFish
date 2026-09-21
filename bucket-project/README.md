# TropicalFish-Bucket

Sub-project to generate images of tropical fish with the bucket texture.

Requires source PNG textures in `static/textures/tropicalfish/` (or the directory named by
`config.techName`). These source textures are not included in this checkout.

Install Node.js 22.18 or newer and pnpm 10.30.2, then run these commands from the repository root:

```console
pnpm install
pnpm bucket-start
```

Images are written to `bucket-project/dist/`, preserving the source texture folders.
You can also run `node mod.ts` from this directory after installing dependencies.
