import React from 'react';
import { AlertTriangle, CheckCircle, CloudRain } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { sprayAdvice } from '../lib/spray.js';
import { weatherAlerts } from '../lib/advisory.js';
import { weatherKind } from '../lib/weatherCodes.js';
import { formatDate } from '../lib/format.js';
import WeatherIcon from './WeatherIcon.jsx';

const LEVEL_STYLE = {
  safe: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  caution: 'bg-amber-50 border-amber-200 text-amber-900',
  avoid: 'bg-red-50 border-red-200 text-red-900',
};

export default function WeatherPage({ weather }) {
  const { t, lang } = useLang();
  const { data, loading } = weather;

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-sm text-gray-600">
        {loading ? t('wx.loading') : t('wx.unavailable')}
      </div>
    );
  }

  const spray = sprayAdvice(data);
  const alerts = weatherAlerts(data);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-bold text-forest-850 mb-1">{t('wxpage.forecastTitle')}</h2>
        <p className="text-xs text-gray-500 mb-4">{t('wxpage.forecastSub')}</p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.days.map((day, i) => (
            <li key={day.date} className="rounded-xl border border-gray-200 bg-forest-50 p-3 text-center">
              <p className="text-xs font-bold text-forest-900">{i === 0 ? t('wxpage.today') : formatDate(day.date, lang)}</p>
              <div className="my-2 flex justify-center text-amber-500">
                <WeatherIcon code={day.code} className="w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600">{t(`wx.kind.${weatherKind(day.code)}`)}</p>
              <p className="text-sm font-bold text-forest-850 mt-1">
                {day.max !== null ? Math.round(day.max) : '--'}° / {day.min !== null ? Math.round(day.min) : '--'}°
              </p>
              <p className="text-[11px] text-cyan-700 flex items-center justify-center gap-1 mt-1">
                <CloudRain className="w-3 h-3" aria-hidden="true" />
                {day.rainProb}%
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className={`rounded-2xl p-5 border ${LEVEL_STYLE[spray.level]}`}>
          <h3 className="font-bold text-sm flex items-center gap-2">
            {spray.level === 'safe' ? <CheckCircle className="w-4 h-4" aria-hidden="true" /> : <AlertTriangle className="w-4 h-4" aria-hidden="true" />}
            {t('wx.spray')}: {t(`spray.${spray.level}`)}
          </h3>
          <ul className="mt-2 text-xs space-y-1 list-disc list-inside">
            {spray.reasons.length === 0 ? (
              <li>{t('spray.reason.none')}</li>
            ) : (
              spray.reasons.map((r) => <li key={r}>{t(`spray.reason.${r}`)}</li>)
            )}
          </ul>
          <p className="text-[11px] mt-3 opacity-80">{t('spray.hint')}</p>
        </section>

        <section className="bg-white rounded-2xl p-5 border border-gray-200">
          <h3 className="font-bold text-sm text-forest-850 mb-2">{t('wxpage.fieldAlerts')}</h3>
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li
                key={a.id}
                className={`text-xs rounded-lg px-3 py-2 border ${a.level === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}
              >
                {t(`adv.alert.${a.id}`)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
