import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { transformNl2br } from "./mdAutoNl2br.js";

describe("transformNl2br", () => {
  it("should convert single \\n to <br>", () => {
    const input = "Line 1\\nLine 2";
    const expected = "Line 1<br>Line 2";
    assert.equal(transformNl2br(input), expected);
  });

  it("should convert double \\n\\n to <br>", () => {
    const input = "Line 1\\n\\nLine 2";
    const expected = "Line 1<br>Line 2";
    assert.equal(transformNl2br(input), expected);
  });

  it("should convert multiple \\n sequences", () => {
    const input = "Line 1\\nLine 2\\nLine 3";
    const expected = "Line 1<br>Line 2<br>Line 3";
    assert.equal(transformNl2br(input), expected);
  });

  it("should handle mixed single and double \\n", () => {
    const input = "Line 1\\n\\nLine 2\\nLine 3";
    const expected = "Line 1<br>Line 2<br>Line 3";
    assert.equal(transformNl2br(input), expected);
  });

  it("should handle text without \\n", () => {
    const input = "Just plain text";
    assert.equal(transformNl2br(input), input);
  });

  it("should handle empty content", () => {
    assert.equal(transformNl2br(""), "");
  });

  it("should handle content with only \\n", () => {
    const input = "\\n\\n\\n";
    const expected = "<br><br>";
    assert.equal(transformNl2br(input), expected);
  });

  it("should handle markdown table cell content with \\n", () => {
    const input = "Cell 1\\nCell 1 Line 2\\n\\nCell 1 Line 3";
    const expected = "Cell 1<br>Cell 1 Line 2<br>Cell 1 Line 3";
    assert.equal(transformNl2br(input), expected);
  });

  it("should handle multiple consecutive double \\n\\n", () => {
    const input = "Line 1\\n\\n\\n\\nLine 2";
    const expected = "Line 1<br><br>Line 2";
    assert.equal(transformNl2br(input), expected);
  });

  it("should preserve actual newlines (not literal \\n)", () => {
    const input = "Line 1\nLine 2";
    const expected = "Line 1\nLine 2";
    assert.equal(transformNl2br(input), expected);
  });

  it("should only convert literal backslash-n sequences", () => {
    const input = "Text with\\nbackslash-n and\nreal newline";
    const expected = "Text with<br>backslash-n and\nreal newline";
    assert.equal(transformNl2br(input), expected);
  });
});
