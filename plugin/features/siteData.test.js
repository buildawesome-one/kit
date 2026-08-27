import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { siteData, castArray, concatUnique } from "./siteData.js";

describe("siteData", () => {
  it("should merge keys from pkg.site and site, ignoring page-level data[key]", () => {
    const data = {
      pkg: {
        site: {
          title: "My Site",
          head_extras: ["<meta name='pkg-meta' />"],
          body_extras: ["<script src='pkg-script.js'></script>"],
          styles: ["pkg.css"],
          scripts: ["pkg.js"],
        }
      },
      site: {
        title: "Override Site",
        head_extras: ["<meta name='site-meta' />"],
        body_extras: ["<script src='site-script.js'></script>"],
        styles: ["site.css"],
        scripts: ["site.js"],
      },
      head_extras: ["<meta name='page-meta' />"],
      body_extras: ["<script src='page-script.js'></script>"],
      styles: ["page.css"],
      scripts: ["page.js"],
    };

    const result = siteData(data);

    assert.equal(result.title, "Override Site");
    assert.deepEqual(result.head_extras, ["<meta name='pkg-meta' />", "<meta name='site-meta' />"]);
    assert.deepEqual(result.body_extras, ["<script src='pkg-script.js'></script>", "<script src='site-script.js'></script>"]);
    assert.deepEqual(result.styles, ["pkg.css", "site.css"]);
    assert.deepEqual(result.scripts, ["pkg.js", "site.js"]);
  });

  it("should handle missing keys gracefully", () => {
    const data = {
      pkg: {},
      site: {},
    };
    const result = siteData(data);
    assert.deepEqual(result.head_extras, []);
    assert.deepEqual(result.body_extras, []);
    assert.deepEqual(result.styles, []);
    assert.deepEqual(result.scripts, []);
  });

  it("should deduplicate merged keys using Set", () => {
    const data = {
      pkg: {
        site: {
          styles: ["pkg.css", "duplicate.css"],
        }
      },
      site: {
        styles: ["duplicate.css", "site.css"],
      }
    };
    const result = siteData(data);
    assert.deepEqual(result.styles, ["pkg.css", "duplicate.css", "site.css"]);
  });

  it("should support string values instead of arrays for merged keys", () => {
    const data = {
      pkg: {
        site: {
          styles: "pkg.css",
          scripts: ["pkg.js"],
        }
      },
      site: {
        styles: ["site.css"],
        scripts: "site.js",
      }
    };
    const result = siteData(data);
    assert.deepEqual(result.styles, ["pkg.css", "site.css"]);
    assert.deepEqual(result.scripts, ["pkg.js", "site.js"]);
  });
});

describe("castArray", () => {
  it("should return an empty array for null or undefined", () => {
    assert.deepEqual(castArray(null), []);
    assert.deepEqual(castArray(undefined), []);
  });

  it("should return the same array reference if given an array", () => {
    const arr = [1, 2, 3];
    assert.equal(castArray(arr), arr);
  });

  it("should wrap non-array, non-null values in an array", () => {
    assert.deepEqual(castArray("hello"), ["hello"]);
    assert.deepEqual(castArray(123), [123]);
    assert.deepEqual(castArray({ a: 1 }), [{ a: 1 }]);
  });
});

describe("concatUnique", () => {
  it("should concatenate and deduplicate arrays", () => {
    assert.deepEqual(concatUnique([1, 2], [2, 3]), [1, 2, 3]);
  });

  it("should handle null or undefined arguments gracefully", () => {
    assert.deepEqual(concatUnique(null, [1, 2]), [1, 2]);
    assert.deepEqual(concatUnique([1, 2], undefined), [1, 2]);
    assert.deepEqual(concatUnique(null, undefined), []);
  });

  it("should handle single values or mixed types", () => {
    assert.deepEqual(concatUnique("a", "b"), ["a", "b"]);
    assert.deepEqual(concatUnique("a", ["a", "b"]), ["a", "b"]);
  });
});


