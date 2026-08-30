<!--section:summary-->

<section align="center">
  <h1><span hidden>11ty /</span> Build Awesome <em class="mark-brand">One</em></h1>
  <p><big>All-in-<em class="mark-brand">One</em> kit for 11ty / Build&nbsp;Awesome.</big></p>
  <nav>
    <a href="//buildawesome.one/plugin/" role="button">One <b>Plugin</b> ›</a>
    <b hidden>|</b>
    <a href="//buildawesome.one/config/" role="button" class="outline">One <b>Config</b> ›</a>
    <b hidden>|</b>
    <a href="//starter.buildawesome.one/" role="button" class="outline">One <b>Starter</b> ↗</a>
  </nav>
</section>

<!--section-->

---

## Utility **plugin**

<!--section:plugin-->

```sh
npm install @anyblades/buildawesome-kit
```

Then `addPlugin()` to your config:

```js {data-caption=buildawesome.config.js}
import kitPlugin from "@anyblades/buildawesome-kit";

export default function ($config) {
  $config.addPlugin(kitPlugin);
}
```

Live example: https://github.com/anyblades/buildawesome-micro-starters/blob/main/bare-plugin/

### Features

<!--section:plugin,features-->

All https://build.blades.ninja/plugin/features/ except [mdAutoRawTags](//build.blades.ninja/plugin/features/markdown-auto-raw/) are included by default,
but you can toggle them like this:

```js {data-caption=buildawesome.config.js}
$config.addPlugin(kitPlugin, {
  autoLinkFavicons: false,
  mdAutoRawTags: true,
});
```

<!--section:plugin-->

### Filters

<!--section:plugin,filters-->

All https://build.blades.ninja/plugin/filters/ are included by default,
but you can toggle them like this:

```js {data-caption=buildawesome.config.js}
$config.addPlugin(kitPlugin, {
  filters: { attr_set: false },
});
```

<!--section-->

---

## Managed, all-in-one **config**uration package

<!--section:config-->

```sh
npm install @anyblades/buildawesome-kit-config @awesome.me/buildawesome
```

Everything is installed automatically; the only manual step is to create a default layout.

For example, using the built-in [Blades templates](https://blades.ninja/tpl/):

```sh
mkdir _includes
cd _includes/
ln -s ../node_modules/@anyblades/blades/_includes/blades
echo "{% extends 'blades/html.njk' %}{% set site = { styles: ['https://cdn.jsdelivr.net/npm/@anyblades/blades@2/css/blades.min.css'] } %}" > default.njk
cd ..
echo "Hello, world! 🎈" > index.md
```

**Done!** 🥷
: Now you can see the <b class="mark-brand">Build Awesome Kit</b> in action by using its own built-in config file:

```sh
npx @awesome.me/buildawesome --serve --config=node_modules/@anyblades/buildawesome-kit-config/buildawesome.config.js
```

---<!--{class}-->

If you don't want to type `--config=...` every time, save it to your `package.json`:

```json
"scripts": {
  "build": "buildawesome --config=node_modules/@anyblades/buildawesome-kit-config/buildawesome.config.js",
  "start": "npm run build -- --serve"
}
```

Now you can simply `npm run start` / `build`! 🥷

Live examples:

- https://github.com/anyblades/buildawesome-micro-starters/tree/main/micro
- https://github.com/anyblades/buildawesome-content-first/tree/main/.build

---

You can also import and use it as a base config:

```js {data-caption=buildawesome.config.js}
import kitConfig from "@anyblades/buildawesome-kit-config";

export default async function ($config) {
  await kitConfig($config);

  // Customize $config further as you like:
  $config.addPlugin(...);
}
```

Live example: https://github.com/anyblades/buildawesome-micro-starters/blob/main/shotpipe-og-images/buildawesome.config.js

<!--section-->

---

## Micro-**starters**

https://build.blades.ninja/starters/

---

## Documentation

<ul class="columns">

<li>
<strong><a href="//build.blades.ninja/plugin/">Core package</a></strong>
<ul><li><a href="//build.blades.ninja/plugin/">Plugin</a></li>
<li><a href="//build.blades.ninja/scripts/">Scripts</a></li></ul>
</li>

<li>
<strong><a href="//build.blades.ninja/plugin/features/">Features</a></strong>
<ul><li><a href="//build.blades.ninja/plugin/features/">Features overview</a></li>
<li><a href="//build.blades.ninja/plugin/features/link-favicons/">Automatic link favicons</a></li>
<li><a href="//build.blades.ninja/plugin/features/markdown-auto-raw/">Markdown auto-raw tags</a></li>
<li><a href="//build.blades.ninja/plugin/features/markdown-hidden-attrs/">Markdown hidden attrs</a></li>
<li><a href="//build.blades.ninja/plugin/features/markdown-newlines/">Markdown newlines</a></li>
<li><a href="//build.blades.ninja/plugin/features/site-globals/">Site globals</a></li>
<li><a href="//build.blades.ninja/plugin/features/virtual-pages/">Virtual pages <mark>NEW</mark></a></li></ul>
</li>

<li>
<strong><a href="//build.blades.ninja/plugin/filters/">Filters</a></strong>
<ul><li><a href="//build.blades.ninja/plugin/filters/">Filters overview</a></li>
<li><a href="//build.blades.ninja/plugin/filters/attr_concat/">attr_concat</a></li>
<li><a href="//build.blades.ninja/plugin/filters/attr_includes/">attr_includes</a></li>
<li><a href="//build.blades.ninja/plugin/filters/attr_set/">attr_set</a></li>
<li><a href="//build.blades.ninja/plugin/filters/date/">date</a></li>
<li><a href="//build.blades.ninja/plugin/filters/fetch/">fetch</a></li>
<li><a href="//build.blades.ninja/plugin/filters/if/">if</a></li>
<li><a href="//build.blades.ninja/plugin/filters/markdownify/">markdownify</a></li>
<li><a href="//build.blades.ninja/plugin/filters/merge/">merge</a></li>
<li><a href="//build.blades.ninja/plugin/filters/remove_tag/">remove_tag</a></li>
<li><a href="//build.blades.ninja/plugin/filters/section/">section</a></li>
<li><a href="//build.blades.ninja/plugin/filters/split/">split <mark>NEW</mark></a></li>
<li><a href="//build.blades.ninja/plugin/filters/strip_tag/">strip_tag</a></li>
<li><a href="//build.blades.ninja/plugin/filters/unindent/">unindent</a></li></ul>
</li>

<li>
<strong><a href="//build.blades.ninja/config/">Pre-configured</a></strong>
<ul><li><a href="//build.blades.ninja/config/">All-in-one package</a></li>
<li><a href="//build.blades.ninja/starters/">Starters</a></li>
<li><a href="//build.blades.ninja/templates/">HTML templates</a></li></ul>
</li>

<li>
<strong><a href="//build.blades.ninja/awesome/">Awesome</a></strong>

</li>

</ul>

---

## Scripts

<!--section:scripts-->

Ready-to-use npm scripts are included within the same core package:

```sh
npm install @anyblades/buildawesome-kit
```

To reuse in your project, link them under `scripts/` subfolder like this:

```sh
mkdir scripts
cd scripts/
ln -s ../node_modules/@anyblades/buildawesome-kit/packages/scripts/package.json
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
: Build Awesome Kit's `npm run start` / `stage` / `build` are ready to use in your project, AND automatically updated via `@anyblades/buildawesome-kit` package.

Live example: https://github.com/anyblades/buildawesome-micro-starters/tree/main/bare-scripts

---

<!--section:featured-->

## <sup style>Featured by</sup><!--A-Z sites, then @users-->

<!--[11ty.dev]-->

- [11tybundle.dev](https://11tybundle.dev/starters/#:~:text=build%20awesome%20kit)
- [sveltiacms.app](https://sveltiacms.app/en/docs/frameworks/eleventy#:~:text=anyblades)
- [@hamatti](https://hamatti.org/posts/markdown-content-split-to-sections-in-eleventy-and-nunjucks/#:~:text=section%20filter)

<!--{.markerless .columns}-->
<!--[hostfurl.com, @johnheenan]-->
