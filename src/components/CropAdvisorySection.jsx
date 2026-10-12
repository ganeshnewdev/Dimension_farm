import React, { useMemo, useState } from 'react';
import { BookOpen, Calendar, CloudRain, Droplets, Layers, ShieldCheck, Sprout, Thermometer } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { CROPS, findCrop, pick } from '../data/crops.js';
import { ADVISORY_STAGES, SOIL_TYPES, weatherAlerts } from '../lib/advisory.js';
import { farmProgress } from './FarmsSection.jsx';

const selectClass = 'w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs text-gray-800 focus:ring-2 focus:ring-forest-500';

// Map a derived growth stage onto the four advisory stages.
function toAdvisoryStage(stage) {
  if (stage === 'notSown') return 'sowing';
  if (stage === 'harvestDue') return 'maturity';
  return ADVISORY_STAGES.includes(stage) ? stage : 'vegetative';
}

function InfoCard({ icon: Icon, title, tone = 'emerald', children }) {
  const toneClass = tone === 'amber' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-forest-900';
  return (
    <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClass}`}>
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-sm text-forest-850">{title}</h3>
      {children}
    </section>
  );
}

export default function CropAdvisorySection({ weather, farms }) {
  const { t, lang } = useLang();
  const [cropId, setCropId] = useState('wheat');
  const [stage, setStage] = useState('vegetative');
  const [soil, setSoil] = useState('loamy');

  const crop = findCrop(cropId) ?? CROPS[0];
  const alerts = useMemo(() => (weather ? weatherAlerts(weather) : []), [weather]);
  const linkedFarms = useMemo(() => farms.filter((f) => f.cropId === crop.id), [farms, crop.id]);

  return (
    <div className="space-y-6">
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-forest-850 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-forest-900" aria-hidden="true" />
            {t('adv.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('adv.subtitle')}</p>
        </div>
        {weather && (
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-forest-900">
            <Thermometer className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>
              {t('adv.regional')}: <strong>{weather.temp}°C</strong> · {t('wx.rainProb')}: <strong>{weather.rainProb}%</strong>
            </span>
          </div>
        )}
      </section>

      <section className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label htmlFor="adv-crop" className="font-semibold text-gray-700 block mb-1 text-xs">
            {t('adv.crop')}
          </label>
          <select id="adv-crop" value={cropId} onChange={(e) => setCropId(e.target.value)} className={`${selectClass} font-bold text-forest-900`}>
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {pick(c.name, lang)} — {pick(c.season, lang)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="adv-stage" className="font-semibold text-gray-700 block mb-1 text-xs">
            {t('adv.stage')}
          </label>
          <select id="adv-stage" value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
            {ADVISORY_STAGES.map((s) => (
              <option key={s} value={s}>
                {t(`stage.${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="adv-soil" className="font-semibold text-gray-700 block mb-1 text-xs">
            {t('adv.soil')}
          </label>
          <select id="adv-soil" value={soil} onChange={(e) => setSoil(e.target.value)} className={selectClass}>
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>
                {t(`soil.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {linkedFarms.length > 0 && (
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
          <h3 className="font-bold text-forest-900 mb-2">{t('adv.yourFarms', { crop: pick(crop.name, lang) })}</h3>
          <ul className="flex flex-wrap gap-2">
            {linkedFarms.map((farm) => {
              const progress = farmProgress(farm);
              return (
                <li key={farm.id}>
                  <button
                    type="button"
                    disabled={!progress}
                    onClick={() => {
                      if (!progress) return;
                      setStage(toAdvisoryStage(progress.stage));
                      if (farm.soil) setSoil(farm.soil);
                    }}
                    className="bg-white border border-emerald-200 hover:border-forest-900 rounded-lg px-3 py-1.5 text-left disabled:opacity-60"
                    title={t('adv.useFarm')}
                  >
                    <span className="font-semibold text-forest-850">{farm.name}</span>
                    {progress && <span className="text-gray-500"> · {t(`stage.${progress.stage}`)}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-gray-500 mt-2">{t('adv.useFarm')}</p>
        </section>
      )}

      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm" aria-labelledby="adv-now">
        <h3 id="adv-now" className="font-bold text-base text-forest-850 mb-3 flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-cyan-600" aria-hidden="true" />
          {t('adv.now')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
            <p className="font-bold text-forest-900 mb-1">{t(`stage.${stage}`)}</p>
            <p className="text-gray-700">{t(`adv.stageTip.${stage}`)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="font-bold text-gray-800 mb-1">{t(`soil.${soil}`)}</p>
            <p className="text-gray-700">{t(`adv.soilTip.${soil}`)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="font-bold text-gray-800 mb-1">{t('adv.weatherNow')}</p>
            {weather ? (
              <ul className="space-y-1">
                {alerts.map((a) => (
                  <li key={a.id} className={a.level === 'ok' ? 'text-emerald-800' : 'text-amber-800'}>
                    {t(`adv.alert.${a.id}`)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">{t('wx.unavailable')}</p>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={Calendar} title={t('adv.sowing')}>
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800">{t('adv.period')}:</span> {pick(crop.sowing, lang)}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800">{t('adv.seedRate')}:</span> {pick(crop.seedRate, lang)}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800">{t('adv.spacing')}:</span> {pick(crop.spacing, lang)}
          </p>
        </InfoCard>

        <InfoCard icon={Layers} title={t('adv.soilCard')}>
          <p className="text-xs text-gray-600">{pick(crop.soil, lang)}</p>
          <p className="text-xs text-emerald-700 font-semibold mt-2">
            {t('adv.yield')}: {pick(crop.yield, lang)}
          </p>
        </InfoCard>

        <InfoCard icon={Sprout} title={t('adv.npk')}>
          <p className="text-xs text-gray-700 font-medium">{pick(crop.npk, lang)}</p>
          <p className="text-[11px] text-gray-500">{t('adv.npkHint')}</p>
        </InfoCard>

        <InfoCard icon={ShieldCheck} title={t('adv.diseases')} tone="amber">
          <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
            {crop.diseases.map((d, i) => (
              <li key={i}>{pick(d, lang)}</li>
            ))}
          </ul>
        </InfoCard>
      </div>

      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-forest-850 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-600" aria-hidden="true" />
          {t('adv.irrigation', { crop: pick(crop.name, lang) })}
        </h3>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {crop.irrigation.map((step, i) => (
            <li key={i} className="p-3.5 bg-forest-50 rounded-xl border border-gray-200/80 text-xs">
              <span className="text-[10px] font-bold text-cyan-700 uppercase block mb-1">{t('adv.step', { n: i + 1 })}</span>
              <p className="font-semibold text-gray-800">{pick(step, lang)}</p>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-gray-500">{t('adv.disclaimer')}</p>
      </section>
    </div>
  );
}
