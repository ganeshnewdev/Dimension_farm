import React, { useMemo, useState } from 'react';
import { ArrowRight, Info, Search, TrendingUp } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { SAMPLE_MANDI } from '../data/sample.js';
import { pick } from '../data/crops.js';
import { formatINR } from '../lib/format.js';

// The figures come from a bundled sample; this component is built so a real feed
// (e.g. Agmarknet / e-NAM) can replace SAMPLE_MANDI without UI changes.
export default function MandiSection({ limit, onViewAll }) {
  const { t, lang } = useLang();
  const [state, setState] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');

  const states = useMemo(() => [...new Set(SAMPLE_MANDI.map((m) => m.state))].sort(), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = SAMPLE_MANDI.filter((m) => {
      if (state !== 'all' && m.state !== state) return false;
      if (!q) return true;
      return [pick(m.commodity, 'hi'), pick(m.commodity, 'en'), m.mandi, m.district, m.state].some((s) => s.toLowerCase().includes(q));
    });
    if (sort === 'high') list = [...list].sort((a, b) => b.modal - a.modal);
    if (sort === 'low') list = [...list].sort((a, b) => a.modal - b.modal);
    return limit ? list.slice(0, limit) : list;
  }, [state, query, sort, limit]);

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/80" aria-labelledby="mandi-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 id="mandi-heading" className="text-xl font-bold text-forest-850 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-forest-900" aria-hidden="true" />
            {t('mandi.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('mandi.subtitle')}</p>
        </div>

        {!limit && (
          <div className="flex flex-wrap gap-2 text-xs">
            <label className="sr-only" htmlFor="mandi-state">
              {t('mandi.state')}
            </label>
            <select id="mandi-state" value={state} onChange={(e) => setState(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none font-semibold text-gray-700 focus:ring-2 focus:ring-forest-500">
              <option value="all">{t('mandi.allStates')}</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="mandi-sort">
              {t('mandi.sort')}
            </label>
            <select id="mandi-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none text-gray-700 focus:ring-2 focus:ring-forest-500">
              <option value="default">{t('mandi.sortDefault')}</option>
              <option value="high">{t('mandi.sortHigh')}</option>
              <option value="low">{t('mandi.sortLow')}</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('mandi.search')}
                aria-label={t('mandi.search')}
                className="bg-gray-50 border border-gray-300 rounded-xl pl-8 pr-3 py-2 outline-none text-gray-700 focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-3 py-2 text-xs">
        <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
        <span>{t('mandi.sampleNotice')}</span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">{t('common.noResults')}</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rows.map((m) => {
            const spread = m.max - m.min;
            const pos = spread > 0 ? ((m.modal - m.min) / spread) * 100 : 50;
            return (
              <li key={m.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:border-forest-500 hover:shadow-md transition-all">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-forest-900 border border-emerald-200">{m.mandi}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{t('common.sample')}</span>
                </div>
                <h3 className="text-base font-bold text-forest-850 mt-2">{pick(m.commodity, lang)}</h3>
                <p className="text-xs text-gray-500">
                  {m.district}, {m.state}
                </p>

                <div className="mt-3 p-2.5 bg-forest-50 rounded-lg">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500">{t('mandi.modal')}</span>
                    <span className="text-lg font-extrabold text-forest-900">
                      {formatINR(m.modal)}
                      <span className="text-xs font-normal text-gray-600"> {t('mandi.perQuintal')}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 relative" aria-hidden="true">
                    <span className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-forest-900 border border-white" style={{ left: `calc(${pos}% - 5px)` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
                    <span>{formatINR(m.min)}</span>
                    <span>{formatINR(m.max)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {limit && onViewAll && (
        <div className="mt-4 text-right">
          <button type="button" onClick={onViewAll} className="inline-flex items-center gap-1 text-xs font-bold text-forest-900 hover:underline">
            {t('mandi.viewAll')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
