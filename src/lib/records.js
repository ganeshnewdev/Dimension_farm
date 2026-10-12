// Validation, normalisation and legacy migration for everything persisted in localStorage.
// Every function returns a clean record or null, so corrupt or hand-edited storage can
// never break rendering.
import { findCrop } from '../data/crops.js';
import { buildSampleFarms, SAMPLE_EXPENSES, SAMPLE_INCOME } from '../data/sample.js';
import { addDays, isValidISODate, todayISO } from './format.js';
import { normalizeCategory } from './finance.js';
import { loadJSON } from './storage.js';
import { cleanText, normalizeIndianPhone } from './validators.js';

export const KEYS = {
  farms: 'dim_farm_plots_v2',
  legacyFarms: 'dim_farm_plots',
  expenses: 'dim_farm_expenses',
  income: 'dim_farm_income',
  listings: 'dim_farm_marketplace',
  location: 'dim_farm_location',
  lang: 'dim_farm_lang',
};

// The earlier version shipped demo rows with these ids and persisted them to storage.
const LEGACY_SAMPLE_IDS = new Set([
  'farm-1', 'farm-2', 'farm-3',
  'exp-1', 'exp-2', 'exp-3', 'exp-4',
  'inc-1', 'inc-2',
  'prod-1', 'prod-2', 'prod-3', 'prod-4',
]);

const num = (v) => {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export const SOIL_KEYS = ['loamy', 'black', 'sandy', 'clay'];

function normalizeSoilTest(raw) {
  if (!isObj(raw)) return null;
  const test = { n: num(raw.n), p: num(raw.p), k: num(raw.k), ph: num(raw.ph) };
  return Object.values(test).some((v) => v !== null) ? test : null;
}

export function normalizeFarm(raw) {
  if (!isObj(raw)) return null;
  const id = cleanText(raw.id, 60);
  const name = cleanText(raw.name, 80);
  const lat = num(raw.lat);
  const lon = num(raw.lon);
  if (!id || !name || lat === null || lon === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  const cropId = findCrop(raw.cropId) ? raw.cropId : 'other';
  return {
    id,
    name,
    cropId,
    cropLabel: cleanText(raw.cropLabel, 60),
    area: Math.max(0, num(raw.area) ?? 0),
    location: cleanText(raw.location, 100),
    lat,
    lon,
    soil: SOIL_KEYS.includes(raw.soil) ? raw.soil : '',
    soilTest: normalizeSoilTest(raw.soilTest),
    sownDate: isValidISODate(raw.sownDate) ? raw.sownDate : '',
    sample: raw.sample === true,
  };
}

// v1 stored free-text stage / NPK values that were hard-coded defaults, not measurements.
export function migrateLegacyFarm(raw) {
  if (!isObj(raw)) return null;
  const sample = LEGACY_SAMPLE_IDS.has(raw.id);
  const cropKey = typeof raw.cropKey === 'string' ? raw.cropKey : '';
  return normalizeFarm({
    id: raw.id,
    name: raw.name,
    cropId: cropKey,
    cropLabel: raw.crop,
    area: raw.area,
    location: raw.location,
    lat: raw.lat,
    lon: raw.lon,
    soil: '',
    soilTest: null,
    sownDate: raw.sownDate,
    sample,
  });
}

export function loadFarms() {
  const v2 = loadJSON(KEYS.farms, null, Array.isArray);
  if (v2) return v2.map(normalizeFarm).filter(Boolean);
  const legacy = loadJSON(KEYS.legacyFarms, null, Array.isArray);
  if (legacy) return legacy.map(migrateLegacyFarm).filter(Boolean);
  return [];
}

export function materializeSampleFarms(today = todayISO()) {
  return buildSampleFarms().map(({ sownOffset, ...farm }) =>
    normalizeFarm({ ...farm, sownDate: addDays(today, sownOffset), sample: true }),
  );
}

export function normalizeExpense(raw) {
  if (!isObj(raw)) return null;
  const amount = num(raw.amount);
  const id = cleanText(raw.id, 60);
  if (!id || amount === null || amount < 0) return null;
  return {
    id,
    date: isValidISODate(raw.date) ? raw.date : todayISO(),
    category: normalizeCategory(raw.category),
    crop: cleanText(raw.crop, 60),
    amount,
    description: cleanText(raw.description, 140),
    sample: raw.sample === true || LEGACY_SAMPLE_IDS.has(raw.id),
  };
}

export function normalizeIncome(raw) {
  if (!isObj(raw)) return null;
  const quantity = num(raw.quantity);
  const rate = num(raw.ratePerUnit);
  const id = cleanText(raw.id, 60);
  if (!id || quantity === null || rate === null || quantity < 0 || rate < 0) return null;
  return {
    id,
    date: isValidISODate(raw.date) ? raw.date : todayISO(),
    crop: cleanText(raw.crop, 60),
    quantity,
    ratePerUnit: rate,
    // Always recomputed so the total can never disagree with quantity x rate.
    totalRevenue: quantity * rate,
    mandi: cleanText(raw.mandi, 80),
    sample: raw.sample === true || LEGACY_SAMPLE_IDS.has(raw.id),
  };
}

export function loadExpenses() {
  return loadJSON(KEYS.expenses, [], Array.isArray).map(normalizeExpense).filter(Boolean);
}

export function loadIncome() {
  return loadJSON(KEYS.income, [], Array.isArray).map(normalizeIncome).filter(Boolean);
}

export function materializeSampleLedger(today = todayISO()) {
  return {
    expenses: SAMPLE_EXPENSES.map(({ offset, ...e }) =>
      normalizeExpense({ ...e, date: addDays(today, offset), sample: true }),
    ),
    income: SAMPLE_INCOME.map(({ offset, ...i }) =>
      normalizeIncome({ ...i, date: addDays(today, offset), sample: true }),
    ),
  };
}

export const LISTING_CATEGORIES = ['Seeds', 'Fertilizers', 'Irrigation', 'Tools'];

// A user listing keeps plain strings; sample listings keep { hi, en } objects.
export function normalizeListing(raw) {
  if (!isObj(raw)) return null;
  const id = cleanText(raw.id, 60);
  const price = num(raw.price);
  const isSample = raw.sample === true || LEGACY_SAMPLE_IDS.has(raw.id);
  const text = (v, max) => (isObj(v) ? { hi: cleanText(v.hi, max), en: cleanText(v.en, max) } : cleanText(v, max));
  const title = text(raw.title, 120);
  if (!id || price === null || price < 0 || !(typeof title === 'string' ? title : title.hi || title.en)) return null;
  return {
    id,
    title,
    category: LISTING_CATEGORIES.includes(raw.category) ? raw.category : 'Tools',
    price,
    unit: cleanText(raw.unit, 40),
    vendor: text(raw.vendor, 80),
    // Sample rows never carry a phone number, so no button can dial an invented contact.
    phone: isSample ? '' : normalizeIndianPhone(raw.phone) ?? '',
    location: text(raw.location, 80),
    desc: text(raw.desc, 300),
    sample: isSample,
  };
}

export function loadListings(defaults) {
  const saved = loadJSON(KEYS.listings, null, Array.isArray);
  if (!saved) return defaults.map(normalizeListing).filter(Boolean);
  return saved.map(normalizeListing).filter(Boolean);
}
