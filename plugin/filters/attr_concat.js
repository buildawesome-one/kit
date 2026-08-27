/*<!--section:docs-->

A filter that concatenates values to an attribute array, returning a new object with the combined array. Useful for adding items to arrays like tags, classes, or other list-based attributes.

<!--section:code-->```js */
export default function (obj, attr, values) {
  // Get the existing attribute value, default to empty array if not present
  const existingArray = obj?.[attr] || [];

  // Check if existing value is an array, convert if not
  if (!Array.isArray(existingArray)) {
    console.error(`attrConcat: Expected ${attr} to be an array, got ${typeof existingArray}`);
  }

  // Process the values argument
  let valuesToAdd = [];
  if (Array.isArray(values)) {
    valuesToAdd = values;
  } else if (typeof values === "string" && values.length >= 2 && values.at(0) == "[" && values.at(-1) == "]") {
    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(values);
      if (Array.isArray(parsed)) {
        valuesToAdd = parsed;
      } else {
        valuesToAdd = [values];
      }
    } catch {
      // Not valid JSON, treat as single value
      valuesToAdd = [values];
    }
  } else {
    // If it's a single value, wrap it in an array
    valuesToAdd = [values];
  }

  // Combine arrays and remove duplicates using Set
  const combinedArray = [...new Set([...existingArray, ...valuesToAdd])];

  // Return a new object with the combined array
  return {
    ...obj,
    [attr]: combinedArray,
  };
}
/*```<!--section:docs-->

### Examples

Add tags to a post object in `.njk`:

```jinja2
{% set enhancedPost = post | attr_concat('tags', ['featured', 'popular']) %}
```
*/
