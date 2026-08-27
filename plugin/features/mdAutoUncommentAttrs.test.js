import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transformUncommentAttrs } from "./mdAutoUncommentAttrs.js";

describe("transformUncommentAttrs", () => {
  it("should expand a single <!--{...}--> to {...}", () => {
    const input = "Some text <!--{.class}-->";
    const expected = "Some text {.class}";
    assert.equal(transformUncommentAttrs(input), expected);
  });

  it("should expand multiple <!--{...}--> occurrences", () => {
    const input = "<!--{.foo}--> text <!--{.bar}-->";
    const expected = "{.foo} text {.bar}";
    assert.equal(transformUncommentAttrs(input), expected);
  });

  it("should handle attributes with spaces inside braces", () => {
    const input = "Heading <!--{ .class #id }-->";
    const expected = "Heading { .class #id }";
    assert.equal(transformUncommentAttrs(input), expected);
  });

  it("should handle multiline content", () => {
    const input = `# Title <!--{.heading}-->
Some paragraph.
> Blockquote <!--{.note}-->`;
    const expected = `# Title {.heading}
Some paragraph.
> Blockquote {.note}`;
    assert.equal(transformUncommentAttrs(input), expected);
  });

  it("should leave regular HTML comments untouched", () => {
    const input = "<!-- this is a comment -->";
    assert.equal(transformUncommentAttrs(input), input);
  });

  it("should leave <!--{...}--> intact when the content contains a closing brace inside", () => {
    // The regex [^}]* stops at the first }, so nested } prevents a full match
    const input = "<!--{{nested}}-->";
    assert.equal(transformUncommentAttrs(input), input);
  });

  it("should not touch plain text with no comments", () => {
    const input = "Just plain text with {.class} already exposed.";
    assert.equal(transformUncommentAttrs(input), input);
  });

  it("should handle empty string", () => {
    assert.equal(transformUncommentAttrs(""), "");
  });

  it("should handle back-to-back patterns without separator", () => {
    const input = "<!--{.a}--><!--{.b}-->";
    const expected = "{.a}{.b}";
    assert.equal(transformUncommentAttrs(input), expected);
  });

  it("should preserve surrounding markdown content", () => {
    const input = "| Cell 1 <!--{.highlight}--> | Cell 2 |";
    const expected = "| Cell 1 {.highlight} | Cell 2 |";
    assert.equal(transformUncommentAttrs(input), expected);
  });
});
