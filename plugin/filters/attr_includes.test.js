import { describe, it } from "node:test";
import assert from "node:assert";
import attrIncludes from "./attr_includes.js";

describe("attrIncludes", () => {
  it("should only work with array attributes, not exact matches", () => {
    const collection = [
      { category: "blog", title: "Post 1" },
      { category: "news", title: "Post 2" },
      { category: "blog", title: "Post 3" },
    ];

    // Non-array attributes are skipped
    const result = attrIncludes(collection, "category", "blog");
    assert.strictEqual(result.length, 0);
  });

  it("should filter items when attribute is an array (includes check)", () => {
    const collection = [
      { tags: ["javascript", "tutorial"], title: "Post 1" },
      { tags: ["python", "tutorial"], title: "Post 2" },
      { tags: ["javascript", "advanced"], title: "Post 3" },
    ];

    const result = attrIncludes(collection, "tags", "javascript");
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, "Post 1");
    assert.strictEqual(result[1].title, "Post 3");
  });

  it("should throw error when collection is not an array", () => {
    assert.throws(() => {
      attrIncludes(null, "category", "blog");
    }, TypeError);
  });

  it("should filter out items without array attributes", () => {
    const collection = [
      { tags: ["javascript"], title: "Post 1" },
      { title: "Post 2" },
      { tags: ["javascript"], title: "Post 3" },
    ];

    const result = attrIncludes(collection, "tags", "javascript");
    assert.strictEqual(result.length, 2);
  });

  it("should work with array attribute directly on item (not in data)", () => {
    const collection = [
      { tags: ["blog"], title: "Post 1" },
      { tags: ["news"], title: "Post 2" },
      { tags: ["blog"], title: "Post 3" },
    ];

    const result = attrIncludes(collection, "tags", "blog");
    assert.strictEqual(result.length, 2);
  });

  it("should handle array that does not include target value", () => {
    const collection = [
      { tags: ["python", "tutorial"], title: "Post 1" },
      { tags: ["ruby", "guide"], title: "Post 2" },
    ];

    const result = attrIncludes(collection, "tags", "javascript");
    assert.strictEqual(result.length, 0);
  });

  it("should handle different value types in arrays", () => {
    const collection = [
      { priorities: [1, 3], title: "Post 1" },
      { priorities: [2, 4], title: "Post 2" },
      { priorities: [1, 5], title: "Post 3" },
    ];

    const result = attrIncludes(collection, "priorities", 1);
    assert.strictEqual(result.length, 2);
  });

  it("should support nested array attributes with dot notation", () => {
    const collection = [
      { data: { categories: ["blog"] }, title: "Post 1" },
      { data: { categories: ["news"] }, title: "Post 2" },
      { data: { categories: ["blog"] }, title: "Post 3" },
    ];

    const result = attrIncludes(collection, "data.categories", "blog");
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, "Post 1");
    assert.strictEqual(result[1].title, "Post 3");
  });

  it("should support nested arrays with dot notation", () => {
    const collection = [
      { data: { tags: ["javascript", "tutorial"] }, title: "Post 1" },
      { data: { tags: ["python", "tutorial"] }, title: "Post 2" },
      { data: { tags: ["javascript", "advanced"] }, title: "Post 3" },
    ];

    const result = attrIncludes(collection, "data.tags", "javascript");
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, "Post 1");
    assert.strictEqual(result[1].title, "Post 3");
  });

  it("should handle deeply nested array paths", () => {
    const collection = [
      { data: { meta: { statuses: ["published"] } }, title: "Post 1" },
      { data: { meta: { statuses: ["draft"] } }, title: "Post 2" },
      { data: { meta: { statuses: ["published"] } }, title: "Post 3" },
    ];

    const result = attrIncludes(collection, "data.meta.statuses", "published");
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, "Post 1");
    assert.strictEqual(result[1].title, "Post 3");
  });

  it("should return empty array when nested array path does not exist", () => {
    const collection = [{ data: { tags: ["blog"] }, title: "Post 1" }, { title: "Post 2" }];

    const result = attrIncludes(collection, "data.nonexistent.path", "value");
    assert.strictEqual(result.length, 0);
  });
});
