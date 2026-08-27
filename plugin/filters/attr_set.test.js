import { test } from "node:test";
import assert from "node:assert";
import attrSet from "./attr_set.js";

test("attrSet - sets a single attribute", () => {
  const result = attrSet({ a: 1 }, "b", 2);
  assert.deepStrictEqual(result, { a: 1, b: 2 });
});

test("attrSet - overrides an existing attribute", () => {
  const result = attrSet({ a: 1, b: 2 }, "b", 3);
  assert.deepStrictEqual(result, { a: 1, b: 3 });
});

test("attrSet - sets attribute on empty object", () => {
  const result = attrSet({}, "key", "value");
  assert.deepStrictEqual(result, { key: "value" });
});

test("attrSet - does not modify original object", () => {
  const original = { a: 1, b: 2 };
  const result = attrSet(original, "c", 3);

  assert.deepStrictEqual(original, { a: 1, b: 2 });
  assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
});

test("attrSet - works with different value types", () => {
  const obj = { name: "test" };

  // String
  assert.deepStrictEqual(attrSet(obj, "str", "value"), { name: "test", str: "value" });

  // Number
  assert.deepStrictEqual(attrSet(obj, "num", 42), { name: "test", num: 42 });

  // Boolean
  assert.deepStrictEqual(attrSet(obj, "bool", true), { name: "test", bool: true });

  // Array
  assert.deepStrictEqual(attrSet(obj, "arr", [1, 2, 3]), { name: "test", arr: [1, 2, 3] });

  // Object
  assert.deepStrictEqual(attrSet(obj, "nested", { x: 1 }), { name: "test", nested: { x: 1 } });

  // Null
  assert.deepStrictEqual(attrSet(obj, "nil", null), { name: "test", nil: null });

  // Undefined
  assert.deepStrictEqual(attrSet(obj, "undef", undefined), { name: "test", undef: undefined });
});

test("attrSet - can chain multiple calls", () => {
  const original = { a: 1 };
  const step1 = attrSet(original, "b", 2);
  const step2 = attrSet(step1, "c", 3);
  const step3 = attrSet(step2, "d", 4);

  assert.deepStrictEqual(original, { a: 1 });
  assert.deepStrictEqual(step3, { a: 1, b: 2, c: 3, d: 4 });
});

test("attrSet - handles special characters in keys", () => {
  const result = attrSet({}, "data-id", 123);
  assert.deepStrictEqual(result, { "data-id": 123 });
});

test("attrSet - works with numeric keys", () => {
  const result = attrSet({ a: 1 }, "0", "zero");
  assert.deepStrictEqual(result, { a: 1, 0: "zero" });
});
