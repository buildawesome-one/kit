/*<!--section:docs-->

`mdAutoUncommentAttrs` feature amends the markdown library to automatically expand
HTML-comment-wrapped attribute blocks `<!—-{...}-->` to their raw form
`{...}`, which is useful when attribute syntax needs to be hidden from
HTML parsers but expanded before markdown-it processes them.

Implemented as a core rule so the transformation runs on the raw source
before markdown-it-attrs (or any other plugin) parses the content.

<!--section:code-->```js */
export function transformUncommentAttrs(content) {
  if (content.includes("<!--{")) {
    content = content.replace(/<!--(\{[^}]*\})-->/g, "$1");
  }
  return content;
}

export default function mdAutoUncommentAttrs($config) {
  $config.amendLibrary("md", (mdLib) => {
    mdLib.core.ruler.before("normalize", "uncomment_attrs", (state) => {
      state.src = transformUncommentAttrs(state.src);
    });
  });
}
//```
