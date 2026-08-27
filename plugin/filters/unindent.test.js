import { test } from "node:test";
import assert from "node:assert";
import unindent from "./unindent.js";

test("unindent - removes common leading spaces", () => {
  const input = "    hello\n    world";
  assert.strictEqual(unindent(input), "hello\nworld");
});

test("unindent - removes common leading tabs", () => {
  const input = "\tfoo\n\tbar";
  assert.strictEqual(unindent(input), "foo\nbar");
});

test("unindent - preserves relative indentation", () => {
  const input = "    if true\n      inner\n    end";
  assert.strictEqual(unindent(input), "if true\n  inner\nend");
});

test("unindent - ignores blank lines when computing min indent", () => {
  const input = "    line1\n\n    line2";
  assert.strictEqual(unindent(input), "line1\n\nline2");
});

test("unindent - does nothing when already at zero indent", () => {
  const input = "hello\nworld";
  assert.strictEqual(unindent(input), "hello\nworld");
});

test("unindent - handles single line", () => {
  assert.strictEqual(unindent("  hello"), "hello");
});

test("unindent - handles null input", () => {
  assert.strictEqual(unindent(null), "");
});

test("unindent - handles undefined input", () => {
  assert.strictEqual(unindent(undefined), "");
});

test("unindent - handles empty string", () => {
  assert.strictEqual(unindent(""), "");
});

test("unindent - mixed indent levels, strips only the minimum", () => {
  const input = "  a\n    b\n  c";
  assert.strictEqual(unindent(input), "a\n  b\nc");
});
