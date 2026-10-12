import test from 'node:test';
import assert from 'node:assert/strict';

import { addDays, diffDays, formatINR, isValidISODate, todayISO } from '../src/lib/format.js';
import { normalizeCategory, parsePositive, summarizeByCrop, toCSV, totals } from '../src/lib/finance.js';
import { humidityBand, sprayAdvice, windBand } from '../src/lib/spray.js';
import { cropProgress } from '../src/lib/stage.js';
import { cleanText, normalizeIndianPhone } from '../src/lib/validators.js';
import { weatherAlerts } from '../src/lib/advisory.js';
import { parseHash } from '../src/lib/routes.js';
import { weatherKind } from '../src/lib/weatherCodes.js';
import { findAdvice, getOfflineAdvice } from '../src/lib/localAdvisor.js';
import { loadJSON, saveJSON } from '../src/lib/storage.js';

test('todayISO uses local date parts, not UTC', () => {
  // 01:00 local on 12 Oct: toISOString() could still say 11 Oct in UTC+5:30 zones.
  assert.equal(todayISO(new Date(2026, 9, 12, 1, 0, 0)), '2026-10-12');
  assert.equal(todayISO(new Date(2026, 0, 5, 23, 59, 0)), '2026-01-05');
});

test('date helpers', () => {
  assert.equal(isValidISODate('2026-02-30'), false);
  assert.equal(isValidISODate('2024-02-29'), true);
  assert.equal(isValidISODate('12/10/2026'), false);
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(diffDays('2026-10-01', '2026-10-12'), 11);
  assert.equal(diffDays('2026-10-12', '2026-10-01'), -11);
});

test('formatINR groups digits the Indian way and tolerates bad input', () => {
  assert.equal(formatINR(254800), '₹2,54,800');
  assert.equal(formatINR(NaN), '₹0');
});

test('parsePositive rejects empty, zero, negative and non-numeric', () => {
  assert.equal(parsePositive('45'), 45);
  assert.equal(parsePositive('0'), null);
  assert.equal(parsePositive('-3'), null);
  assert.equal(parsePositive(''), null);
  assert.equal(parsePositive('abc'), null);
  assert.equal(parsePositive(undefined), null);
});

test('normalizeCategory maps legacy labels', () => {
  assert.equal(normalizeCategory('Seeds (बीज)'), 'seed');
  assert.equal(normalizeCategory('Fertilizers (उर्वरक)'), 'fertilizer');
  assert.equal(normalizeCategory('Machinery (ट्रैक्टर व जुताई)'), 'machinery');
  assert.equal(normalizeCategory('labour'), 'labour');
  assert.equal(normalizeCategory('???'), 'other');
});

test('totals: margin is null with no revenue, otherwise a percentage', () => {
  assert.deepEqual(totals([{ amount: 100 }], []), { totalExpense: 100, totalRevenue: 0, netProfit: -100, margin: null });
  const t = totals([{ amount: 25 }], [{ totalRevenue: 100 }]);
  assert.equal(t.netProfit, 75);
  assert.equal(t.margin, 75);
  assert.equal(totals([{ amount: NaN }], [{ totalRevenue: undefined }]).totalExpense, 0);
});

test('summarizeByCrop groups case-insensitively', () => {
  const rows = summarizeByCrop(
    [{ crop: 'Wheat', amount: 10 }, { crop: 'wheat ', amount: 5 }],
    [{ crop: 'WHEAT', totalRevenue: 50 }],
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].expense, 15);
  assert.equal(rows[0].revenue, 50);
  assert.equal(rows[0].net, 35);
});

test('toCSV quotes cells and neutralises formula injection', () => {
  const csv = toCSV(['a', 'b'], [['x,y', '=SUM(A1)'], ['say "hi"', 'ok']]);
  assert.equal(csv, 'a,b\r\n"x,y",\'=SUM(A1)\r\n"say ""hi""",ok');
});

test('sprayAdvice thresholds', () => {
  assert.equal(sprayAdvice({ wind: 5, rainProb: 10, temp: 28, precipitation: 0 }).level, 'safe');
  assert.equal(sprayAdvice({ wind: 16, rainProb: 10, temp: 28, precipitation: 0 }).level, 'caution');
  assert.equal(sprayAdvice({ wind: 5, rainProb: 25, temp: 28, precipitation: 0 }).level, 'caution');
  assert.equal(sprayAdvice({ wind: 22, rainProb: 10, temp: 28, precipitation: 0 }).level, 'avoid');
  assert.equal(sprayAdvice({ wind: 5, rainProb: 60, temp: 28, precipitation: 0 }).level, 'avoid');
  assert.equal(sprayAdvice({ wind: 5, rainProb: 0, temp: 28, precipitation: 0.4 }).level, 'avoid');
  assert.equal(sprayAdvice({ wind: 5, rainProb: 0, temp: 40, precipitation: 0 }).level, 'caution');
});

test('humidity and wind bands', () => {
  assert.equal(humidityBand(20), 'dry');
  assert.equal(humidityBand(50), 'balanced');
  assert.equal(humidityBand(90), 'humid');
  assert.equal(windBand(3), 'calm');
  assert.equal(windBand(18), 'moderate');
  assert.equal(windBand(30), 'strong');
});

test('cropProgress derives stage and harvest date', () => {
  assert.equal(cropProgress({ sownDate: '', durationDays: 100, today: '2026-10-12' }), null);
  assert.equal(cropProgress({ sownDate: '2026-10-20', durationDays: 100, today: '2026-10-12' }).stage, 'notSown');
  assert.equal(cropProgress({ sownDate: '2026-10-05', durationDays: 100, today: '2026-10-12' }).stage, 'sowing');
  assert.equal(cropProgress({ sownDate: '2026-09-02', durationDays: 100, today: '2026-10-12' }).stage, 'vegetative');
  assert.equal(cropProgress({ sownDate: '2026-08-12', durationDays: 100, today: '2026-10-12' }).stage, 'flowering');
  assert.equal(cropProgress({ sownDate: '2026-07-20', durationDays: 100, today: '2026-10-12' }).stage, 'maturity');
  const done = cropProgress({ sownDate: '2026-05-01', durationDays: 100, today: '2026-10-12' });
  assert.equal(done.stage, 'harvestDue');
  assert.equal(done.progress, 1);
  const p = cropProgress({ sownDate: '2026-10-02', durationDays: 100, today: '2026-10-12' });
  assert.equal(p.harvestDate, '2027-01-10');
  assert.equal(p.daysToHarvest, 90);
});

test('phone normalisation', () => {
  assert.equal(normalizeIndianPhone('+91 98765 43210'), '9876543210');
  assert.equal(normalizeIndianPhone('098765-43210'), '9876543210');
  assert.equal(normalizeIndianPhone('1234567890'), null);
  assert.equal(normalizeIndianPhone('98765'), null);
  assert.equal(normalizeIndianPhone(null), null);
});

test('cleanText trims, collapses whitespace and caps length', () => {
  assert.equal(cleanText('  a   b \n c ', 50), 'a b c');
  assert.equal(cleanText('abcdef', 3), 'abc');
  assert.equal(cleanText(undefined), '');
});

test('weatherAlerts', () => {
  assert.deepEqual(weatherAlerts({ temp: 28, humidity: 50, wind: 5, rainProb: 0, precipitation: 0 }), [{ id: 'ok', level: 'ok' }]);
  const ids = weatherAlerts({ temp: 40, humidity: 30, wind: 25, rainProb: 70, precipitation: 0 }).map((a) => a.id);
  assert.deepEqual(ids.sort(), ['heat', 'rain', 'wind']);
  assert.ok(weatherAlerts({ temp: 25, humidity: 90, wind: 3, rainProb: 0, precipitation: 0 }).some((a) => a.id === 'fungal'));
});

test('parseHash falls back to dashboard', () => {
  assert.equal(parseHash('#/scanner'), 'scanner');
  assert.equal(parseHash('#scanner'), 'scanner');
  assert.equal(parseHash('#/nope'), 'dashboard');
  assert.equal(parseHash(''), 'dashboard');
  assert.equal(parseHash(undefined), 'dashboard');
});

test('weatherKind covers WMO ranges', () => {
  assert.equal(weatherKind(0), 'clear');
  assert.equal(weatherKind(2), 'partly');
  assert.equal(weatherKind(63), 'rain');
  assert.equal(weatherKind(81), 'rain');
  assert.equal(weatherKind(95), 'thunder');
  assert.equal(weatherKind(999), 'unknown');
});

test('offline advisor matches topics in both languages', () => {
  assert.equal(findAdvice('गेहूं में पीला रतुआ का इलाज क्या है?').id, 'yellowRust');
  assert.equal(findAdvice('How much DAP and urea per acre?').id, 'fertilizer');
  assert.equal(findAdvice('xyzzy'), null);
  assert.match(getOfflineAdvice('yellow rust treatment', 'en'), /propiconazole/i);
  assert.match(getOfflineAdvice('yellow rust treatment', 'en'), /KVK/);
  assert.match(getOfflineAdvice('', 'hi'), /डाइमेंशन्स फार्म/);
});

test('storage helpers survive missing/corrupt storage', () => {
  const saved = globalThis.localStorage;
  try {
    // no storage at all
    delete globalThis.localStorage;
    assert.equal(loadJSON('k', 'fallback'), 'fallback');
    assert.equal(saveJSON('k', 1), false);

    const data = new Map();
    globalThis.localStorage = {
      getItem: (k) => (data.has(k) ? data.get(k) : null),
      setItem: (k, v) => data.set(k, v),
    };
    assert.equal(saveJSON('k', { a: 1 }), true);
    assert.deepEqual(loadJSON('k', null), { a: 1 });
    data.set('bad', '{not json');
    assert.equal(loadJSON('bad', 'fallback'), 'fallback');
    assert.equal(loadJSON('k', 'fallback', Array.isArray), 'fallback');
  } finally {
    if (saved === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = saved;
  }
});
