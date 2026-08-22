import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const industryPages = [
  'accountants/index.html',
  'beauty-salons/index.html',
  'estate-agents/index.html',
  'garages/index.html',
  'pet-shops/index.html',
  'restaurants/index.html',
  'retail/index.html',
  'trades/index.html',
];

test('publishes the phase-shift logo system and stable icon URLs', () => {
  for (const asset of ['brand-mark-light.svg', 'brand-mark-dark.svg', 'favicon.svg', 'businessboost48-logo.svg']) {
    const source = read(asset);
    assert.match(source, /<svg/);
    assert.match(source, /#d7ff63/i);
  }

  assert.match(read('favicon.svg'), /fill="#080a0d"/i);
  assert.ok(readFileSync(new URL('logo.png', root)).byteLength > 10_000);
});

test('uses the responsive logo across the homepage and supporting pages', () => {
  const homepage = read('index.html');
  assert.match(homepage, /aria-label="BusinessBoost48 — home"/);
  assert.match(homepage, /src="\/brand-mark-light\.svg"/);
  assert.match(homepage, /src="\/brand-mark-dark\.svg"/);
  assert.match(homepage, /@media\(max-width:420px\)\{\.logo-word\{display:none\}/);

  const privacy = read('privacy.html');
  assert.match(privacy, /src="\/brand-mark-dark\.svg"/);
  assert.match(privacy, /rel="apple-touch-icon" href="\/logo\.png"/);

  for (const page of industryPages) {
    const source = read(page);
    assert.match(source, /src="\/brand-mark-light\.svg"/);
    assert.match(source, /aria-label="BusinessBoost48 — home"/);
  }
});
