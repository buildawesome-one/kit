/*<!--section:docs-->

`mdAutoNl2br` feature amends the markdown library to automatically convert `\n`
to `<br>` tags in text content, which is particularly useful for line breaks
inside markdown tables where standard newlines don't work.

> **NOTE:** This processes literal `\n` sequences (backslash followed by 'n'), not actual newline characters. Type `\n` in your source files where you want line breaks.

<!--section:code-->```js */
export function transformNl2br(content) {
  // Replace double \n\n first, then single \n to avoid double conversion
  return content.replace(/\\n\\n/g, "<br>").replace(/\\n/g, "<br>");
}

export default function mdAutoNl2br($config) {
  $config.amendLibrary("md", (mdLib) => {
    mdLib.renderer.rules.text = (tokens, idx) => {
      return transformNl2br(tokens[idx].content);
    };
  });
}
//```
