import React from 'react';
import { Activity, AlertTriangle, CalendarDays, CloudSun, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { useWeather } from '../hooks/useWeather.js';
import { sprayAdvice, windBand } from '../lib/spray.js';
import { formatDate } from '../lib/format.js';
import Modal from './ui/Modal.jsx';
import { farmCropName, farmProgress } from './FarmsSection.jsx';

function Stat({ label, value, hint }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-xl font-bold text-forest-850">{value}</p>
      {hint && <span className="text-[11px] text-gray-500">{hint}</span>}
    </div>
  );
}

export default function FarmModal({ farm, onClose, onDelete }) {
  const { t, lang } = useLang();
  const { data, loading, error, refresh } = useWeather(farm.lat, farm.lon);
  const progress = farmProgress(farm);
  const test = farm.soilTest;
  const spray = data ? sprayAdvice(data) : null;

  const confirmDelete = () => {
    if (window.confirm(t('farm.confirmDelete', { name: farm.name }))) onDelete(farm.id);
  };

  return (
    <Modal
      title={farm.name}
      subtitle={`${farm.location} · ${t('farm.areaValue', { n: farm.area })} · ${farmCropName(farm, lang)}`}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={confirmDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            {t('farm.delete')}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-2 bg-forest-900 text-white rounded-xl text-sm font-semibold hover:bg-forest-700">
            {t('common.close')}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="bg-forest-50 rounded-xl p-4 border border-emerald-100" aria-busy={loading}>
          <h4 className="text-sm font-bold text-forest-900 flex items-center gap-2 mb-3">
            <CloudSun className="w-4 h-4 text-forest-500" aria-hidden="true" />
            {t('farm.liveWeather')}
          </h4>

          {data ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label={t('wx.temp')} value={`${data.temp}°C`} hint={t('wx.feels', { n: data.feelsLike })} />
              <Stat label={t('wx.wind')} value={`${data.wind} km/h`} hint={t(`wx.windband.${windBand(data.wind)}`)} />
              <Stat label={t('wx.humidity')} value={`${data.humidity}%`} />
              <Stat label={t('wx.rainProb')} value={`${data.rainProb}%`} hint={spray ? `${t('wx.spray')}: ${t(`spray.${spray.level}`)}` : ''} />
            </div>
          ) : loading ? (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              {t('wx.loading')}
            </p>
          ) : null}

          {error && (
            <div role="alert" className="mt-2 flex items-center gap-3 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{t('wx.error')}</span>
              <button type="button" onClick={refresh} className="flex items-center gap-1 font-bold underline">
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                {t('common.retry')}
              </button>
            </div>
          )}
        </section>

        <section>
          <h4 className="text-sm font-bold text-forest-900 mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-forest-500" aria-hidden="true" />
            {t('farm.calendar')}
          </h4>
          {progress ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-gray-500 block">{t('farm.stage')}</span>
                  <span className="font-bold text-forest-900 mt-0.5 block">{t(`stage.${progress.stage}`)}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block">{t('farm.sownDate')}</span>
                  <span className="font-semibold text-gray-800 mt-0.5 block">{formatDate(farm.sownDate, lang)}</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-500 block">{t('farm.harvest')}</span>
                  <span className="font-semibold text-gray-800 mt-0.5 block">{formatDate(progress.harvestDate, lang)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {progress.stage === 'notSown'
                  ? t('farm.daysToSow', { n: -progress.elapsed })
                  : progress.stage === 'harvestDue'
                    ? t('farm.harvestDue', { n: -progress.daysToHarvest })
                    : t('farm.daysProgress', { done: progress.elapsed, left: progress.daysToHarvest })}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">{t('farm.estimateNote')}</p>
            </>
          ) : (
            <p className="text-xs text-gray-500">{t('farm.noCalendar')}</p>
          )}
        </section>

        <section>
          <h4 className="text-sm font-bold text-forest-900 mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-forest-500" aria-hidden="true" />
            {t('farm.soilHealth')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 block">{t('farm.soil')}</span>
              <span className="font-semibold text-gray-800">{farm.soil ? t(`soil.${farm.soil}`) : t('common.notEntered')}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 block">pH</span>
              <span className="font-semibold text-gray-800">{test?.ph ?? t('common.notEntered')}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 sm:col-span-2">
              <span className="text-xs text-gray-500 block">N-P-K (kg/ha)</span>
              <span className="font-semibold text-gray-800">
                {test && (test.n !== null || test.p !== null || test.k !== null)
                  ? `N: ${test.n ?? '—'} | P: ${test.p ?? '—'} | K: ${test.k ?? '—'}`
                  : t('common.notEntered')}
              </span>
            </div>
          </div>
        </section>
      </div>
    </Modal>
  );
}
