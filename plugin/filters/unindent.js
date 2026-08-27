/*<!--section:docs-->

Remove the minimal common indentation from a multi-line string.

<!--section:code-->```js */
export default function (content) {
  const lines = String(content ?? "").split("\n");
  const minIndent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^(\s*)/)[1].length));
  return lines.map((l) => l.slice(minIndent)).join("\n");
}
//```
