import test from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, slugify, formatBytes } from './format';

test('safeUrl permits http and https only', () => {
  assert.equal(safeUrl('https://example.com/project'), 'https://example.com/project');
  assert.equal(safeUrl('http://insecure.test'), 'http://insecure.test');
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(safeUrl(''), null);
  assert.equal(safeUrl(null), null);
});

test('slugify transforms strings into clean lowercase kebab', () => {
  assert.equal(slugify('E-commerce Mobile App 2026!'), 'e-commerce-mobile-app-2026');
  assert.equal(slugify('  Inspire Academy Portal   '), 'inspire-academy-portal');
});

test('formatBytes gives readable human formats', () => {
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(10485760), '10 MB');
  assert.equal(formatBytes(0), '0 Bytes');
});
