import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const homepage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('uses the verified BusinessBoost48 WhatsApp destination for enquiries', () => {
  assert.match(homepage, /data-whatsapp="447438893486"/);
  assert.match(homepage, /https:\/\/wa\.me\/447438893486\?text=/);
  assert.match(homepage, /Request my free review on WhatsApp/);
  assert.doesNotMatch(homepage, /mailto:hello@businessboost48\.co\.uk/);
});

test('publishes a WhatsApp privacy contact and accurate handoff wording', () => {
  assert.match(privacy, /WhatsApp at \+44 7438 893486/);
  assert.match(privacy, /BusinessBoost48 does not receive the message until you press send/);
  assert.doesNotMatch(privacy, /mailto:hello@businessboost48\.co\.uk/);
});
