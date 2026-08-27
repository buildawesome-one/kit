/*<!--section:docs-->

A filter that removes a specified HTML element from provided HTML content. It removes the tag along with its content, including self-closing tags.

**Security note:** While this filter can help sanitize HTML content, it should not be relied upon as the sole security measure. For critical security requirements, use a dedicated HTML sanitization library on the server side before content reaches your templates.

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

  // Remove opening and closing tags along with their content
  // This regex matches: <tag attributes>content</tag>
  const regex = new RegExp(`<${escapedTag}(?:\\s[^>]*)?>.*?<\\/${escapedTag}>`, "gis");
  let result = html.replace(regex, "");

  // Also remove self-closing tags: <tag />
  const selfClosingRegex = new RegExp(`<${escapedTag}(?:\\s[^>]*)?\\s*\\/?>`, "gi");
  result = result.replace(selfClosingRegex, "");

  return result;
}
/*```<!--section:docs-->

### Examples <!-- @TODO: better examples -->

Remove all script tags from content

```jinja2
{% set cleanContent = htmlContent | remove_tag('script') %}

{{ cleanContent | safe }}
```
*/
