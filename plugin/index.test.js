import { test } from "node:test";
import assert from "node:assert";
import { discoverModules } from "./plugin.js";

test("discoverModules - project root returns only 'plugin'", () => {
  const result = discoverModules("./");
  assert.deepStrictEqual(result, { plugin: true });
});
