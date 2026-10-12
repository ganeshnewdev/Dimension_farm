import test from 'node:test';
import assert from 'node:assert/strict';

import {
  KEYS,
  loadFarms,
  materializeSampleFarms,
  materializeSampleLedger,
  migrateLegacyFarm,
  normalizeExpense,
  normalizeFarm,
  normalizeIncome,
  normalizeListing,
  loadListings,
} from '../src/lib/records.js';
import { SAMPLE_LISTINGS } from '../src/data/sample.js';

function withStorage(initial, fn) {
  const saved = globalThis.localStorage;
  const data = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, v),
  };
  try {
    return fn();
  } finally {
    if (saved === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = saved;
  }
}

const legacyFarm = {
  id: 'farm-1',
  name: 'गंगा का मैदान (Ganga Plot 1)',
  crop: 'गेहूं (Wheat PBW 550)',
  cropKey: 'wheat',
  area: '4.5',
  unit: 'एकड़',
  location: 'कुरुक्षेत्र, हरियाणा',
  lat: 29.9695,
  lon: 76.8783,
  soil: 'दोमट मिट्टी (Loamy Soil)',
  npk: 'N: 140 (मध्यम) | P: 25 | K: 180',
  ph: '6.8 (संतुलित)',
  stage: 'कल्ले फूटने की अवस्था',
  sownDate: '2024-11-15',
  estHarvest: '2025-04-10',
};

test('legacy farm migrates: numeric area, crop id, flagged sample, fabricated NPK dropped', () => {
  const f = migrateLegacyFarm(legacyFarm);
  assert.equal(f.cropId, 'wheat');
  assert.equal(f.area, 4.5);
  assert.equal(f.sample, true);
  assert.equal(f.soilTest, null);
  assert.equal(f.sownDate, '2024-11-15');
});

test('legacy user-added farm (no cropKey) keeps its label and is not a sample', () => {
  const f = migrateLegacyFarm({ id: 'farm-1728000000000', name: 'मेरा खेत', crop: 'मक्का', area: '3.0', location: 'जयपुर', lat: 26.9, lon: 75.8, sownDate: '2026-10-01' });
  assert.equal(f.cropId, 'other');
  assert.equal(f.cropLabel, 'मक्का');
  assert.equal(f.sample, false);
});

test('loadFarms prefers v2, falls back to legacy, survives corrupt JSON', () => {
  const v2 = [{ id: 'a', name: 'A', cropId: 'rice', area: 2, lat: 10, lon: 20, sownDate: '2026-09-01' }];
  withStorage({ [KEYS.farms]: JSON.stringify(v2), [KEYS.legacyFarms]: JSON.stringify([legacyFarm]) }, () => {
    assert.deepEqual(loadFarms().map((f) => f.id), ['a']);
  });
  withStorage({ [KEYS.legacyFarms]: JSON.stringify([legacyFarm]) }, () => {
    assert.deepEqual(loadFarms().map((f) => f.id), ['farm-1']);
  });
  withStorage({ [KEYS.farms]: '{oops' }, () => {
    assert.deepEqual(loadFarms(), []);
  });
  withStorage({}, () => {
    assert.deepEqual(loadFarms(), []);
  });
});

test('normalizeFarm rejects impossible coordinates and missing names', () => {
  assert.equal(normalizeFarm({ id: 'x', name: 'N', lat: 200, lon: 0 }), null);
  assert.equal(normalizeFarm({ id: 'x', name: '', lat: 1, lon: 1 }), null);
  assert.equal(normalizeFarm(null), null);
  assert.equal(normalizeFarm('str'), null);
  const f = normalizeFarm({ id: 'x', name: 'N', lat: '12.5', lon: '77.1', area: '-4', cropId: 'nope' });
  assert.equal(f.lat, 12.5);
  assert.equal(f.area, 0);
  assert.equal(f.cropId, 'other');
});

test('sample farms are relative to today and flagged', () => {
  const farms = materializeSampleFarms('2026-10-12');
  assert.equal(farms.length, 3);
  assert.ok(farms.every((f) => f.sample));
  assert.equal(farms[0].sownDate, '2026-09-02');
});

test('expense / income normalisation', () => {
  const e = normalizeExpense({ id: 'exp-1', date: '2024-11-10', category: 'Seeds (बीज)', crop: 'गेहूं', amount: '6525', description: 'x' });
  assert.equal(e.category, 'seed');
  assert.equal(e.amount, 6525);
  assert.equal(e.sample, true);
  assert.equal(normalizeExpense({ id: 'e', amount: -1 }), null);
  assert.equal(normalizeExpense({ id: 'e', amount: 'abc' }), null);

  const i = normalizeIncome({ id: 'inc-9', quantity: 10, ratePerUnit: 2000, totalRevenue: 1, date: 'bad' });
  assert.equal(i.totalRevenue, 20000); // recomputed, stored value ignored
  assert.match(i.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(normalizeIncome({ id: 'i', quantity: 'x', ratePerUnit: 1 }), null);
});

test('sample ledger materialises with valid rows', () => {
  const { expenses, income } = materializeSampleLedger('2026-10-12');
  assert.ok(expenses.length > 0 && expenses.every(Boolean));
  assert.ok(income.length > 0 && income.every(Boolean));
  assert.ok(expenses.every((e) => e.sample));
});

test('listings: sample rows never carry a phone, user rows must have a valid one', () => {
  const s = normalizeListing({ ...SAMPLE_LISTINGS[0], phone: '+91 98110 22345' });
  assert.equal(s.phone, '');
  assert.equal(s.sample, true);
  const legacy = normalizeListing({ id: 'prod-1', title: 'बीज', category: 'Seeds', price: 1450, unit: 'bag', vendor: 'v', phone: '+91 98110 22345', location: 'x', desc: 'd' });
  assert.equal(legacy.sample, true);
  assert.equal(legacy.phone, '');
  const user = normalizeListing({ id: 'prod-17', title: 'मक्का बीज', category: 'Seeds', price: 900, phone: '98765 43210' });
  assert.equal(user.phone, '9876543210');
  assert.equal(normalizeListing({ id: 'z', title: '', price: 5 }), null);
  assert.equal(normalizeListing({ id: 'z', title: 't', price: 'x' }), null);
});

test('loadListings uses defaults only when nothing is saved', () => {
  withStorage({}, () => {
    assert.equal(loadListings(SAMPLE_LISTINGS).length, SAMPLE_LISTINGS.length);
  });
  withStorage({ [KEYS.listings]: '[]' }, () => {
    assert.equal(loadListings(SAMPLE_LISTINGS).length, 0);
  });
});
