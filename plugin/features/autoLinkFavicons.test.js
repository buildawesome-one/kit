import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isExternalUrl,
  cleanLinkText,
  getExtraAttrs,
  buildFaviconLink,
  transformLink,
  replaceLinksInHtml,
} from "./autoLinkFavicons.js";

describe("isExternalUrl", () => {
  it("should return true for http:// URLs", () => {
    assert.equal(isExternalUrl("http://example.com"), true);
    assert.equal(isExternalUrl("http://example.com/path"), true);
  });

  it("should return true for https:// URLs", () => {
    assert.equal(isExternalUrl("https://example.com"), true);
    assert.equal(isExternalUrl("https://example.com/path"), true);
  });

  it("should return false for relative URLs", () => {
    assert.equal(isExternalUrl("/docs/guide"), false);
    assert.equal(isExternalUrl("./relative"), false);
    assert.equal(isExternalUrl("page.html"), false);
  });

  it("should return false for empty string", () => {
    assert.equal(isExternalUrl(""), false);
  });

  it("should return false for protocol-relative and other schemes", () => {
    assert.equal(isExternalUrl("//example.com"), false);
    assert.equal(isExternalUrl("mailto:user@example.com"), false);
  });
});

describe("cleanLinkText", () => {
  it("should remove protocol prefix", () => {
    assert.equal(cleanLinkText("https://example.com/docs"), "example.com/docs");
    assert.equal(cleanLinkText("http://example.com/docs"), "example.com/docs");
    assert.equal(cleanLinkText("https://example.com/docs/guide"), "example.com/docs/guide");
  });

  it("should handle links without protocol", () => {
    assert.equal(cleanLinkText("example.com/docs"), "example.com/docs");
    assert.equal(cleanLinkText("example.com/path/to/page"), "example.com/path/to/page");
  });

  it("should remove trailing slash", () => {
    assert.equal(cleanLinkText("example.com/"), "example.com");
    assert.equal(cleanLinkText("https://example.com/"), "example.com");
  });

  it("should handle root domain (no path)", () => {
    assert.equal(cleanLinkText("example.com"), "example.com");
    assert.equal(cleanLinkText("https://example.com"), "example.com");
  });

  it("should handle whitespace", () => {
    assert.equal(cleanLinkText("  https://example.com/docs  "), "example.com/docs");
    assert.equal(cleanLinkText("\nhttps://example.com/docs\n"), "example.com/docs");
  });

  it("should preserve path after domain", () => {
    assert.equal(cleanLinkText("https://example.com/api/v1/docs"), "example.com/api/v1/docs");
  });

  it("should handle query parameters", () => {
    assert.equal(cleanLinkText("https://example.com/search?q=test"), "example.com/search?q=test");
  });

  it("should handle hash fragments", () => {
    assert.equal(cleanLinkText("https://example.com/page#section"), "example.com/page#section");
  });
});

describe("getExtraAttrs", () => {
  it("should return default attributes when none are present", () => {
    const defaults = {
      title: "example.com",
      target: "_blank",
      rel: "noopener noreferrer",
    };
    const result = getExtraAttrs("", defaults);
    assert.equal(result, ' title="example.com" target="_blank" rel="noopener noreferrer"');
  });

  it("should return only missing attributes when some are present", () => {
    const defaults = {
      title: "example.com",
      target: "_blank",
      rel: "noopener noreferrer",
    };
    const result = getExtraAttrs('target="_self"', defaults);
    assert.equal(result, ' title="example.com" rel="noopener noreferrer"');
  });

  it("should be case-insensitive when checking attributes", () => {
    const defaults = {
      title: "example.com",
    };
    const result = getExtraAttrs('TITLE="custom"', defaults);
    assert.equal(result, "");
  });

  it("should handle empty default dictionary", () => {
    const result = getExtraAttrs('href="https://example.com"', {});
    assert.equal(result, "");
  });

  it("should match attributes respect word boundaries", () => {
    const defaults = {
      title: "example.com",
    };
    // 'customtitle' contains 'title', but is not the 'title' attribute itself
    const result = getExtraAttrs('customtitle="foo"', defaults);
    assert.equal(result, ' title="example.com"');
  });
});

describe("buildFaviconLink", () => {
  it("should create correct HTML with favicon", () => {
    const result = buildFaviconLink('href="https://example.com/docs"', "example.com", "/docs");
    assert.equal(
      result,
      '<a href="https://example.com/docs" title="example.com" target="_blank" rel="noopener noreferrer"><i><img src="https://www.google.com/s2/favicons?domain=example.com&sz=64"></i> /docs</a>',
    );
  });

  it("should handle complex attributes", () => {
    const result = buildFaviconLink('href="https://example.com" class="link"', "example.com", "text");
    assert.equal(
      result,
      '<a href="https://example.com" class="link" title="example.com" target="_blank" rel="noopener noreferrer"><i><img src="https://www.google.com/s2/favicons?domain=example.com&sz=64"></i> text</a>',
    );
  });

  it("should use sz=64 parameter for favicon size", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "text");
    assert.match(result, /sz=64/);
  });

  it("should handle different domains", () => {
    const result = buildFaviconLink('href="https://github.com/repo"', "github.com", "/repo");
    assert.equal(
      result,
      '<a href="https://github.com/repo" title="github.com" target="_blank" rel="noopener noreferrer"><i><img src="https://www.google.com/s2/favicons?domain=github.com&sz=64"></i> /repo</a>',
    );
  });

  it("should preserve link text as provided", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "custom text");
    assert.match(result, /> custom text<\/a>$/);
  });

  it("should not wrap plain text in a span", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "/docs");
    assert.match(result, /> \/docs<\/a>$/);
    assert.doesNotMatch(result, /<span>/);
  });

  it("should wrap text containing HTML tags in a span", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "<em>Example</em>");
    assert.match(result, /> <span><em>Example<\/em><\/span><\/a>$/);
  });

  it("should wrap text containing strong tags in a span", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "<strong>Bold</strong>");
    assert.match(result, /> <span><strong>Bold<\/strong><\/span><\/a>$/);
  });

  it("should wrap text containing code tags in a span", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "<code>npm install</code>");
    assert.match(result, /> <span><code>npm install<\/code><\/span><\/a>$/);
  });

  it("should wrap text with mixed HTML and plain text in a span", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "Visit <em>Example</em> site");
    assert.match(result, /> <span>Visit <em>Example<\/em> site<\/span><\/a>$/);
  });

  it("should add domain as title attribute when not present", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "text");
    assert.match(result, /title="example\.com"/);
  });

  it("should not add title attribute when already present in attrs", () => {
    const result = buildFaviconLink('href="https://example.com" title="Custom Title"', "example.com", "text");
    assert.doesNotMatch(result, /title="example\.com"/);
    assert.match(result, /title="Custom Title"/);
    // Ensure title appears exactly once
    assert.equal((result.match(/title=/g) ?? []).length, 1);
  });

  it("should not add title when existing title uses single quotes", () => {
    const result = buildFaviconLink("href='https://example.com' title='My Link'", "example.com", "text");
    assert.equal((result.match(/title=/gi) ?? []).length, 1);
  });

  it("should add target=_blank when not already present", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "text");
    assert.match(result, /target="_blank"/);
  });

  it("should not add target when already present in attrs", () => {
    const result = buildFaviconLink('href="https://example.com" target="_self"', "example.com", "text");
    assert.doesNotMatch(result, /target="_blank"/);
    assert.match(result, /target="_self"/);
    assert.equal((result.match(/target=/g) ?? []).length, 1);
  });

  it("should add rel=noopener noreferrer when not already present", () => {
    const result = buildFaviconLink('href="https://example.com"', "example.com", "text");
    assert.match(result, /rel="noopener noreferrer"/);
  });

  it("should not add rel when already present in attrs", () => {
    const result = buildFaviconLink('href="https://example.com" rel="nofollow"', "example.com", "text");
    assert.doesNotMatch(result, /rel="noopener noreferrer"/);
    assert.match(result, /rel="nofollow"/);
    assert.equal((result.match(/rel=/g) ?? []).length, 1);
  });

  it("should not add target when existing target uses single quotes", () => {
    const result = buildFaviconLink("href='https://example.com' target='_self'", "example.com", "text");
    assert.equal((result.match(/target=/gi) ?? []).length, 1);
  });

  it("should not add rel when existing rel uses single quotes", () => {
    const result = buildFaviconLink("href='https://example.com' rel='nofollow'", "example.com", "text");
    assert.equal((result.match(/rel=/gi) ?? []).length, 1);
  });
});

describe("transformLink", () => {
  it("should transform plain URL links with sufficient length", () => {
    const result = transformLink(
      '<a href="https://example.com/docs">https://example.com/docs</a>',
      'href="https://example.com/docs"',
      "https://example.com/docs",
      "https://example.com/docs",
    );
    assert.match(
      result,
      /<i><img src="https:\/\/www\.google\.com\/s2\/favicons\?domain=example\.com&sz=64"><\/i> \/docs<\/a>/,
    );
  });

  it("should transform links with short paths (shows domain)", () => {
    // When path is short (<=2 chars), cleanLinkText returns cleanedText (with domain)
    // The link still gets transformed and shows the domain
    const result = transformLink(
      '<a href="https://example.com/a">https://example.com/a</a>',
      'href="https://example.com/a"',
      "https://example.com/a",
      "https://example.com/a",
    );
    assert.match(result, /<i><img[^>]*><\/i> example\.com\/a<\/a>/);
  });

  it("should not transform links when URL is not external", () => {
    const match = '<a href="/docs">Click here</a>';
    const result = transformLink(match, 'href="/docs"', "/docs", "Click here");
    assert.equal(result, match);
  });

  it("should transform root domain links (shows domain)", () => {
    // Root domains are transformed and display the domain name
    const result = transformLink(
      '<a href="https://example.com">example.com</a>',
      'href="https://example.com"',
      "https://example.com",
      "example.com",
    );
    assert.match(result, /<i><img[^>]*><\/i> example\.com<\/a>/);
  });

  it("should transform links ending with slash only (shows domain)", () => {
    // Links with trailing slash are transformed and display the domain name
    const result = transformLink(
      '<a href="https://example.com/">https://example.com/</a>',
      'href="https://example.com/"',
      "https://example.com/",
      "https://example.com/",
    );
    assert.match(result, /<i><img[^>]*><\/i> example\.com<\/a>/);
  });

  it("should handle invalid URLs gracefully", () => {
    const match = '<a href="not-a-url">not-a-url</a>';
    const result = transformLink(match, 'href="not-a-url"', "not-a-url", "not-a-url");
    assert.equal(result, match);
  });

  it("should not transform links whose text already contains ↗", () => {
    const match = '<a href="https://example.com/docs">example.com ↗</a>';
    const result = transformLink(match, 'href="https://example.com/docs"', "https://example.com/docs", "example.com ↗");
    assert.equal(result, match);
  });

  it("should work with http:// protocol", () => {
    const result = transformLink(
      '<a href="http://example.com/docs">http://example.com/docs</a>',
      'href="http://example.com/docs"',
      "http://example.com/docs",
      "http://example.com/docs",
    );
    assert.match(result, /<i><img[^>]*><\/i> \/docs<\/a>/);
  });

  it("should work with https:// protocol", () => {
    const result = transformLink(
      '<a href="https://example.com/docs">https://example.com/docs</a>',
      'href="https://example.com/docs"',
      "https://example.com/docs",
      "https://example.com/docs",
    );
    assert.match(result, /<i><img[^>]*><\/i> \/docs<\/a>/);
  });

  it("should handle longer paths correctly", () => {
    const result = transformLink(
      '<a href="https://example.com/path/to/document">https://example.com/path/to/document</a>',
      'href="https://example.com/path/to/document"',
      "https://example.com/path/to/document",
      "https://example.com/path/to/document",
    );
    assert.match(result, /<i><img[^>]*><\/i> \/path\/to\/document<\/a>/);
  });

  it("should transform any external URL regardless of link text", () => {
    const result = transformLink(
      '<a href="https://example.com/page">Read the documentation</a>',
      'href="https://example.com/page"',
      "https://example.com/page",
      "Read the documentation",
    );
    assert.match(result, /<i><img[^>]*><\/i>/);
  });

  it("should transform external URL even when linkText contains domain without protocol", () => {
    const result = transformLink(
      '<a href="https://example.com/docs">example.com/docs</a>',
      'href="https://example.com/docs"',
      "https://example.com/docs",
      "example.com/docs",
    );
    assert.match(result, /<i><img[^>]*><\/i>/);
  });

  it("should handle malformed URLs by returning original match", () => {
    const match = '<a href="ht!tp://bad-url">ht!tp://bad-url</a>';
    const result = transformLink(match, 'href="ht!tp://bad-url"', "ht!tp://bad-url", "ht!tp://bad-url");
    assert.equal(result, match);
  });

  describe("when linkText.trim() === url (via replaceLinksInHtml)", () => {
    it("should strip domain when path is significant (stripped length > 2)", () => {
      const html = '<a href="https://example.com/docs">https://example.com/docs</a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> \/docs<\/a>/);
    });

    it("should strip domain and handle whitespace in link text", () => {
      const html = '<a href="https://example.com/docs">  https://example.com/docs  </a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> \/docs<\/a>/);
    });

    it("should not strip domain when path is short (stripped length <= 2)", () => {
      const html = '<a href="https://example.com/a">https://example.com/a</a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> example\.com\/a<\/a>/);
    });

    it("should not strip domain for root domain links", () => {
      const html = '<a href="https://example.com/">https://example.com/</a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> example\.com<\/a>/);
    });

    it("should not strip domain when link text is not equal to url", () => {
      const html = '<a href="https://example.com/docs">Visit https://example.com/docs</a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> Visit https:\/\/example\.com\/docs<\/a>/);
    });

    it("should not strip domain when link text is a different URL", () => {
      const html = '<a href="https://example.com/docs">https://example.com/docs/extra</a>';
      const result = replaceLinksInHtml(html, transformLink);
      assert.match(result, /<i><img[^>]*><\/i> example\.com\/docs\/extra<\/a>/);
    });
  });
});


describe("replaceLinksInHtml", () => {
  it("should replace a single anchor link with transformer function", () => {
    const html = '<a href="https://example.com">Click here</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Click here](https://example.com)");
  });

  it("should replace multiple anchor links in HTML", () => {
    const html = '<a href="https://example.com">Link 1</a> and <a href="https://other.com">Link 2</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link 1](https://example.com) and [Link 2](https://other.com)");
  });

  it("should handle links with single quotes in href", () => {
    const html = "<a href='https://example.com'>Link</a>";
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com)");
  });

  it("should handle links with double quotes in href", () => {
    const html = '<a href="https://example.com">Link</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com)");
  });

  it("should capture all attributes in first group", () => {
    const html = '<a href="https://example.com" class="link" target="_blank">Link</a>';
    let capturedAttrs = "";
    const transformer = (match, attrs, url, linkText) => {
      capturedAttrs = attrs;
      return match;
    };
    replaceLinksInHtml(html, transformer);
    assert.equal(capturedAttrs, 'href="https://example.com" class="link" target="_blank"');
  });

  it("should capture URL in second group", () => {
    const html = '<a href="https://example.com/path">Link</a>';
    let capturedUrl = "";
    const transformer = (match, attrs, url, linkText) => {
      capturedUrl = url;
      return match;
    };
    replaceLinksInHtml(html, transformer);
    assert.equal(capturedUrl, "https://example.com/path");
  });

  it("should capture link text in third group", () => {
    const html = '<a href="https://example.com">Click here</a>';
    let capturedText = "";
    const transformer = (match, attrs, url, linkText) => {
      capturedText = linkText;
      return match;
    };
    replaceLinksInHtml(html, transformer);
    assert.equal(capturedText, "Click here");
  });

  it("should preserve content that is not an anchor link", () => {
    const html = '<p>Some text</p><a href="https://example.com">Link</a><div>More text</div>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "<p>Some text</p>[Link](https://example.com)<div>More text</div>");
  });

  it("should handle empty HTML content", () => {
    const html = "";
    const transformer = (match) => match;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "");
  });

  it("should handle HTML with no anchor links", () => {
    const html = "<p>No links here</p><div>Just text</div>";
    const transformer = (match) => "REPLACED";
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, html);
  });

  it("should handle links with query parameters", () => {
    const html = '<a href="https://example.com/search?q=test&lang=en">Search</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Search](https://example.com/search?q=test&lang=en)");
  });

  it("should handle links with hash fragments", () => {
    const html = '<a href="https://example.com/page#section">Section</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Section](https://example.com/page#section)");
  });

  it("should be case-insensitive for anchor tag", () => {
    const html = '<A HREF="https://example.com">Link</A>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com)");
  });

  it("should handle links with additional attributes before href", () => {
    const html = '<a class="link" href="https://example.com" id="mylink">Link</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com)");
  });

  it("should handle links with additional attributes after href", () => {
    const html = '<a href="https://example.com" class="link" id="mylink">Link</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com)");
  });

  it("should handle relative URLs", () => {
    const html = '<a href="/docs/guide">Guide</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Guide](/docs/guide)");
  });

  it("should handle root-relative URLs", () => {
    const html = '<a href="/">Home</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Home](/)");
  });

  it("should not match anchor tags with nested HTML in link text", () => {
    const html = '<a href="https://example.com"><span>Link</span></a>';
    const transformer = (match) => "REPLACED";
    const result = replaceLinksInHtml(html, transformer);
    // Only <em> and <strong> are allowed inside <a>; other tags are not matched
    assert.equal(result, html);
  });

  it("should handle transformer that returns original match unchanged", () => {
    const html = '<a href="https://example.com">Link</a>';
    const transformer = (match) => match;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, html);
  });

  it("should work with transformLink function for real-world usage", () => {
    const html = '<a href="https://example.com/docs">https://example.com/docs</a>';
    const result = replaceLinksInHtml(html, transformLink);
    // transformLink should add favicon for plain URL links
    assert.match(result, /<i><img src="https:\/\/www\.google\.com\/s2\/favicons\?domain=example\.com&sz=64"><\/i> /);
    assert.match(result, /\/docs<\/a>/);
  });

  it("should transform external links even with custom text when using transformLink", () => {
    const html = '<a href="https://example.com/docs">Click here</a>';
    const result = replaceLinksInHtml(html, transformLink);
    // transformLink now adds favicon for any external URL
    assert.match(result, /img src=/);
  });

  it("should handle multiple links with mixed transformation results", () => {
    const html =
      '<a href="https://example.com/docs">https://example.com/docs</a> and <a href="https://other.com">Click</a>';
    const result = replaceLinksInHtml(html, transformLink);
    // Both links should be transformed (any external URL gets a favicon)
    assert.match(result, /img src=/);
    assert.match(result, /Click<\/a>/);
  });

  it("should handle link text with special characters", () => {
    const html = '<a href="https://example.com">Link & More!</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link & More!](https://example.com)");
  });

  it("should handle URLs with ports", () => {
    const html = '<a href="https://example.com:8080/page">Link</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](https://example.com:8080/page)");
  });

  it("should handle http protocol links", () => {
    const html = '<a href="http://example.com">Link</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link](http://example.com)");
  });

  it("should handle links in multiline HTML", () => {
    const html = `<div>
  <a href="https://example.com">Link 1</a>
  <p>Some text</p>
  <a href="https://other.com">Link 2</a>
</div>`;
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.match(result, /\[Link 1\]\(https:\/\/example\.com\)/);
    assert.match(result, /\[Link 2\]\(https:\/\/other\.com\)/);
  });

  it("should handle adjacent anchor links", () => {
    const html = '<a href="https://example.com">Link1</a><a href="https://other.com">Link2</a>';
    const transformer = (match, attrs, url, linkText) => `[${linkText}](${url})`;
    const result = replaceLinksInHtml(html, transformer);
    assert.equal(result, "[Link1](https://example.com)[Link2](https://other.com)");
  });
});

describe("replaceLinksInHtml - em, strong, and code inside link text", () => {
  const passThrough = (match, attrs, url, linkText) => `[${linkText}](${url})`;

  it("should match link text wrapped in <em>", () => {
    const html = '<a href="https://example.com"><em>Example</em></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[<em>Example</em>](https://example.com)");
  });

  it("should match link text wrapped in <strong>", () => {
    const html = '<a href="https://example.com"><strong>Example</strong></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[<strong>Example</strong>](https://example.com)");
  });

  it("should match link text wrapped in <code>", () => {
    const html = '<a href="https://example.com"><code>npm install</code></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[<code>npm install</code>](https://example.com)");
  });

  it("should match plain text mixed with <em>", () => {
    const html = '<a href="https://example.com">Visit <em>Example</em> site</a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[Visit <em>Example</em> site](https://example.com)");
  });

  it("should match plain text mixed with <strong>", () => {
    const html = '<a href="https://example.com">Visit <strong>Example</strong> site</a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[Visit <strong>Example</strong> site](https://example.com)");
  });

  it("should match plain text mixed with <code>", () => {
    const html = '<a href="https://example.com">Run <code>npm install</code> first</a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[Run <code>npm install</code> first](https://example.com)");
  });

  it("should match link text with both <em> and <strong>", () => {
    const html = '<a href="https://example.com"><em>Foo</em> and <strong>Bar</strong></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[<em>Foo</em> and <strong>Bar</strong>](https://example.com)");
  });

  it("should match link text with <code> and <em>", () => {
    const html = '<a href="https://example.com"><code>foo</code> or <em>bar</em></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, "[<code>foo</code> or <em>bar</em>](https://example.com)");
  });

  it("should not match <code> with attributes", () => {
    const html = '<a href="https://example.com"><code class="lang-js">foo()</code></a>';
    const result = replaceLinksInHtml(html, passThrough);
    // <code class="lang-js"> is not a bare <code> tag — should not be matched
    assert.equal(result, html);
  });

  it("should not match <em> with attributes", () => {
    const html = '<a href="https://example.com"><em class="x">Example</em></a>';
    const result = replaceLinksInHtml(html, passThrough);
    // <em class="x"> is not a bare <em> tag — should not be matched
    assert.equal(result, html);
  });

  it("should not match other nested tags such as <span>", () => {
    const html = '<a href="https://example.com"><span>Example</span></a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, html);
  });

  it("should not match <img> inside link text", () => {
    const html = '<a href="https://example.com"><img src="icon.png"> Example</a>';
    const result = replaceLinksInHtml(html, passThrough);
    assert.equal(result, html);
  });

  it("should transform <code> link text via transformLink (end-to-end)", () => {
    const html = '<a href="https://example.com/docs"><code>npm install pkg</code></a>';
    const result = replaceLinksInHtml(html, transformLink);
    assert.match(result, /<i><img[^>]*><\/i>/);
    assert.match(result, /<span><code>npm install pkg<\/code><\/span>/);
  });
});
