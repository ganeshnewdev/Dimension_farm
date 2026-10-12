import React, { useState } from 'react';
import { ArrowRight, MapPin, Plus, Sprout, Trash2 } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { findCrop, pick } from '../data/crops.js';
import { cropProgress } from '../lib/stage.js';
import { todayISO } from '../lib/format.js';
import FarmForm from './FarmForm.jsx';

export function farmCropName(farm, lang) {
  const crop = findCrop(farm.cropId);
  return crop ? pick(crop.name, lang) : farm.cropLabel || '—';
}

export function farmProgress(farm, today = todayISO()) {
  const crop = findCrop(farm.cropId);
  if (!crop) return null;
  return cropProgress({ sownDate: farm.sownDate, durationDays: crop.durationDays, today });
}

export default function FarmsSection({ farms, currentPlace, onAddFarm, onOpenFarm, onLoadSamples, onClearSamples }) {
  const { t, lang } = useLang();
  const [showForm, setShowForm] = useState(false);
  const hasSamples = farms.some((f) => f.sample);

  return (
    <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/80" aria-labelledby="farms-heading">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 id="farms-heading" className="text-xl font-bold text-forest-850 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-forest-900" aria-hidden="true" />
            {t('farm.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('farm.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          className="bg-forest-900 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('farm.add')}
        </button>
      </div>

      {showForm && (
        <FarmForm
          currentPlace={currentPlace}
          onCancel={() => setShowForm(false)}
          onSubmit={(farm) => {
            onAddFarm(farm);
            setShowForm(false);
          }}
        />
      )}

      {farms.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Sprout className="w-10 h-10 mx-auto text-gray-300" aria-hidden="true" />
          <h3 className="font-bold text-forest-850 mt-2">{t('farm.emptyTitle')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">{t('farm.emptyBody')}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setShowForm(true)} className="bg-forest-900 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2 rounded-lg">
              {t('farm.add')}
            </button>
            <button type="button" onClick={onLoadSamples} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg">
              {t('common.loadSamples')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {farms.map((farm) => {
              const progress = farmProgress(farm);
              return (
                <li key={farm.id}>
                  <button
                    type="button"
                    onClick={() => onOpenFarm(farm.id)}
                    className="group w-full h-full text-left border border-gray-200 hover:border-forest-500 rounded-xl p-4 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <span className="block">
                      <span className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-forest-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {t('farm.areaValue', { n: farm.area })}
                        </span>
                        {farm.sample && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            {t('common.sample')}
                          </span>
                        )}
                      </span>
                      <span className="block font-bold text-base text-forest-850 mt-2 group-hover:text-forest-900">{farm.name}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
                        {farm.location}
                      </span>
                      <span className="block mt-3 p-2 bg-forest-50 rounded-lg text-xs space-y-1">
                        <span className="block">
                          <span className="text-gray-500">{t('farm.cropShort')}: </span>
                          <span className="font-semibold text-gray-800">{farmCropName(farm, lang)}</span>
                        </span>
                        {progress && (
                          <span className="block">
                            <span className="text-gray-500">{t('farm.stage')}: </span>
                            <span className="text-gray-700">{t(`stage.${progress.stage}`)}</span>
                          </span>
                        )}
                      </span>
                      {progress && progress.stage !== 'notSown' && (
                        <span className="block mt-3" aria-hidden="true">
                          <span className="block h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <span className="block h-full bg-forest-500" style={{ width: `${Math.round(progress.progress * 100)}%` }} />
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-forest-900 font-bold">
                      {t('farm.viewDetails')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hasSamples && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-900">
              <span>{t('common.samplesNotice')}</span>
              <button type="button" onClick={onClearSamples} className="flex items-center gap-1 font-bold underline">
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                {t('common.clearSamples')}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
