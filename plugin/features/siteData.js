/*<!--section:docs-->

`siteData` adds global `site` data via `eleventyComputed`. All scalar fields from `pkg.site` (`package.json`) and `data.site` (`_data/site.*`) are spread onto `site`; page-level wins over pkg. The asset keys below are **merged** (pkg → site) rather than overridden.

| Variable             | Value / Description                                                          |
| -------------------- | ---------------------------------------------------------------------------- |
| `{{ site.year }}`     | Current year (e.g. `2026`)                                                   |
| `{{ site.prod }}`     | `true` for `eleventy build`, `false` for `eleventy serve`                    |
| `{{ site.styles }}`   | Merged array of stylesheet URLs                                              |
| `{{ site.scripts }}`  | Merged array of script URLs                                                  |
| `{{ site.head_extras }}` | Merged array of custom head HTML/strings                                   |
| `{{ site.body_extras }}` | Merged array of custom body HTML/strings                                   |

The named export `siteData(data)` is also usable directly (e.g. as RSS feed metadata).

<!--section:code-->```js */
const MERGED_KEYS = ["styles", "scripts", "head_extras", "body_extras"];

// Lodash style
export const castArray = (val) => (val == null ? [] : Array.isArray(val) ? val : [val]);

export const concatUnique = (a, b) => [...new Set([...castArray(a), ...castArray(b)])];

export const siteData = (data) => {
  const pkgSite = data.pkg?.site ?? {};
  const dataSite = data.site ?? {};
  return {
    ...pkgSite,
    ...dataSite,
    ...Object.fromEntries(MERGED_KEYS.map((key) => [key, concatUnique(pkgSite[key], dataSite[key])])),
  };
};

export default function ($config) {
  $config.addGlobalData("eleventyComputed", {
    site: (data) => ({
      ...siteData(data),
      prod: process.env.ELEVENTY_RUN_MODE === "build",
      year: new Date().getFullYear(),
    }),
  });
}
//```
