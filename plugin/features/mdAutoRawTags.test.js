import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transformAutoRaw } from "./mdAutoRawTags.js";

describe("transformAutoRaw", () => {
  it("should wrap opening double curly braces with raw tags", () => {
    const input = "Use {{ variable }} to output.";
    const expected = "Use {% raw %}{{{% endraw %} variable {% raw %}}}{% endraw %} to output.";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should wrap closing double curly braces with raw tags", () => {
    const input = "{{ name }}";
    const expected = "{% raw %}{{{% endraw %} name {% raw %}}}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should wrap opening template tags with raw tags", () => {
    const input = "{% if condition %}";
    const expected = "{% raw %}{%{% endraw %} if condition {% raw %}%}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should wrap closing template tags with raw tags", () => {
    const input = "{% endif %}";
    const expected = "{% raw %}{%{% endraw %} endif {% raw %}%}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should handle multiple Nunjucks patterns in one string", () => {
    const input = "{{ var1 }} and {% if test %} something {% endif %}";
    const expected =
      "{% raw %}{{{% endraw %} var1 {% raw %}}}{% endraw %} and {% raw %}{%{% endraw %} if test {% raw %}%}{% endraw %} something {% raw %}{%{% endraw %} endif {% raw %}%}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should handle multiline content with Nunjucks syntax", () => {
    const input = `# Title
{{ variable }}
Some text
{% for item in items %}
  {{ item }}
{% endfor %}`;
    const expected = `# Title
{% raw %}{{{% endraw %} variable {% raw %}}}{% endraw %}
Some text
{% raw %}{%{% endraw %} for item in items {% raw %}%}{% endraw %}
  {% raw %}{{{% endraw %} item {% raw %}}}{% endraw %}
{% raw %}{%{% endraw %} endfor {% raw %}%}{% endraw %}`;
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should return unchanged content when no Nunjucks syntax is present", () => {
    const input = "This is just plain text with no templates.";
    assert.equal(transformAutoRaw(input), input);
  });

  it("should handle empty string", () => {
    assert.equal(transformAutoRaw(""), "");
  });

  it("should handle content with only Nunjucks syntax", () => {
    const input = "{{}}";
    const expected = "{% raw %}{{{% endraw %}{% raw %}}}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should handle consecutive Nunjucks patterns", () => {
    const input = "{{{{}}}}";
    const expected = "{% raw %}{{{% endraw %}{% raw %}{{{% endraw %}{% raw %}}}{% endraw %}{% raw %}}}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });

  it("should wrap each delimiter individually", () => {
    const input = "Show {{ and }} and {% and %}";
    const expected =
      "Show {% raw %}{{{% endraw %} and {% raw %}}}{% endraw %} and {% raw %}{%{% endraw %} and {% raw %}%}{% endraw %}";
    assert.equal(transformAutoRaw(input), expected);
  });
});
