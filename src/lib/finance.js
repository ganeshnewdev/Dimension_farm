export const EXPENSE_CATEGORIES = [
  'seed',
  'fertilizer',
  'pesticide',
  'labour',
  'irrigation',
  'machinery',
  'transport',
  'other',
];

const LEGACY_PREFIXES = {
  seeds: 'seed',
  fertilizers: 'fertilizer',
  pesticides: 'pesticide',
  labour: 'labour',
  irrigation: 'irrigation',
  machinery: 'machinery',
  transport: 'transport',
  other: 'other',
};

// Old versions stored labels like "Seeds (बीज)"; map them (and new keys) to a category key.
export function normalizeCategory(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (EXPENSE_CATEGORIES.includes(raw)) return raw;
  const prefix = raw.split(/[\s(]/)[0];
  return LEGACY_PREFIXES[prefix] ?? 'other';
}

// Returns a finite number > 0, or null for empty / invalid / zero / negative input.
export function parsePositive(value) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function safeAmount(n) {
  return Number.isFinite(n) ? n : 0;
}

export function totals(expenses, income) {
  const totalExpense = expenses.reduce((acc, e) => acc + safeAmount(e.amount), 0);
  const totalRevenue = income.reduce((acc, i) => acc + safeAmount(i.totalRevenue), 0);
  const netProfit = totalRevenue - totalExpense;
  // Margin is undefined without any revenue (showing "0%" would be misleading).
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : null;
  return { totalExpense, totalRevenue, netProfit, margin };
}

export function summarizeByCrop(expenses, income) {
  const map = new Map();
  const bucket = (crop) => {
    const name = String(crop ?? '').trim() || '—';
    const key = name.toLowerCase();
    if (!map.has(key)) map.set(key, { crop: name, expense: 0, revenue: 0, net: 0 });
    return map.get(key);
  };
  expenses.forEach((e) => {
    bucket(e.crop).expense += safeAmount(e.amount);
  });
  income.forEach((i) => {
    bucket(i.crop).revenue += safeAmount(i.totalRevenue);
  });
  return [...map.values()]
    .map((row) => ({ ...row, net: row.revenue - row.expense }))
    .sort((a, b) => b.revenue + b.expense - (a.revenue + a.expense));
}

function csvCell(value) {
  const s = String(value ?? '');
  // Neutralise spreadsheet formula injection as well as quoting.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCSV(header, rows) {
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
}
