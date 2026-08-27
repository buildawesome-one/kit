import { describe, it } from "node:test";
import assert from "node:assert";
import attrConcat from "./attr_concat.js";

describe("attrConcat", () => {
  it("should concatenate array values to existing array attribute", () => {
    const obj = { classes: ["foo", "bar"] };
    const result = attrConcat(obj, "classes", ["baz", "qux"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz", "qux"],
    });
  });

  it("should parse JSON array string", () => {
    const obj = { classes: ["foo", "bar"] };
    const result = attrConcat(obj, "classes", '["baz", "qux", "quux"]');

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz", "qux", "quux"],
    });
  });

  it("should handle single string value (not JSON)", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", "bar baz");

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar baz"],
    });
  });

  it("should create new array if attribute doesn't exist", () => {
    const obj = { name: "test" };
    const result = attrConcat(obj, "classes", ["foo", "bar"]);

    assert.deepStrictEqual(result, {
      name: "test",
      classes: ["foo", "bar"],
    });
  });

  it("should handle empty object", () => {
    const obj = {};
    const result = attrConcat(obj, "classes", ["foo", "bar"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar"],
    });
  });

  it("should handle null object", () => {
    const result = attrConcat(null, "classes", ["foo", "bar"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar"],
    });
  });

  it("should handle single value (non-array, non-string)", () => {
    const obj = { ids: [1, 2] };
    const result = attrConcat(obj, "ids", 3);

    assert.deepStrictEqual(result, {
      ids: [1, 2, 3],
    });
  });

  it("should not mutate original object", () => {
    const obj = { classes: ["foo", "bar"] };
    const result = attrConcat(obj, "classes", ["baz"]);

    assert.deepStrictEqual(obj, { classes: ["foo", "bar"] });
    assert.deepStrictEqual(result, { classes: ["foo", "bar", "baz"] });
    assert.notStrictEqual(obj, result);
  });

  it("should preserve other attributes", () => {
    const obj = { classes: ["foo"], id: "test", data: { value: 42 } };
    const result = attrConcat(obj, "classes", ["bar"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar"],
      id: "test",
      data: { value: 42 },
    });
  });

  it("should handle empty array values", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", []);

    assert.deepStrictEqual(result, {
      classes: ["foo"],
    });
  });

  it("should handle empty string values", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", "");

    assert.deepStrictEqual(result, {
      classes: ["foo", ""],
    });
  });

  it("should handle multiline strings as single value (not JSON)", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", "bar\n\nbaz\n\n\nqux");

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar\n\nbaz\n\n\nqux"],
    });
  });

  it("should remove duplicate values from existing array", () => {
    const obj = { classes: ["foo", "bar"] };
    const result = attrConcat(obj, "classes", ["bar", "baz"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz"],
    });
  });

  it("should remove duplicate values from new array", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", ["bar", "bar", "baz", "baz"]);

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz"],
    });
  });

  it("should handle duplicates in JSON array strings", () => {
    const obj = { classes: ["foo", "bar"] };
    const result = attrConcat(obj, "classes", '["bar", "baz", "bar", "qux"]');

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz", "qux"],
    });
  });

  it("should preserve order and remove only duplicates", () => {
    const obj = { classes: ["a", "b", "c"] };
    const result = attrConcat(obj, "classes", ["b", "d", "e", "a"]);

    assert.deepStrictEqual(result, {
      classes: ["a", "b", "c", "d", "e"],
    });
  });

  it("should parse valid JSON array string", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", '["bar", "baz", "qux"]');

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar", "baz", "qux"],
    });
  });

  it("should treat non-JSON string as single value", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", "bar\nbaz\nqux");

    assert.deepStrictEqual(result, {
      classes: ["foo", "bar\nbaz\nqux"],
    });
  });

  it("should keep plain string as single value", () => {
    const obj = { tags: ["existing"] };
    const result = attrConcat(obj, "tags", "single value");

    assert.deepStrictEqual(result, {
      tags: ["existing", "single value"],
    });
  });

  it("should parse JSON with numbers", () => {
    const obj = { ids: [1, 2] };
    const result = attrConcat(obj, "ids", "[3, 4, 5]");

    assert.deepStrictEqual(result, {
      ids: [1, 2, 3, 4, 5],
    });
  });

  it("should treat invalid JSON as single string value", () => {
    const obj = { classes: ["foo"] };
    const result = attrConcat(obj, "classes", '["bar", "baz"'); // Invalid JSON

    assert.deepStrictEqual(result, {
      classes: ["foo", '["bar", "baz"'],
    });
  });

  it("should treat JSON non-array as single value", () => {
    const obj = { tags: ["foo"] };
    const result = attrConcat(obj, "tags", '{"key": "value"}');

    assert.deepStrictEqual(result, {
      tags: ["foo", '{"key": "value"}'],
    });
  });
});
