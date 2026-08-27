/*<!--section:docs-->

A filter that creates a new object with an overridden attribute value. This is useful for modifying data objects in templates without mutating the original. Or even constructing an object from scratch.

<!--section:code-->```js */
export default function (obj, key, value) {
  return {
    ...obj,
    [key]: value,
  };
}
/*```<!--section:docs-->

### Examples

How to pass object(s) as argument(s) to a filter in `.liquid`?

```liquid {data-caption="trick for '| renderContent' filter"}
{% assign _ctx = null | attr_set: 'collections', collections %}
{{ ... | renderContent: 'liquid,md', _ctx }}
```
*/
