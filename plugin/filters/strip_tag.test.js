import { describe, it } from "node:test";
import assert from "node:assert";
import stripTag from "./strip_tag.js";

describe("stripTag", () => {
  it("should strip a tag but keep its inner content", () => {
    const html = "<div><p>Keep this</p></div>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, "<p>Keep this</p>");
  });

  it("should strip multiple instances of the same tag", () => {
    const html = "<div>First</div><p>Middle</p><div>Second</div>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, "First<p>Middle</p>Second");
  });

  it("should handle tags with attributes", () => {
    const html = '<div class="wrapper" id="main">Content</div>';
    const result = stripTag(html, "div");

    assert.strictEqual(result, "Content");
  });

  it("should only strip the specified tag, leaving others intact", () => {
    const html = "<div><span>Keep span</span><em>Keep em</em></div>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, "<span>Keep span</span><em>Keep em</em>");
  });

  it("should handle nested content with the same tag", () => {
    const html = "<div>outer <div>inner</div> text</div>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, "outer inner text");
  });

  it("should return original HTML if tag does not exist", () => {
    const html = "<p>Some text</p>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, html);
  });

  it("should handle empty or null input", () => {
    assert.strictEqual(stripTag("", "div"), "");
    assert.strictEqual(stripTag(null, "div"), null);
    assert.strictEqual(stripTag(undefined, "div"), undefined);
  });

  it("should handle missing or invalid tagName", () => {
    const html = "<div>Content</div>";
    assert.strictEqual(stripTag(html, ""), html);
    assert.strictEqual(stripTag(html, null), html);
    assert.strictEqual(stripTag(html, undefined), html);
  });

  it("should be case-insensitive", () => {
    const html = '<DIV class="foo">Content</DIV>';
    const result = stripTag(html, "div");

    assert.strictEqual(result, "Content");
  });

  it("should preserve whitespace and newlines inside the tag", () => {
    const html = "<div>\n  <p>Line 1</p>\n  <p>Line 2</p>\n</div>";
    const result = stripTag(html, "div");

    assert.strictEqual(result, "\n  <p>Line 1</p>\n  <p>Line 2</p>\n");
  });
});
