import { describe, it } from 'node:test';
import assert from 'node:assert';
import removeTag from './remove_tag.js';

describe('removeTag', () => {
  it('should remove a single tag with content', () => {
    const html = '<div>Keep this</div><script>Remove this</script><p>Keep this too</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, '<div>Keep this</div><p>Keep this too</p>');
  });

  it('should remove multiple instances of the same tag', () => {
    const html = '<p>First</p><script>One</script><p>Second</p><script>Two</script><p>Third</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, '<p>First</p><p>Second</p><p>Third</p>');
  });

  it('should handle tags with attributes', () => {
    const html = '<div>Keep</div><script type="text/javascript" src="file.js">Code</script><p>Keep</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, '<div>Keep</div><p>Keep</p>');
  });

  it('should handle self-closing tags', () => {
    const html = '<div>Keep</div><br /><p>Keep</p>';
    const result = removeTag(html, 'br');

    assert.strictEqual(result, '<div>Keep</div><p>Keep</p>');
  });

  it('should return original HTML if tag does not exist', () => {
    const html = '<div>Keep this</div><p>Keep this too</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, html);
  });

  it('should handle empty or null input', () => {
    assert.strictEqual(removeTag('', 'script'), '');
    assert.strictEqual(removeTag(null, 'script'), null);
    assert.strictEqual(removeTag(undefined, 'script'), undefined);
  });

  it('should be case-insensitive', () => {
    const html = '<div>Keep</div><SCRIPT>Remove</SCRIPT><Script>Remove</Script><p>Keep</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, '<div>Keep</div><p>Keep</p>');
  });

  it('should handle nested content', () => {
    const html = '<div>Keep</div><script><div>Nested</div></script><p>Keep</p>';
    const result = removeTag(html, 'script');

    assert.strictEqual(result, '<div>Keep</div><p>Keep</p>');
  });
});
