import React, { useMemo } from 'react';
import { ArrowRight, Coins, Sprout, TrendingUp } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { totals } from '../lib/finance.js';
import { formatINR } from '../lib/format.js';
import { loadExpenses, loadIncome } from '../lib/records.js';
import WeatherBanner from './WeatherBanner.jsx';
import FarmsSection from './FarmsSection.jsx';
import MandiSection from './MandiSection.jsx';

function QuickCard({ href, tone, tag, title, body }) {
  const tones = {
    dark: 'bg-gradient-to-br from-forest-900 to-forest-800 text-white border-transparent',
    light: 'bg-white text-forest-850 border-emerald-200 hover:border-forest-900',
  };
  const tagTone = tone === 'dark' ? 'text-amber-300 bg-black/20' : 'text-emerald-800 bg-emerald-50';
  return (
    <a href={href} className={`block p-5 rounded-2xl shadow-sm border transition-all hover:shadow-md ${tones[tone]}`}>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tagTone}`}>{tag}</span>
      <span className="font-bold text-base mt-2 flex items-center justify-between gap-2">
        {title}
        <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
      </span>
      <span className={`block text-xs mt-1 ${tone === 'dark' ? 'text-emerald-100' : 'text-gray-500'}`}>{body}</span>
    </a>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <span className="w-10 h-10 rounded-xl bg-emerald-50 text-forest-900 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-gray-500">{label}</span>
        <span className="block text-lg font-extrabold text-forest-850 truncate">{value}</span>
      </span>
    </div>
  );
}

export default function Dashboard({ weather, place, onPlacePick, onDetectGPS, gpsBusy, onOpenAI, farms, onAddFarm, onOpenFarm, onLoadSamples, onClearSamples, onNavigate }) {
  const { t } = useLang();
  const acres = farms.reduce((sum, f) => sum + f.area, 0);
  // Read from storage once on mount: the finance page owns this data and the dashboard
  // remounts whenever the user navigates back to it.
  const sums = useMemo(() => totals(loadExpenses(), loadIncome()), []);

  return (
    <div className="space-y-6">
      <WeatherBanner weather={weather} placeName={place.name} onPlacePick={onPlacePick} onDetectGPS={onDetectGPS} gpsBusy={gpsBusy} onOpenAI={onOpenAI} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickCard href="#/scanner" tone="dark" tag={t('dash.vision')} title={t('nav.scanner')} body={t('dash.scannerBody')} />
        <QuickCard href="#/advisory" tone="light" tag="ICAR / KVK" title={t('nav.advisory')} body={t('dash.advisoryBody')} />
        <QuickCard href="#/income" tone="light" tag={t('dash.finance')} title={t('nav.income')} body={t('dash.financeBody')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat icon={Sprout} label={t('dash.farms')} value={t('dash.farmsValue', { n: farms.length, acres: Math.round(acres * 10) / 10 })} />
        <Stat icon={Coins} label={t('fin.revenue')} value={formatINR(sums.totalRevenue)} />
        <Stat icon={TrendingUp} label={t('fin.net')} value={formatINR(sums.netProfit)} />
      </div>

      <FarmsSection farms={farms} currentPlace={{ ...place }} onAddFarm={onAddFarm} onOpenFarm={onOpenFarm} onLoadSamples={onLoadSamples} onClearSamples={onClearSamples} />

      <MandiSection limit={4} onViewAll={() => onNavigate('mandi')} />
    </div>
  );
}
