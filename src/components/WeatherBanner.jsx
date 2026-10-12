import React from 'react';
import { AlertTriangle, Droplets, Loader2, Navigation, RefreshCw, ShieldCheck, Sparkles, Wind } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { humidityBand, sprayAdvice, windBand } from '../lib/spray.js';
import { weatherKind } from '../lib/weatherCodes.js';
import PlaceSearch from './PlaceSearch.jsx';
import WeatherIcon from './WeatherIcon.jsx';

const SPRAY_TONE = {
  safe: 'text-emerald-200',
  caution: 'text-amber-200',
  avoid: 'text-red-200',
};

export default function WeatherBanner({ weather, placeName, onPlacePick, onDetectGPS, gpsBusy, onOpenAI }) {
  const { t } = useLang();
  const { data, loading, error, refresh } = weather;
  const observed = data?.observedAt ? data.observedAt.split('T')[1]?.slice(0, 5) : null;
  const spray = data ? sprayAdvice(data) : null;

  return (
    <section
      aria-label={t('wx.title')}
      className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-700 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="relative flex w-2.5 h-2.5" aria-hidden="true">
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="uppercase tracking-wider font-semibold text-emerald-300">{t('wx.badge')}</span>
          {observed && <span className="text-gray-300">({observed})</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-forest-500 hover:bg-[#629f4a] text-white text-xs px-3.5 py-1.5 rounded-full shadow-md font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" aria-hidden="true" />
            {t('wx.askAI')}
          </button>
          <button
            type="button"
            onClick={onDetectGPS}
            disabled={gpsBusy}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-xs px-3.5 py-1.5 rounded-full border border-white/20 font-medium disabled:opacity-60"
          >
            {gpsBusy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
            )}
            {t('wx.gps')}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <PlaceSearch
          variant="hero"
          onPick={onPlacePick}
          placeholder={t('wx.searchPlaceholder')}
          buttonLabel={t('wx.searchBtn')}
          id="weather-search"
        />
      </div>

      {error && (
        <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 bg-red-500/20 border border-red-300/40 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{t('wx.error')}</span>
          <button
            type="button"
            onClick={refresh}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            {t('common.retry')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-busy={loading}>
        <div className="bg-white/10 rounded-xl p-4 border border-white/15 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-amber-300">
            {data ? <WeatherIcon code={data.code} className="w-9 h-9" /> : <Loader2 className={`w-7 h-7 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-emerald-200 truncate">{placeName}</h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold">{data ? `${data.temp}°C` : '--'}</span>
              {data && <span className="text-xs text-gray-200">{t('wx.feels', { n: data.feelsLike })}</span>}
            </div>
            <p className="text-xs text-emerald-300 mt-0.5">
              {data ? t(`wx.kind.${weatherKind(data.code)}`) : ''}
              {data && data.max !== null && data.min !== null ? ` · ${t('wx.maxmin', { max: Math.round(data.max), min: Math.round(data.min) })}` : ''}
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <Droplets className="w-8 h-8 text-cyan-300 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-gray-200">{t('wx.humidity')}</p>
            <p className="text-xl font-bold">{data ? `${data.humidity}%` : '--'}</p>
            <p className="text-xs text-emerald-300">{data ? t(`wx.hum.${humidityBand(data.humidity)}`) : ''}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <Wind className="w-8 h-8 text-sky-200 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-gray-200">{t('wx.wind')}</p>
            <p className="text-xl font-bold">{data ? `${data.wind} km/h` : '--'}</p>
            <p className="text-xs text-emerald-300">{data ? t(`wx.windband.${windBand(data.wind)}`) : ''}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-300 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-gray-200">{t('wx.spray')}</p>
            <p className={`text-sm font-bold mt-0.5 ${spray ? SPRAY_TONE[spray.level] : ''}`}>
              {spray ? t(`spray.${spray.level}`) : '--'}
            </p>
            <p className="text-xs text-emerald-200">{data ? t('wx.rainChance', { n: data.rainProb }) : ''}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
