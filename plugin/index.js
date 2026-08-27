//<!--section:code-->```js
import { readdirSync } from "node:fs";

export const discoverModules = (dir) =>
  Object.fromEntries(
    readdirSync(new URL(dir, import.meta.url))
      .filter((f) => f.endsWith(".js") && !f.endsWith(".test.js"))
      .map((f) => [f.replace(/\.js$/, ""), true]),
  );

export default async function ($config, userOptions) {
  const defaultOptions = { mdAutoRawTags: false };
  const options = Object.assign(
    {},
    discoverModules("./features"),
    { filters: discoverModules("./filters") },
    defaultOptions,
    userOptions,
  );
  // console.log("[options]", defaultOptions, userOptions, options);

  /* FILTERS
   * Fallback to default list if options.filters doesn't exist
   * By using import.meta.url, Node figures out exactly where your script is installed inside their node_modules folder and targets the directory relative to that script.
   */
  const filterNames = Object.entries(options.filters).filter(([, v]) => v);
  for (const [filterName] of filterNames) {
    console.log("Loading filter: " + filterName + "...");
    try {
      if (filterName == "fetch") await import("@11ty/eleventy-fetch");
      const filterFunc = (await import("./filters/" + filterName + ".js")).default;
      $config.addFilter(filterName, filterFunc);
    } catch (error) {
      console.log("^ N/A ^");
    }
  }

  /* FEATURES */
  delete options.filters;
  const featureNames = Object.entries(options).filter(([, v]) => v);
  for (const [featureName] of featureNames) {
    console.log("Loading feature: " + featureName + "...");
    try {
      const featureConfig = (await import("./features/" + featureName + ".js")).default;
      featureConfig($config);
    } catch (error) {
      console.log("^ N/A ^");
    }
  }
}
//```
