import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const homepage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('keeps hero display lettering unclipped and adds restrained signal motion', () => {
  const clippedRule = homepage.indexOf('.hero-copy-line{overflow:hidden}');
  const visibleRule = homepage.indexOf('.hero-copy-line{overflow:visible;line-height:1;padding-bottom:.12em');

  assert.ok(clippedRule >= 0);
  assert.ok(visibleRule > clippedRule);
  assert.match(homepage, /@keyframes accentCurrent/);
  assert.match(homepage, /@keyframes phaseForward/);
  assert.match(homepage, /classList\.toggle\('phase-reverse',!transformed\);if\(heroFieldActive\)playTransition\(\)/);
});

test('starts sound on the first usable interaction without showing a choice panel', () => {
  assert.doesNotMatch(homepage, /class="experience-entry"/);
  assert.doesNotMatch(homepage, /Enter with sound/);
  assert.doesNotMatch(homepage, /Quiet mode/);
  assert.doesNotMatch(homepage, /function showExperience/);
  assert.doesNotMatch(homepage, /quietChoice\.addEventListener/);
  assert.match(homepage, /function installSoundUnlockers/);
  assert.match(homepage, /addEventListener\('pointerdown',unlockFromFirstGesture,\{capture:true,passive:true\}\)/);
  assert.match(homepage, /addEventListener\('touchstart',unlockFromFirstGesture,\{capture:true,passive:true\}\)/);
  assert.match(homepage, /addEventListener\('keydown',unlockFromFirstGesture,true\)/);
  assert.match(homepage, /localStorage\.getItem\('bb48-sound-muted-v2'\)/);
  assert.match(homepage, /localStorage\.removeItem\('bb48-sound'\)/);
});

test('keeps a user mute control and enriches the continuous soundscape', () => {
  assert.match(homepage, /aria-label="Enable cinematic sound"/);
  assert.match(homepage, /setSound\(!soundOn\)/);
  assert.match(homepage, /function startSoundMotif/);
  assert.match(homepage, /7600\+Math\.random\(\)\*3600/);
  assert.match(homepage, /\[220,'sine',\.014\]/);
  assert.match(homepage, /audioCtx\.addEventListener\('statechange',syncAudioState\)/);
  assert.match(homepage, /function handleSoundFailure/);
  assert.match(homepage, /stopSoundMotif\(\);masterGain\.gain\.setTargetAtTime/);
  assert.match(homepage, /installSoundUnlockers\(\)\}\)\}\);/);
});
