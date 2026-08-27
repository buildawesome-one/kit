/*<!--section:docs-->

A filter that strips a specified HTML element from content while keeping its inner content intact. Only the opening and closing tags are removed; everything inside the tag is preserved in place.

<!--section:code-->```js */
export default function (html, tagName) {
  if (!html || typeof html !== "string") {
    return html;
  }

  if (typeof tagName !== "string" || !tagName) {
    return html;
  }

  // Escape special regex characters in tag name
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Remove opening tags (with optional attributes): <tag> or <tag attr="val">
  const openingRegex = new RegExp(`<${escapedTag}(?:\\s[^>]*)?>`, "gi");
  let result = html.replace(openingRegex, "");

  // Remove closing tags: </tag>
  const closingRegex = new RegExp(`<\\/${escapedTag}>`, "gi");
  result = result.replace(closingRegex, "");

  return result;
}
/*```<!--section:docs-->

### Examples

Unwrap a wrapping `<div>` from content:

```jinja2
{% set unwrapped = htmlContent | strip_tag('div') %}

{{ unwrapped | safe }}
```
*/
