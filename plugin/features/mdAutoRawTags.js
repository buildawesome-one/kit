/*<!--section:docs-->

`mdAutoRawTags` feature wraps template syntax `{{, }}, {%, %}` with `{% raw %}` tags
to prevent them from being processed by the template engine in Markdown files.

<!--section:code-->```js */
export function transformAutoRaw(content) {
  // This regex looks for {{, }}, {%, or %} individually and wraps them
  return content.replace(/({{|}}|{%|%})/g, "{% raw %}$1{% endraw %}");
}

export default function mdAutoRawTags($config) {
  $config.addPreprocessor("mdAutoRawTags", "md", (data, content) => {
    return transformAutoRaw(content);
  });
}
//```
