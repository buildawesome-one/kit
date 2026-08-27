import { test } from 'node:test';
import assert from 'node:assert';
import merge from './merge.js';

test('merge - merges two objects', () => {
  const result = merge({ a: 1, b: 2 }, { c: 3, d: 4 });
  assert.deepStrictEqual(result, { a: 1, b: 2, c: 3, d: 4 });
});

test('merge - merges objects with override', () => {
  const result = merge({ a: 1, b: 2 }, { b: 3, c: 4 });
  assert.deepStrictEqual(result, { a: 1, b: 3, c: 4 });
});

test('merge - merges multiple objects', () => {
  const result = merge({ a: 1 }, { b: 2 }, { c: 3 });
  assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
});

test('merge - handles null first argument', () => {
  const result = merge(null, { a: 1 });
  assert.deepStrictEqual(result, { a: 1 });
});

test('merge - handles undefined first argument', () => {
  const result = merge(undefined, { a: 1 });
  assert.deepStrictEqual(result, { a: 1 });
});

test('merge - does not modify original objects', () => {
  const original = { a: 1 };
  const result = merge(original, { b: 2 });

  assert.deepStrictEqual(original, { a: 1 });
  assert.deepStrictEqual(result, { a: 1, b: 2 });
});

test('merge - returns empty object for arrays', () => {
  const result = merge([1, 2], [3, 4]);
  assert.deepStrictEqual(result, {});
});

test('merge - returns empty object for primitives', () => {
  const result = merge('string', { a: 1 });
  assert.deepStrictEqual(result, {});
});

test('merge - ignores non-object arguments in rest', () => {
  const result = merge({ a: 1 }, 'string', { b: 2 }, null, { c: 3 });
  assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
});
