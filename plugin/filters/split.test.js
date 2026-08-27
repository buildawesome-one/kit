import { test } from "node:test";
import assert from "node:assert";
import split from "./split.js";

test("split - splits by a single character separator", () => {
  assert.deepStrictEqual(split("a,b,c", ","), ["a", "b", "c"]);
});

test("split - splits by a string separator", () => {
  assert.deepStrictEqual(split("foo::bar::baz", "::"), ["foo", "bar", "baz"]);
});

test("split - splits by empty string into characters", () => {
  assert.deepStrictEqual(split("abc", ""), ["a", "b", "c"]);
});

test("split - returns full string in array when separator not found", () => {
  assert.deepStrictEqual(split("hello", ","), ["hello"]);
});

test("split - handles empty string input", () => {
  assert.deepStrictEqual(split("", ","), [""]);
});

test("split - handles null input", () => {
  assert.deepStrictEqual(split(null, ","), [""]);
});

test("split - handles undefined input", () => {
  assert.deepStrictEqual(split(undefined, ","), [""]);
});

test("split - splits on whitespace", () => {
  assert.deepStrictEqual(split("foo bar baz", " "), ["foo", "bar", "baz"]);
});

test("split - splits newlines", () => {
  assert.deepStrictEqual(split("line1\nline2\nline3", "\n"), ["line1", "line2", "line3"]);
});
