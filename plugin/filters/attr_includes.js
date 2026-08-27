/*<!--section:docs-->

A filter that filters a list of items by checking if an attribute array includes a target value. Supports nested attribute names using dot notation.

<!--section:code-->```js */
import lodash from "@11ty/lodash-custom";
const { get } = lodash;

export default function (collection, attrName, targetValue) {
  // If no targetValue, return original collection
  if (!targetValue) {
    return collection;
  }

  return collection.filter((item) => {
    // Get the attribute value from the item (supports nested paths like "data.tags")
    const attrValue = get(item, attrName);

    // If the attribute is an array, check if it includes the target value
    if (Array.isArray(attrValue)) {
      return attrValue.includes(targetValue);
    }

    // Otherwise skip this item
    return false;
  });
}
/*```<!--section:docs-->

### Examples

Get all posts that include `#javascript` tag

```jinja2 {data-caption="in .njk:"}
{% set js_posts = collections.all | attr_includes('data.tags', '#javascript') %}

{% for post in js_posts %}
  <h2>{{ post.data.title }}</h2>
{% endfor %}
```
*/
