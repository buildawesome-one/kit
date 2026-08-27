/*<!--section:docs-->

An inline conditional/ternary operator filter that returns one value if a condition is truthy, and another if it's falsy. Similar to Nunjucks' inline if syntax, it is especially useful in `.liquid` templates.

<!--section:code-->```js */
export default function (trueValue, condition, falseValue = "") {
  // Treat empty objects {} as falsy
  if (condition && typeof condition === "object" && !Array.isArray(condition) && Object.keys(condition).length === 0) {
    return falseValue;
  }
  return !!condition ? trueValue : falseValue;
}
/*```<!--section:docs-->

### Examples <!-- @TODO: better examples -->

```liquid
<button class="{{ 'btn-primary' | if: isPrimary | default: 'btn-secondary' }}">
  Click me
</button>

<input type="checkbox" {{ 'checked' | if: isChecked }}>
```
<!--section--> */
