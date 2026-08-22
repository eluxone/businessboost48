import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const homepage = read('index.html');
const sitemap = read('sitemap.xml');
const experience = read('industry.js');
const visualSystem = read('industry-2027.css');

const pages = [
  ['restaurants', 'Restaurant Website Design UK | BusinessBoost48'],
  ['trades', 'Trades Website Design UK | BusinessBoost48'],
  ['retail', 'Retail Website Design UK | BusinessBoost48'],
  ['garages', 'Garage Website Design UK | BusinessBoost48'],
  ['accountants', 'Accountant Website Design UK | BusinessBoost48'],
  ['pet-shops', 'Pet Shop Website Design UK | BusinessBoost48'],
  ['beauty-salons', 'Beauty Salon Website Design UK | BusinessBoost48'],
  ['estate-agents', 'Estate Agent Website Design UK | BusinessBoost48'],
];

function schemaFrom(source) {
  const match = source.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(match, 'expected a JSON-LD graph');
  return JSON.parse(match[1]);
}

test('keeps every niche page indexable, canonical and internally linked', () => {
  for (const [route, title] of pages) {
    const source = read(`${route}/index.html`);
    const url = `https://www.businessboost48.co.uk/${route}/`;

    assert.match(source, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/title>`));
    assert.match(source, new RegExp(`<link rel="canonical" href="${url.replaceAll('.', '\\.')}">`));
    assert.match(source, new RegExp(`<meta property="og:url" content="${url.replaceAll('.', '\\.')}">`));
    assert.match(source, /<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">/);
    assert.match(source, /dateModified":"2026-08-22"/);
    assert.match(source, /href="\/industry-2027\.css\?v=20260822-1"/);
    assert.match(source, /src="\/industry\.js\?v=20260822-1" defer/);
    assert.match(source, /--scene:url\('/);
    assert.match(source, /Demonstration concept · Not client work/);
    assert.match(source, /Written scope before work/);
    assert.match(source, /href="\/#work">Niche websites<\/a>/);

    const schema = schemaFrom(source);
    const graph = schema['@graph'];
    assert.ok(Array.isArray(graph));
    const webPage = graph.find(item => item['@type'] === 'WebPage');
    const service = graph.find(item => item['@type'] === 'Service');
    const description = source.match(/<meta name="description" content="([^"]+)">/)?.[1];
    assert.equal(webPage?.url, url);
    assert.equal(webPage?.description, description);
    assert.equal(service?.url, url);
    assert.equal(service?.provider?.['@id'], 'https://www.businessboost48.co.uk/#organization');
    assert.equal(service?.areaServed?.name, 'United Kingdom');

    assert.ok(homepage.includes(`href="/${route}/"`), `homepage should link to /${route}/`);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), `sitemap should include ${url}`);
  }
});

test('shares the 2027 interaction system across all niche pages', () => {
  assert.match(experience, /const whatsappNumber = '447438893486'/);
  assert.match(experience, /fetch\('\/api\/chat'/);
  assert.match(experience, /localStorage\.getItem\('bb48-sound-muted-v2'\)/);
  assert.match(experience, /addEventListener\('click', unlockFromGesture, true\)/);
  assert.match(experience, /audioContext\.addEventListener\('statechange', syncAudioState\)/);
  assert.match(experience, /history\.splice\(0, history\.length, \.\.\.historyBeforeSend\)/);
  assert.match(experience, /className = 'conversion-dock'/);
  assert.match(experience, /className = 'niche-chat'/);
  assert.match(experience, /aria-label="Open AI website adviser for/);
  assert.match(experience, /maxlength="900"/);
  assert.match(experience, /totalCharacters\(\) > 4800/);
  assert.match(experience, /className = 'related-niches'/);
  assert.doesNotMatch(experience, /Enter with sound|Quiet mode|cursor-circle/);

  assert.match(visualSystem, /\.site-header\.scrolled/);
  assert.match(visualSystem, /\.hero h1 em \{/);
  assert.match(visualSystem, /font-style: normal/);
  assert.match(visualSystem, /\.conversion-dock/);
  assert.match(visualSystem, /\.niche-chat/);
  assert.match(visualSystem, /@media \(max-width: 760px\)/);
  assert.match(visualSystem, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(visualSystem, /cursor:\s*none/);
});

test('uses a distinct art direction on every niche hero', () => {
  const scenes = pages.map(([route]) => read(`${route}/index.html`).match(/--scene:url\('([^']+)'\)/)?.[1]);
  assert.equal(scenes.filter(Boolean).length, pages.length);
  assert.equal(new Set(scenes).size, pages.length);
});
