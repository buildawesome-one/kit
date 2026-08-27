import { describe, it } from "node:test";
import assert from "node:assert";
import section from "./section.js";

describe("section", () => {
  it("should extract a single named section", () => {
    const content = `Before
<!--section:intro-->
This is the intro
<!--section:main-->
This is the main`;

    const result = section(content, "intro");
    assert.strictEqual(result, "\nThis is the intro\n");
  });

  it("should extract section up to the next section marker", () => {
    const content = `<!--section:first-->
First content
<!--section:second-->
Second content
<!--section:third-->
Third content`;

    const result = section(content, "second");
    assert.strictEqual(result, "\nSecond content\n");
  });

  it("should extract section up to EOF when no next marker", () => {
    const content = `<!--section:intro-->
Intro content
<!--section:main-->
Main content that goes to the end`;

    const result = section(content, "main");
    assert.strictEqual(result, "\nMain content that goes to the end");
  });

  it("should handle section with multiple names", () => {
    const content = `<!--section:header,nav-->
Shared content
<!--section:main-->
Main content`;

    const resultHeader = section(content, "header");
    const resultNav = section(content, "nav");

    assert.strictEqual(resultHeader, "\nShared content\n");
    assert.strictEqual(resultNav, "\nShared content\n");
  });

  it("should handle section with multiple names (spaces around commas)", () => {
    const content = `<!--section:header, nav , top-->
Shared content
<!--section:main-->
Main content`;

    const resultHeader = section(content, "header");
    const resultNav = section(content, "nav");
    const resultTop = section(content, "top");

    assert.strictEqual(resultHeader, "\nShared content\n");
    assert.strictEqual(resultNav, "\nShared content\n");
    assert.strictEqual(resultTop, "\nShared content\n");
  });

  it("should return empty string for non-existent section", () => {
    const content = `<!--section:intro-->
Content here
<!--section:main-->
More content`;

    const result = section(content, "footer");
    assert.strictEqual(result, "");
  });

  it("should handle empty or null input", () => {
    assert.strictEqual(section("", "test"), "");
    assert.strictEqual(section(null, "test"), null);
    assert.strictEqual(section(undefined, "test"), undefined);
  });

  it("should handle missing section name", () => {
    const content = `<!--section:intro-->Content`;

    assert.strictEqual(section(content, ""), "");
    assert.strictEqual(section(content, null), "");
    assert.strictEqual(section(content, undefined), "");
  });

  it("should be case-insensitive for section names", () => {
    const content = `<!--section:INTRO-->
Content here
<!--section:Main-->
More content`;

    const result1 = section(content, "intro");
    const result2 = section(content, "INTRO");
    const result3 = section(content, "main");
    const result4 = section(content, "MAIN");

    assert.strictEqual(result1, "\nContent here\n");
    assert.strictEqual(result2, "\nContent here\n");
    assert.strictEqual(result3, "\nMore content");
    assert.strictEqual(result4, "\nMore content");
  });

  it("should handle multiple sections with the same name", () => {
    const content = `<!--section:note-->
First note
<!--section:main-->
Main content
<!--section:note-->
Second note
<!--section:footer-->
Footer`;

    const result = section(content, "note");
    assert.strictEqual(result, "\nFirst note\n\nSecond note\n");
  });

  it("should handle sections with no content", () => {
    const content = `<!--section:empty--><!--section:main-->
Main content`;

    const result = section(content, "empty");
    assert.strictEqual(result, "");
  });

  it("should handle content before first section", () => {
    const content = `Some preamble
<!--section:intro-->
Intro content`;

    const result = section(content, "intro");
    assert.strictEqual(result, "\nIntro content");
  });

  it("should handle complex real-world example", () => {
    const content = `# Document Title

<!--section:summary,abstract-->
This is a summary that can be used as an abstract.
<!--section:introduction-->
This is the introduction.
<!--section:methods-->
These are the methods.
<!--section:conclusion,summary-->
This is the conclusion and also part of summary.`;

    const summary = section(content, "summary");
    const introduction = section(content, "introduction");
    const methods = section(content, "methods");
    const conclusion = section(content, "conclusion");

    assert.strictEqual(
      summary,
      "\nThis is a summary that can be used as an abstract.\n\nThis is the conclusion and also part of summary.",
    );
    assert.strictEqual(introduction, "\nThis is the introduction.\n");
    assert.strictEqual(methods, "\nThese are the methods.\n");
    assert.strictEqual(conclusion, "\nThis is the conclusion and also part of summary.");
  });

  it("should handle section markers with extra whitespace", () => {
    const content = `<!--section: intro -->
Content
<!--section: main -->
More`;

    const result = section(content, "intro");
    assert.strictEqual(result, "\nContent\n");
  });
});
