/*<!--section:docs-->

Split a string into an array by a separator.

<!--section:code-->```js */
export default function (str, sep) {
  return String(str ?? "").split(sep);
}
//```
