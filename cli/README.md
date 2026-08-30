# One CLI

<!--section:content-->

```sh
npm install @buildawesome.one/cli
```

Reuse it in your project by linking under `.cli/` subfolder like this:

```sh
mkdir .cli
cd .cli/
ln -s ../node_modules/@buildawesome.one/cli/package.json
cd ..
```

Finally, register it in your `package.json` like this:

```json
  "scripts": {
    "cli": "npm -C .cli/ run",
    "start": "npm run cli -- start",
    "stage": "npm run cli -- stage",
    "build": "npm run cli -- build"
  },
```

**Done!** 🥷
: `@buildawesome.one/cli`'s `npm run start` / `stage` / `build` ready to use in your project, yet easy to maintain!

Live example: https://github.com/buildawesome-one/kit/tree/main/cli/e2e
