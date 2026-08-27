/*<!--section:docs-->

`virtualPages` generates Eleventy pages from a `pages.yaml` file in the input directory. Each entry's front-matter data is passed directly to `addTemplate`; if the entry has a `permalink` field it is used to derive the virtual slug (e.g. `permalink: /about/` → `.about/index.md`), otherwise the array index is used.

<!--section:code-->```js */
import { readFileSync } from "fs";
import YAML from "js-yaml";

export default function ($config) {
  // Virtual pages
  const pages = YAML.load(readFileSync($config.directories.input + "/pages.yaml", "utf8"));
  for (const [index, data] of pages.entries()) {
    const virtualSlug = data.permalink ? data.permalink + "index" : index;
    // console.log(data, virtualSlug);
    $config.addTemplate("." + virtualSlug + ".md", "", data);
  }
}
//```
