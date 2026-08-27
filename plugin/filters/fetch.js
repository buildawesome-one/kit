/*<!--section:docs-->

A filter that fetches content from remote URLs or local files. For local paths, it reads files relative to the input directory.

For remote URLs, it uses `@11ty/eleventy-fetch` to download and cache files:

```sh
npm install @11ty/eleventy-fetch
```

> `NOTE:` If `@11ty/eleventy-fetch` is not installed, this filter will not be available. The plugin automatically detects whether the package is installed and only enables the filter if it's present.

<!--section:code-->```js */
import EleventyFetch from "@11ty/eleventy-fetch";
import path from "path";
import fs from "fs/promises";

export default async function (url) {
  if (!url) {
    throw new Error("fetch filter requires a URL or path");
  }

  // Get the input directory from Eleventy config
  const inputDir = this.eleventy.directories.input;

  // Check if it's a URL or local path
  const isUrl = url.startsWith("http://") || url.startsWith("https://");

  try {
    if (isUrl) {
      // Handle remote URLs with eleventy-fetch
      const cacheDirectory = path.join(inputDir, "_downloads");
      const content = await EleventyFetch(url, {
        duration: "1d", // Cache for 1 day by default
        type: "text", // Return as text
        directory: cacheDirectory,
      });
      return content.toString(); // toString() handles bytes cache (inside eleventyComputed)
    } else {
      // Handle local file paths relative to input directory
      const filePath = path.join(inputDir, url);
      const content = await fs.readFile(filePath, "utf-8");
      return content;
    }
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}
/*```<!--section:docs-->

### Examples

```jinja2
{# Fetch and display remote content #}
{% set readme = "https://raw.githubusercontent.com/user/repo/main/README.md" | fetch %}
<div class="readme">
  {{ readme | markdown | safe }}
</div>

{# Fetch JSON data from API #}
{% set data = "https://api.example.com/data.json" | fetch %}
{% set items = data | fromJson %}
{% for item in items %}
  <p>{{ item.title }}</p>
{% endfor %}

{# Include local file content #}
{% set changelog = "CHANGELOG.md" | fetch %}
{{ changelog | markdown | safe }}

{# Fetch CSS from CDN and inline it #}
<style>
  {{ "https://cdn.example.com/styles.css" | fetch }}
</style>

{# Reuse content across pages #}
{% set sharedContent = "_includes/shared/footer.html" | fetch %}
{{ sharedContent | safe }}
```
*/
