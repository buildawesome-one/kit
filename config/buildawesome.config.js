//<!--section:code-->```js

/* Plugins (core > official > contrib) */
import { RenderPlugin } from "@awesome.me/buildawesome";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import kitPlugin from "@anyblades/buildawesome-kit";
import pluginTOC from "@uncenter/eleventy-plugin-toc";
import { siteData } from "@anyblades/buildawesome-kit/features/siteData.js";
/* Libraries (A-Z) */
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import slugify from "@sindresorhus/slugify";
import YAML from "yaml";
/* System (A-Z) */
import fs from "node:fs";
import path from "node:path";

/**
 * Eleventy Configuration
 * @param {Object} $config - The Eleventy configuration object
 * @returns {Object} The Eleventy configuration object
 */
export default async function ($config, pluginOptions = {}) {
  /* Dirs */
  const inputDir = $config.directories.input;
  const outputDir = $config.directories.output;
  const _cwd = path.basename(process.cwd());
  const cwdDotDir = _cwd.startsWith(".") ? _cwd : undefined;
  if (cwdDotDir) {
    // Per https://www.11ty.dev/docs/config/#directory-for-includes
    // Order matters, put this at the top of your configuration file.
    // This is relative to your input directory!
    $config.setIncludesDirectory(`${cwdDotDir}/_includes/`);
  }

  /* Plugins */
  $config.addBundle("css", { bundleHtmlContentFromSelector: "style" }); // per https://www.11ty.dev/docs/plugins/bundle/#bundling-html-node-content
  $config.addTransform("inject-css-bundle", function (content) {
    const isHtml = typeof this.page.outputPath === "string" && this.page.outputPath.endsWith(".html");
    const css = isHtml && $config.getFilter("getBundle").call(this, "css");
    return css ? content.replace("</head>", `<style>${css}</style></head>`) : content;
  });
  $config.addPlugin(RenderPlugin);
  $config.addPlugin(eleventyNavigationPlugin);
  $config.addPlugin(kitPlugin, pluginOptions.plugins?.["@anyblades/buildawesome-kit"] ?? { mdAutoRawTags: true });
  $config.addPlugin(pluginTOC, {
    ignoredElements: [".header-anchor", "sub"],
    ul: true,
    wrapper: (toc) => `${toc}`,
  });
  // Feed plugin
  $config.addCollection("feed", (collectionApi) =>
    collectionApi.getAll().filter((item) => item.data.date || item.data.revised),
  );
  $config.addPlugin(feedPlugin, {
    // per https://www.11ty.dev/docs/plugins/rss/#virtual-template
    type: "atom", // or "rss", "json"
    outputPath: "/feed.xml",
    collection: {
      name: "feed",
      limit: 100, // 0 means no limit
    },
    templateData: {
      eleventyComputed: {
        metadata: (data) => {
          return {
            base: "https://example.com/", // sample/fallback value required by Feed plugin
            ...siteData(data),
          };
        },
      },
    },
  });

  /* Libraries */
  let md = markdownIt({
    html: true,
    linkify: true,
  })
    .use(markdownItAnchor, {
      slugify: slugify, // @TODO: TRICKS
      permalink: markdownItAnchor.permalink.ariaHidden(),
    })
    .use(markdownItAttrs);
  await import("markdown-it-deflist")
    .then(({ default: markdownItDeflist }) => {
      md.use(markdownItDeflist);
    })
    .catch(() => {
      /* optional – skip if not installed */
    });
  $config.setLibrary("md", md);
  //```<!--section:code,markdownify-->```js
  $config.addFilter("markdownify", (content) => md.render(String(content ?? "")));
  //```<!--section:code-->```js

  /* Data */
  $config.addDataExtension("yml,yaml", (contents) => YAML.parse(contents));
  $config.addGlobalData("layout", "default");
  // Sitemap
  $config.addTemplate("sitemap.xml.njk", "", {
    permalink: "/sitemap.xml",
    layout: "blades/sitemap.xml.njk",
    eleventyExcludeFromCollections: true,
  });

  /* Build */
  $config.addPassthroughCopy(
    {
      // From current working directory
      _public: "./",
      media: "./media/",
      // Additionally from input dirs like `../` or `./site-1`
      [`${inputDir}/_public/`]: "./",
      [`${inputDir}/media/`]: "./media/",
    },
    { expand: true }, // This follows/resolves symbolic links
  );

  /* Internal */
  // Jekyll templates compatibility
  $config.addFilter("relative_url", (content) => content); // dummy
  $config.setLiquidOptions({
    dynamicPartials: false, // allows unquoted Jekyll-style includes
    root: [
      $config.directories.includes,
      fs.realpathSync(path.resolve("./node_modules/@anyblades/blades/_includes")), // for symlinks to work after https://github.com/harttle/liquidjs/pull/870
    ],
  });
  // Dev tools
  $config.setChokidarConfig({ followSymlinks: true }); // follow symlinks in Chokidar used by 11ty to watch files
  if (cwdDotDir) {
    $config.watchIgnores.add(`../${cwdDotDir}/${outputDir}`); // !!! avoid circular watching
    $config.watchIgnores.add(`../${cwdDotDir}/node_modules/`); // avoid performance issues
  }
}
//```
