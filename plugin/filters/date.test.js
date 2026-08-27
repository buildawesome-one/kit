import { test } from "node:test";
import assert from "node:assert";
import date from "./date.js";

test("date - formats a date string as YYYY-MM-DD", () => {
  assert.strictEqual(date("2024-03-15"), "2024-03-15");
});

test("date - formats a Date object", () => {
  assert.strictEqual(date(new Date("2024-03-15T00:00:00Z")), "2024-03-15");
});

test("date - formats a timestamp number", () => {
  // 2024-01-01T00:00:00.000Z in ms
  assert.strictEqual(date(1704067200000), "2024-01-01");
});

test("date - strips time portion from a datetime string", () => {
  assert.strictEqual(date("2024-06-21T23:59:59Z"), "2024-06-21");
});

test("date - handles year boundaries (Dec 31)", () => {
  assert.strictEqual(date("2023-12-31T23:59:59Z"), "2023-12-31");
});

test("date - handles leap day", () => {
  assert.strictEqual(date("2024-02-29T00:00:00Z"), "2024-02-29");
});

test("date - returns NaN string for invalid date", () => {
  // Invalid Date produces "Invalid Date" whose ISO string throws; just assert it throws
  assert.throws(() => date("not-a-date"));
});
