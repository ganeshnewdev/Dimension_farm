import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChatContents,
  createRateLimiter,
  extractJSON,
  normalizeDiagnosis,
  stripDataUrl,
  validateScanRequest,
} from '../server/lib.js';

test('stripDataUrl removes any data-url prefix', () => {
  assert.equal(stripDataUrl('data:image/jpeg;base64,AAAA'), 'AAAA');
  assert.equal(stripDataUrl('data:image/svg+xml;base64,BBBB'), 'BBBB');
  assert.equal(stripDataUrl('CCCC'), 'CCCC');
});

test('extractJSON copes with fences and surrounding prose', () => {
  assert.deepEqual(extractJSON('{"a":1}'), { a: 1 });
  assert.deepEqual(extractJSON('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(extractJSON('Here you go: {"a":{"b":2}} thanks'), { a: { b: 2 } });
  assert.equal(extractJSON('not json'), null);
  assert.equal(extractJSON('[1,2]'), null);
  assert.equal(extractJSON(undefined), null);
});

test('normalizeDiagnosis coerces untrusted model output', () => {
  const d = normalizeDiagnosis({ conditionName: 'Rust', confidenceScore: '140', visibleSymptoms: 'yellow stripes', organicTreatment: ['neem', 7], severity: '' });
  assert.equal(d.confidenceScore, 100);
  assert.deepEqual(d.visibleSymptoms, ['yellow stripes']);
  assert.deepEqual(d.organicTreatment, ['neem', '7']);
  assert.equal(d.severity, 'Moderate');
  assert.deepEqual(d.chemicalTreatment, []);
  assert.equal(normalizeDiagnosis({ confidenceScore: 'abc' }).confidenceScore, 0);
});

test('validateScanRequest', () => {
  const img = 'A'.repeat(200);
  assert.equal(validateScanRequest(null).ok, false);
  assert.equal(validateScanRequest({ imageBase64: 'short' }).ok, false);
  assert.equal(validateScanRequest({ imageBase64: '!'.repeat(200) }).ok, false);
  assert.equal(validateScanRequest({ imageBase64: 'A'.repeat(10_000_001) }).error, 'tooLarge');
  const ok = validateScanRequest({ imageBase64: `data:image/jpeg;base64,${img}`, mimeType: 'text/html', cropType: '  Wheat  ', notes: 'x'.repeat(500), lang: 'en' });
  assert.equal(ok.ok, true);
  assert.equal(ok.value.mime, 'image/jpeg'); // disallowed mime is replaced
  assert.equal(ok.value.cropType, 'Wheat');
  assert.equal(ok.value.notes.length, 200);
  assert.equal(ok.value.lang, 'en');
  assert.equal(ok.value.data, img);
});

test('buildChatContents starts with a user turn and alternates roles', () => {
  // The old client sent the AI greeting first, which Gemini rejects.
  const contents = buildChatContents(
    [
      { sender: 'ai', text: 'greeting' },
      { sender: 'user', text: 'q1' },
      { sender: 'user', text: 'q1b' },
      { sender: 'ai', text: 'a1' },
    ],
    'q2',
  );
  assert.deepEqual(contents.map((c) => c.role), ['user', 'model', 'user']);
  assert.equal(contents[0].parts[0].text, 'q1\nq1b');
  assert.equal(contents[2].parts[0].text, 'q2');
  assert.deepEqual(buildChatContents(undefined, 'hi'), [{ role: 'user', parts: [{ text: 'hi' }] }]);
});

test('rate limiter allows max per window then recovers', () => {
  let now = 0;
  const allow = createRateLimiter({ windowMs: 1000, max: 2, now: () => now });
  assert.equal(allow('ip'), true);
  assert.equal(allow('ip'), true);
  assert.equal(allow('ip'), false);
  assert.equal(allow('other'), true);
  now = 1500;
  assert.equal(allow('ip'), true);
});
