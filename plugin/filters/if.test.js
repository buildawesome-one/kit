import test from "node:test";
import assert from "node:assert";
import iff from "./if.js";

test("iff returns trueValue when condition is truthy", () => {
  assert.strictEqual(iff("yes", true, "no"), "yes");
  assert.strictEqual(iff("yes", 1, "no"), "yes");
  assert.strictEqual(iff("yes", "truthy", "no"), "yes");
  assert.strictEqual(iff("yes", { a: 1 }, "no"), "yes"); // non-empty object is truthy
  assert.strictEqual(iff("yes", [], "no"), "yes");
});

test("iff returns falseValue when condition is falsy", () => {
  assert.strictEqual(iff("yes", false, "no"), "no");
  assert.strictEqual(iff("yes", 0, "no"), "no");
  assert.strictEqual(iff("yes", "", "no"), "no");
  assert.strictEqual(iff("yes", null, "no"), "no");
  assert.strictEqual(iff("yes", undefined, "no"), "no");
});

test("iff treats empty objects as falsy", () => {
  assert.strictEqual(iff("yes", {}, "no"), "no");
  assert.strictEqual(iff("yes", {}, ""), "");
  assert.strictEqual(iff(100, {}, 200), 200);

  // Non-empty objects should still be truthy
  assert.strictEqual(iff("yes", { a: 1 }, "no"), "yes");
  assert.strictEqual(iff("yes", { nested: {} }, "no"), "yes");
});

test("iff returns falseValue when condition is undefined", () => {
  assert.strictEqual(iff("yes", undefined, "no"), "no");
  assert.strictEqual(iff("yes", undefined), "");
  assert.strictEqual(iff(100, undefined, 200), 200);
});

test("iff returns empty string as default falseValue", () => {
  assert.strictEqual(iff("yes", false), "");
  assert.strictEqual(iff("yes", 0), "");
  assert.strictEqual(iff("yes", null), "");
});

test("iff works with various value types", () => {
  assert.strictEqual(iff(100, true, 200), 100);
  assert.strictEqual(iff(100, false, 200), 200);

  const obj1 = { a: 1 };
  const obj2 = { b: 2 };
  assert.strictEqual(iff(obj1, true, obj2), obj1);
  assert.strictEqual(iff(obj1, false, obj2), obj2);

  const arr1 = [1, 2];
  const arr2 = [3, 4];
  assert.strictEqual(iff(arr1, true, arr2), arr1);
  assert.strictEqual(iff(arr1, false, arr2), arr2);
});

test("iff evaluates condition correctly without type coercion confusion", () => {
  // Common edge cases
  assert.strictEqual(iff("yes", "false", "no"), "yes"); // string 'false' is truthy
  assert.strictEqual(iff("yes", "0", "no"), "yes"); // string '0' is truthy
  assert.strictEqual(iff("yes", NaN, "no"), "no"); // NaN is falsy
});
