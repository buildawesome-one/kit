# One CLI `DRAFTING`

<!--section:content-->

Ready-to-use npm scripts are included within the same core package:

```sh
npm install @buildawesome.one/plugin
```

To reuse in your project, link them under `scripts/` subfolder like this:

```sh
mkdir scripts
cd scripts/
ln -s ../node_modules/@buildawesome.one/plugin/packages/scripts/package.json
cd ..
```

Finally, register `scripts` as a "virtual" npm workspace:

```json {data-caption=package.json}
  "workspaces": ["scripts"],
  "scripts": {
    "scripts": "npm -w scripts run",
    "start": "npm run scripts -- start",
    "stage": "npm run scripts -- stage",
    "build": "npm run scripts -- build"
  },
```

**Done!** 🥷
: Build Awesome Kit's `npm run start` / `stage` / `build` are ready to use in your project, AND automatically updated via `@buildawesome.one/plugin` package.

Live example: https://github.com/anyblades/buildawesome-micro-starters/tree/main/bare-scripts
