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

## One utility **Plugin**

<!--section:plugin-->

```sh
npm install @buildawesome.one/plugin
```

Then `addPlugin()` in your config:

```js {data-caption=buildawesome.config.js}
import onePlugin from "@buildawesome.one/plugin";

export default function ($config) {
  $config.addPlugin(onePlugin);
}
```

Live examples:

- https://github.com/buildawesome-one/kit/tree/main/plugin/e2e
- https://github.com/buildawesome-one/kit/tree/main/config

### Plugin features

<!--section:plugin,features-->

All https://buildawesome.one/plugin/features/ except [mdAutoRawTags](//buildawesome.one/plugin/features/markdown-auto-raw/) are included by default,
but you can toggle them like this:

```js {data-caption=buildawesome.config.js}
$config.addPlugin(onePlugin, {
  autoLinkFavicons: false,
  mdAutoRawTags: true,
});
```

<!--section:plugin-->

### Plugin filters

<!--section:plugin,filters-->

All https://buildawesome.one/plugin/filters/ are included by default,
but you can toggle them like this:

```js {data-caption=buildawesome.config.js}
$config.addPlugin(onePlugin, {
  filters: { attr_set: false },
});
```

<!--section-->

---

## All-in-One **Config** package

<!--section:config-->

```sh
npm install @awesome.me/buildawesome @buildawesome.one/config
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
: Now you can see the <b class="mark-brand">Build Awesome One</b> in action by using its own built-in config:

```sh
npx @awesome.me/buildawesome --serve --config=node_modules/@buildawesome.one/config/buildawesome.config.js
```

---<!--{class}-->

If you don't want to type `--config=...` every time, save it in your `package.json`:

```json
"scripts": {
  "build": "buildawesome --config=node_modules/@buildawesome.one/config/buildawesome.config.js",
  "start": "npm run build -- --serve"
}
```

Now you can simply `npm run start` / `build`! 🥷

Live examples:

- https://github.com/buildawesome-one/kit/tree/main/config/e2e
- https://github.com/buildawesome-one/starter/tree/main/.build
- https://github.com/buildawesome-one/examples

---

You can also import and use it as a base config:

```js {data-caption=buildawesome.config.js}
import oneConfig from "@buildawesome.one/config";

export default async function ($config) {
  await oneConfig($config);

  // Customize $config further as you like:
  $config.addPlugin(...);
}
```

Live example: https://github.com/buildawesome-one/examples/tree/main/og-images

<!--section-->

---

## Documentation

<ul class="columns">

<li>
<strong><a href="//buildawesome.one/plugin/">Plugin</a></strong>
<ul><li><a href="//buildawesome.one/plugin/">Install</a></li>
<li><a href="//buildawesome.one/plugin/features/">Features</a><ul><li><a href="//buildawesome.one/plugin/features/link-favicons/">Automatic link favicons</a></li>
<li><a href="//buildawesome.one/plugin/features/markdown-auto-raw/">Markdown auto-raw tags</a></li>
<li><a href="//buildawesome.one/plugin/features/markdown-hidden-attrs/">Markdown hidden attrs</a></li>
<li><a href="//buildawesome.one/plugin/features/markdown-newlines/">Markdown newlines</a></li>
<li><a href="//buildawesome.one/plugin/features/site-globals/">Site globals</a></li>
<li><a href="//buildawesome.one/plugin/features/virtual-pages/">Virtual pages <mark>NEW</mark></a></li></ul></li>
<li><a href="//buildawesome.one/plugin/filters/">Filters</a><ul><li><a href="//buildawesome.one/plugin/filters/attr_concat/">attr_concat</a></li>
<li><a href="//buildawesome.one/plugin/filters/attr_includes/">attr_includes</a></li>
<li><a href="//buildawesome.one/plugin/filters/attr_set/">attr_set</a></li>
<li><a href="//buildawesome.one/plugin/filters/date/">date</a></li>
<li><a href="//buildawesome.one/plugin/filters/fetch/">fetch</a></li>
<li><a href="//buildawesome.one/plugin/filters/if/">if</a></li>
<li><a href="//buildawesome.one/plugin/filters/markdownify/">markdownify</a></li>
<li><a href="//buildawesome.one/plugin/filters/merge/">merge</a></li>
<li><a href="//buildawesome.one/plugin/filters/remove_tag/">remove_tag</a></li>
<li><a href="//buildawesome.one/plugin/filters/section/">section</a></li>
<li><a href="//buildawesome.one/plugin/filters/split/">split <mark>NEW</mark></a></li>
<li><a href="//buildawesome.one/plugin/filters/strip_tag/">strip_tag</a></li>
<li><a href="//buildawesome.one/plugin/filters/unindent/">unindent</a></li></ul></li></ul>
</li>

<li>
<strong><a href="//buildawesome.one/config/">Config</a></strong>

</li>

<li>
<strong><a href="//starter.buildawesome.one/">Starter ↗</a></strong>

</li>

<li>
<strong><a href="//buildawesome.one/undefined">More</a></strong>
<ul><li><a href="//buildawesome.one/awesome/">Awesome</a></li>
<li><a href="//buildawesome.one/cli/">CLI</a></li>
<li><a href="//buildawesome.one/starters/">Starters</a></li>
<li><a href="//buildawesome.one/tpl/">Templating</a></li>
<li><a href="//github.com/buildawesome-one/examples">Examples ↗</a></li></ul>
</li>

</ul>

---

<!--section:featured-->

## <sup style>Featured by</sup><!--A-Z sites, then @users-->

<!--[11ty.dev]-->

- [11tybundle.dev](https://11tybundle.dev/starters/#:~:text=build%20awesome%20kit)
- [sveltiacms.app](https://sveltiacms.app/en/docs/frameworks/eleventy#:~:text=anyblades)
- [@hamatti](https://hamatti.org/posts/markdown-content-split-to-sections-in-eleventy-and-nunjucks/#:~:text=section%20filter)

<!--{.markerless .columns}-->
<!--[hostfurl.com, @johnheenan]-->
