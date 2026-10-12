import React, { useMemo, useState } from 'react';
import { BarChart3, Coins, Download, Plus, Trash2, TrendingUp, Wallet } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { useToast } from './ui/Toast.jsx';
import { CROPS, pick } from '../data/crops.js';
import { EXPENSE_CATEGORIES, parsePositive, summarizeByCrop, toCSV, totals } from '../lib/finance.js';
import { formatDate, formatINR, todayISO, isValidISODate, uid } from '../lib/format.js';
import { KEYS, loadExpenses, loadIncome, materializeSampleLedger, normalizeExpense, normalizeIncome } from '../lib/records.js';
import { cleanText } from '../lib/validators.js';

const inputClass = 'w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs focus:ring-2 focus:ring-forest-500';

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-medium text-gray-700 block mb-1 text-xs">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-[11px] text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}

function Kpi({ label, value, tone = 'text-forest-900', icon: Icon, hint }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        <p className={`text-2xl font-extrabold mt-1 truncate ${tone}`}>{value}</p>
        {hint && <span className="text-[11px] text-gray-500">{hint}</span>}
      </div>
      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-forest-900 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
    </div>
  );
}

function download(filename, text) {
  // BOM so Excel opens Hindi text correctly.
  const blob = new Blob([`﻿${text}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function FinancesSection({ tab, onTabChange, farms }) {
  const { t, lang } = useLang();
  const notify = useToast();
  const [expenses, setExpenses] = usePersistentState(KEYS.expenses, loadExpenses);
  const [income, setIncome] = usePersistentState(KEYS.income, loadIncome);

  const cropNames = useMemo(() => {
    const names = new Set(CROPS.map((c) => pick(c.name, lang)));
    farms.forEach((f) => f.cropLabel && names.add(f.cropLabel));
    return [...names];
  }, [farms, lang]);

  const [exp, setExp] = useState({ category: 'fertilizer', crop: '', amount: '', description: '', date: todayISO() });
  const [inc, setInc] = useState({ crop: '', quantity: '', rate: '', mandi: '', date: todayISO() });
  const [expErrors, setExpErrors] = useState({});
  const [incErrors, setIncErrors] = useState({});

  const sums = totals(expenses, income);
  const perCrop = useMemo(() => summarizeByCrop(expenses, income), [expenses, income]);
  const hasSamples = expenses.some((e) => e.sample) || income.some((i) => i.sample);
  const isEmpty = expenses.length === 0 && income.length === 0;

  const addExpense = (e) => {
    e.preventDefault();
    const next = {};
    const amount = parsePositive(exp.amount);
    if (amount === null) next.amount = t('fin.err.amount');
    if (!isValidISODate(exp.date)) next.date = t('farm.err.date');
    setExpErrors(next);
    if (Object.keys(next).length) return;
    const row = normalizeExpense({
      id: uid('exp'),
      date: exp.date,
      category: exp.category,
      crop: exp.crop,
      amount,
      description: exp.description || t('fin.defaultExpense'),
      sample: false,
    });
    if (!row) return;
    setExpenses((list) => [row, ...list]);
    setExp((s) => ({ ...s, amount: '', description: '' }));
    notify(t('fin.savedExpense'), 'success');
  };

  const addIncome = (e) => {
    e.preventDefault();
    const next = {};
    const quantity = parsePositive(inc.quantity);
    const rate = parsePositive(inc.rate);
    if (!cleanText(inc.crop, 60)) next.crop = t('farm.err.crop');
    if (quantity === null) next.quantity = t('fin.err.quantity');
    if (rate === null) next.rate = t('fin.err.rate');
    if (!isValidISODate(inc.date)) next.date = t('farm.err.date');
    setIncErrors(next);
    if (Object.keys(next).length) return;
    const row = normalizeIncome({
      id: uid('inc'),
      date: inc.date,
      crop: inc.crop,
      quantity,
      ratePerUnit: rate,
      mandi: inc.mandi || t('fin.defaultMandi'),
      sample: false,
    });
    if (!row) return;
    setIncome((list) => [row, ...list]);
    setInc((s) => ({ ...s, quantity: '', rate: '' }));
    notify(t('fin.savedIncome'), 'success');
  };

  const removeExpense = (id) => {
    if (window.confirm(t('fin.confirmDelete'))) setExpenses((list) => list.filter((x) => x.id !== id));
  };
  const removeIncome = (id) => {
    if (window.confirm(t('fin.confirmDelete'))) setIncome((list) => list.filter((x) => x.id !== id));
  };

  const loadSamples = () => {
    const sample = materializeSampleLedger();
    setExpenses((list) => [...sample.expenses.filter(Boolean), ...list]);
    setIncome((list) => [...sample.income.filter(Boolean), ...list]);
  };

  const clearSamples = () => {
    setExpenses((list) => list.filter((x) => !x.sample));
    setIncome((list) => list.filter((x) => !x.sample));
  };

  const exportCSV = () => {
    const rows = [
      ...income.map((i) => [i.date, 'income', i.crop, '', i.quantity, i.ratePerUnit, i.totalRevenue, i.mandi]),
      ...expenses.map((x) => [x.date, 'expense', x.crop, x.category, '', '', x.amount, x.description]),
    ].sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    download(
      `dimensions-farm-ledger-${todayISO()}.csv`,
      toCSV(['date', 'type', 'crop', 'category', 'quantity_quintal', 'rate_per_quintal', 'amount', 'note'], rows),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-forest-850 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-forest-900" aria-hidden="true" />
            {t('fin.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('fin.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-200/80 p-1 rounded-xl text-xs font-bold" role="tablist" aria-label={t('fin.title')}>
            {[
              ['income', t('fin.tabIncome')],
              ['budget', t('fin.tabBudget')],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => onTabChange(id)}
                className={`px-4 py-2 rounded-lg transition-colors ${tab === id ? 'bg-forest-900 text-white shadow-sm' : 'text-gray-700 hover:text-forest-900'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={exportCSV} disabled={isEmpty} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
            <Download className="w-4 h-4" aria-hidden="true" />
            {t('fin.export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label={t('fin.revenue')} value={formatINR(sums.totalRevenue)} icon={Coins} />
        <Kpi label={t('fin.expense')} value={formatINR(sums.totalExpense)} tone="text-amber-700" icon={Wallet} />
        <Kpi label={t('fin.net')} value={formatINR(sums.netProfit)} tone={sums.netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'} icon={TrendingUp} hint={t('fin.netHint')} />
        <Kpi label={t('fin.margin')} value={sums.margin === null ? '—' : `${sums.margin.toFixed(1)}%`} tone="text-forest-850" icon={BarChart3} hint={sums.margin === null ? t('fin.marginNone') : undefined} />
      </div>

      {isEmpty && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-forest-850">{t('fin.emptyTitle')}</h3>
          <p className="text-xs text-gray-500 mt-1">{t('fin.emptyBody')}</p>
          <button type="button" onClick={loadSamples} className="mt-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg">
            {t('common.loadSamples')}
          </button>
        </div>
      )}

      {tab === 'income' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={addIncome} noValidate className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-3">
            <h3 className="font-bold text-sm text-forest-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t('fin.addIncome')}
            </h3>
            <Field id="inc-crop" label={t('fin.crop')} error={incErrors.crop}>
              <input id="inc-crop" list="crop-names" className={inputClass} value={inc.crop} maxLength={60} onChange={(e) => setInc((s) => ({ ...s, crop: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field id="inc-qty" label={t('fin.quantity')} error={incErrors.quantity}>
                <input id="inc-qty" className={inputClass} type="number" inputMode="decimal" min="0" step="0.1" value={inc.quantity} onChange={(e) => setInc((s) => ({ ...s, quantity: e.target.value }))} />
              </Field>
              <Field id="inc-rate" label={t('fin.rate')} error={incErrors.rate}>
                <input id="inc-rate" className={inputClass} type="number" inputMode="decimal" min="0" value={inc.rate} onChange={(e) => setInc((s) => ({ ...s, rate: e.target.value }))} />
              </Field>
            </div>
            {parsePositive(inc.quantity) !== null && parsePositive(inc.rate) !== null && (
              <p className="text-xs text-forest-900 font-semibold">
                {t('fin.totalPreview')}: {formatINR(Number(inc.quantity) * Number(inc.rate))}
              </p>
            )}
            <Field id="inc-mandi" label={t('fin.mandi')}>
              <input id="inc-mandi" className={inputClass} value={inc.mandi} maxLength={80} onChange={(e) => setInc((s) => ({ ...s, mandi: e.target.value }))} />
            </Field>
            <Field id="inc-date" label={t('fin.date')} error={incErrors.date}>
              <input id="inc-date" className={inputClass} type="date" value={inc.date} onChange={(e) => setInc((s) => ({ ...s, date: e.target.value }))} />
            </Field>
            <button type="submit" className="w-full bg-forest-900 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs">
              {t('fin.saveIncome')}
            </button>
          </form>

          <section className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm min-w-0">
            <h3 className="font-bold text-sm text-forest-850 mb-3">{t('fin.incomeHistory')}</h3>
            {income.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">{t('fin.noIncome')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-forest-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th scope="col" className="p-3">{t('fin.date')}</th>
                      <th scope="col" className="p-3">{t('fin.crop')}</th>
                      <th scope="col" className="p-3">{t('fin.qtyShort')}</th>
                      <th scope="col" className="p-3">{t('fin.rateShort')}</th>
                      <th scope="col" className="p-3">{t('fin.total')}</th>
                      <th scope="col" className="p-3">{t('fin.mandiShort')}</th>
                      <th scope="col" className="p-3 text-right"><span className="sr-only">{t('common.delete')}</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {income.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-500 whitespace-nowrap">{formatDate(i.date, lang)}</td>
                        <td className="p-3 font-bold text-gray-800">
                          {i.crop || '—'}
                          {i.sample && <span className="ml-1 text-[10px] font-bold uppercase text-amber-800 bg-amber-50 border border-amber-200 px-1 rounded">{t('common.sample')}</span>}
                        </td>
                        <td className="p-3 whitespace-nowrap">{i.quantity} {t('fin.quintal')}</td>
                        <td className="p-3">{formatINR(i.ratePerUnit)}</td>
                        <td className="p-3 font-extrabold text-forest-900">{formatINR(i.totalRevenue)}</td>
                        <td className="p-3 text-gray-500">{i.mandi}</td>
                        <td className="p-3 text-right">
                          <button type="button" onClick={() => removeIncome(i.id)} aria-label={t('common.delete')} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={addExpense} noValidate className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-3">
            <h3 className="font-bold text-sm text-amber-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4" aria-hidden="true" />
              {t('fin.addExpense')}
            </h3>
            <Field id="exp-cat" label={t('fin.category')}>
              <select id="exp-cat" className={inputClass} value={exp.category} onChange={(e) => setExp((s) => ({ ...s, category: e.target.value }))}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`fin.cat.${c}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="exp-crop" label={t('fin.cropOptional')}>
              <input id="exp-crop" list="crop-names" className={inputClass} value={exp.crop} maxLength={60} onChange={(e) => setExp((s) => ({ ...s, crop: e.target.value }))} />
            </Field>
            <Field id="exp-amount" label={t('fin.amount')} error={expErrors.amount}>
              <input id="exp-amount" className={inputClass} type="number" inputMode="decimal" min="0" value={exp.amount} onChange={(e) => setExp((s) => ({ ...s, amount: e.target.value }))} placeholder="4500" />
            </Field>
            <Field id="exp-desc" label={t('fin.note')}>
              <input id="exp-desc" className={inputClass} value={exp.description} maxLength={140} onChange={(e) => setExp((s) => ({ ...s, description: e.target.value }))} />
            </Field>
            <Field id="exp-date" label={t('fin.date')} error={expErrors.date}>
              <input id="exp-date" className={inputClass} type="date" value={exp.date} onChange={(e) => setExp((s) => ({ ...s, date: e.target.value }))} />
            </Field>
            <button type="submit" className="w-full bg-forest-900 hover:bg-forest-700 text-white font-bold py-2.5 rounded-xl text-xs">
              {t('fin.saveExpense')}
            </button>
          </form>

          <section className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm min-w-0">
            <h3 className="font-bold text-sm text-forest-850 mb-3">{t('fin.expenseHistory')}</h3>
            {expenses.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">{t('fin.noExpense')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-forest-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th scope="col" className="p-3">{t('fin.date')}</th>
                      <th scope="col" className="p-3">{t('fin.category')}</th>
                      <th scope="col" className="p-3">{t('fin.crop')}</th>
                      <th scope="col" className="p-3">{t('fin.note')}</th>
                      <th scope="col" className="p-3">{t('fin.amountShort')}</th>
                      <th scope="col" className="p-3 text-right"><span className="sr-only">{t('common.delete')}</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {expenses.map((x) => (
                      <tr key={x.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-500 whitespace-nowrap">{formatDate(x.date, lang)}</td>
                        <td className="p-3 font-semibold text-gray-700">{t(`fin.cat.${x.category}`)}</td>
                        <td className="p-3 font-bold text-gray-800">
                          {x.crop || '—'}
                          {x.sample && <span className="ml-1 text-[10px] font-bold uppercase text-amber-800 bg-amber-50 border border-amber-200 px-1 rounded">{t('common.sample')}</span>}
                        </td>
                        <td className="p-3 text-gray-500 max-w-[220px] truncate" title={x.description}>{x.description}</td>
                        <td className="p-3 font-bold text-amber-800">{formatINR(x.amount)}</td>
                        <td className="p-3 text-right">
                          <button type="button" onClick={() => removeExpense(x.id)} aria-label={t('common.delete')} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {perCrop.length > 0 && (
        <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="percrop">
          <h3 id="percrop" className="font-bold text-sm text-forest-850 mb-3">{t('fin.perCrop')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-forest-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th scope="col" className="p-3">{t('fin.crop')}</th>
                  <th scope="col" className="p-3">{t('fin.revenue')}</th>
                  <th scope="col" className="p-3">{t('fin.expense')}</th>
                  <th scope="col" className="p-3">{t('fin.net')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perCrop.map((row) => (
                  <tr key={row.crop}>
                    <td className="p-3 font-bold text-gray-800">{row.crop}</td>
                    <td className="p-3">{formatINR(row.revenue)}</td>
                    <td className="p-3">{formatINR(row.expense)}</td>
                    <td className={`p-3 font-bold ${row.net >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{formatINR(row.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {hasSamples && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-900">
          <span>{t('common.samplesNotice')}</span>
          <button type="button" onClick={clearSamples} className="flex items-center gap-1 font-bold underline">
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            {t('common.clearSamples')}
          </button>
        </div>
      )}

      <datalist id="crop-names">
        {cropNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  );
}
