/*<!--section:docs-->

A filter that extracts a named section from content marked with HTML comments. This is useful for splitting a single content file (like a Markdown post) into multiple parts that can be displayed and styled independently in your templates.

<!--section:code-->```js */
export default function (content, sectionName) {
  if (!content || typeof content !== "string") {
    return content;
  }

  if (typeof sectionName !== "string" || !sectionName) {
    return "";
  }

  // Normalize section name for comparison (trim whitespace)
  const targetName = sectionName.trim().toLowerCase();

  // Regex to match section markers with content up to the next section or end of string
  // Captures: (1) section names, (2) content until next section marker or end
  const sectionRegex = /<!--section:([^>]+)-->([\s\S]*?)(?=<!--section|$)/g;

  let results = [];
  let match;

  // Find all sections
  while ((match = sectionRegex.exec(content)) !== null) {
    const namesStr = match[1];
    const sectionContent = match[2];
    const names = namesStr.split(",").map((n) => n.trim().toLowerCase());

    // Check if any of the names match the target
    if (names.includes(targetName)) {
      results.push(sectionContent);
    }
  }

  // Join all matching sections
  return results.join("");
}
/*```<!--section:docs-->

## Usage <!-- @TODO: better examples -->

1. Mark sections in your content file (e.g., `post.md`):

⚠️ `NOTE:` The `¡` symbol is used instead of `!` only to give examples below. Use `!` in your actual content files.

```markdown
# My Post

<¡--section:intro-->

This is the introduction that appears at the top of the page.

<¡--section:main-->

This is the main body of the post with all the details.

<¡--section:summary,sidebar-->

This content appears in both the summary and the sidebar!
```

2. Use the filter in your templates:

```jinja2
{# Get the intro section #}
<div class="page-intro">
  {{ content | section('intro') | safe }}
</div>

{# Get the main section #}
<article>
  {{ content | section('main') | safe }}
</article>

{# Get the sidebar section #}
<aside>
  {{ content | section('sidebar') | safe }}
</aside>
```
*/
