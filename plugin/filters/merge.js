/*<!--section:docs-->

A filter that shallow-merges objects together, similar to Twig's merge filter. Later values override earlier ones. Non-object arguments are ignored.

<!--section:code-->```js */
export default function (first, ...rest) {
  // If first argument is null or undefined, treat as empty object
  if (first === null || first === undefined) {
    first = {};
  }

  // Only support objects
  if (typeof first === "object" && !Array.isArray(first)) {
    // Merge objects using spread operator (shallow merge)
    return rest.reduce(
      (acc, item) => {
        if (item !== null && typeof item === "object" && !Array.isArray(item)) {
          return { ...acc, ...item };
        }
        return acc;
      },
      { ...first },
    );
  }

  // If first is not an object, return empty object
  return {};
}
/*```<!--section:docs-->

### Examples <!-- @TODO: better examples -->

```jinja2
{# Merge configuration objects #}
{% set defaultConfig = { theme: 'light', lang: 'en' } %}
{% set userConfig = { theme: 'dark' } %}
{% set finalConfig = defaultConfig | merge(userConfig) %}

{# Result: { theme: 'dark', lang: 'en' } #}
```

```jinja2
{# Merge page metadata with defaults #}
{% set defaultMeta = {
  author: 'Site Admin',
  category: 'general',
  comments: false
} %}
{% set pageMeta = defaultMeta | merge(page.data) %}
```
*/
