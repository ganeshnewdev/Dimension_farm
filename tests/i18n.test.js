import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STRINGS } from '../src/i18n/strings.js';
import { translate } from '../src/i18n/translate.js';
import { ROUTES } from '../src/lib/routes.js';
import { EXPENSE_CATEGORIES } from '../src/lib/finance.js';
import { ADVISORY_STAGES, SOIL_TYPES } from '../src/lib/advisory.js';
import { LISTING_CATEGORIES, SOIL_KEYS } from '../src/lib/records.js';

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');

function sourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(p);
    return /\.jsx?$/.test(e.name) ? [p] : [];
  });
}

const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test('hi and en define exactly the same keys', () => {
  const hi = Object.keys(STRINGS.hi).sort();
  const en = Object.keys(STRINGS.en).sort();
  assert.deepEqual(hi, en);
});

test('hi and en use the same {placeholders}', () => {
  for (const key of Object.keys(STRINGS.en)) {
    assert.deepEqual(placeholders(STRINGS.hi[key]), placeholders(STRINGS.en[key]), `placeholders differ for ${key}`);
  }
});

test('no empty strings', () => {
  for (const lang of ['hi', 'en']) {
    for (const [key, value] of Object.entries(STRINGS[lang])) {
      assert.ok(value.trim().length > 0, `${lang}:${key} is empty`);
    }
  }
});

test('every static t("key") used in the source exists', () => {
  const used = new Set();
  for (const file of sourceFiles(srcDir)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/\bt\(\s*'([^']+)'/g)) used.add(m[1]);
  }
  assert.ok(used.size > 100, 'expected to find many keys');
  const missing = [...used].filter((k) => !(k in STRINGS.en));
  assert.deepEqual(missing, []);
});

test('dynamic key families are complete', () => {
  const families = {
    nav: ROUTES,
    'fin.cat': EXPENSE_CATEGORIES,
    'shop.cat': LISTING_CATEGORIES,
    soil: [...SOIL_TYPES, ...SOIL_KEYS],
    stage: ['notSown', 'sowing', 'vegetative', 'flowering', 'maturity', 'harvestDue'],
    'adv.stageTip': ADVISORY_STAGES,
    'adv.soilTip': SOIL_TYPES,
    'adv.alert': ['rain', 'heat', 'cold', 'wind', 'fungal', 'ok'],
    spray: ['safe', 'caution', 'avoid'],
    'spray.reason': ['none', 'raining', 'rainLikely', 'rainPossible', 'windStrong', 'windModerate', 'hot'],
    'wx.kind': ['clear', 'partly', 'overcast', 'fog', 'drizzle', 'rain', 'snow', 'thunder', 'unknown'],
    'wx.hum': ['dry', 'balanced', 'humid'],
    'wx.windband': ['calm', 'moderate', 'strong'],
    'scan.sev': ['low', 'moderate', 'severe', 'critical'],
    'scan.err': ['notImage', 'tooLarge', 'decode', 'offline', 'config', 'rate', 'bad_request', 'upstream', 'server'],
  };
  const missing = [];
  for (const [prefix, ids] of Object.entries(families)) {
    for (const id of ids) {
      const key = `${prefix}.${id}`;
      if (!(key in STRINGS.en)) missing.push(key);
    }
  }
  assert.deepEqual(missing, []);
});

test('translate substitutes variables and falls back to the key', () => {
  assert.equal(translate('en', 'farm.areaValue', { n: 4.5 }), '4.5 acres');
  assert.equal(translate('hi', 'farm.areaValue', { n: 4.5 }), '4.5 एकड़');
  assert.equal(translate('en', 'no.such.key'), 'no.such.key');
  assert.equal(translate('en', 'farm.areaValue'), '{n} acres');
});
