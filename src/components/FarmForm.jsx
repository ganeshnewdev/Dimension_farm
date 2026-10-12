import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { CROPS, pick } from '../data/crops.js';
import { SOIL_KEYS, normalizeFarm } from '../lib/records.js';
import { parsePositive } from '../lib/finance.js';
import { isValidISODate, todayISO, uid } from '../lib/format.js';
import { cleanText } from '../lib/validators.js';
import { placeLabel } from '../services/weatherService.js';
import PlaceSearch from './PlaceSearch.jsx';

const inputClass =
  'w-full p-2.5 bg-white border border-gray-300 rounded-lg outline-none text-xs focus:ring-2 focus:ring-forest-500';

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold text-gray-700 block mb-1 text-xs">
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

export default function FarmForm({ currentPlace, onSubmit, onCancel }) {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [cropId, setCropId] = useState('wheat');
  const [cropLabel, setCropLabel] = useState('');
  const [area, setArea] = useState('');
  const [sownDate, setSownDate] = useState(todayISO());
  const [soil, setSoil] = useState('');
  const [picked, setPicked] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [test, setTest] = useState({ n: '', p: '', k: '', ph: '' });
  const [errors, setErrors] = useState({});

  const setTestField = (key) => (e) => setTest((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!cleanText(name, 80)) next.name = t('farm.err.name');
    if (cropId === 'other' && !cleanText(cropLabel, 60)) next.cropLabel = t('farm.err.crop');
    const areaValue = parsePositive(area);
    if (areaValue === null) next.area = t('farm.err.area');
    if (!isValidISODate(sownDate)) next.sownDate = t('farm.err.date');
    const ph = test.ph === '' ? null : Number(test.ph);
    if (ph !== null && !(ph >= 0 && ph <= 14)) next.ph = t('farm.err.ph');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const farm = normalizeFarm({
      id: uid('farm'),
      name,
      cropId,
      cropLabel: cropId === 'other' ? cropLabel : '',
      area: areaValue,
      location: picked ? placeLabel(picked) : cleanText(locationText, 100) || currentPlace.name,
      lat: picked ? picked.lat : currentPlace.lat,
      lon: picked ? picked.lon : currentPlace.lon,
      soil,
      soilTest: { n: test.n, p: test.p, k: test.k, ph: test.ph },
      sownDate,
      sample: false,
    });
    if (farm) onSubmit(farm);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-4">
      <h3 className="font-bold text-forest-900 text-sm">{t('farm.formTitle')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field id="farm-name" label={t('farm.name')} error={errors.name}>
          <input id="farm-name" className={inputClass} value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder={t('farm.namePh')} />
        </Field>

        <Field id="farm-crop" label={t('farm.crop')}>
          <select id="farm-crop" className={inputClass} value={cropId} onChange={(e) => setCropId(e.target.value)}>
            {CROPS.map((c) => (
              <option key={c.id} value={c.id}>
                {pick(c.name, lang)}
              </option>
            ))}
            <option value="other">{t('farm.cropOther')}</option>
          </select>
        </Field>

        {cropId === 'other' && (
          <Field id="farm-crop-label" label={t('farm.cropLabel')} error={errors.cropLabel}>
            <input id="farm-crop-label" className={inputClass} value={cropLabel} maxLength={60} onChange={(e) => setCropLabel(e.target.value)} />
          </Field>
        )}

        <Field id="farm-area" label={t('farm.area')} error={errors.area}>
          <input id="farm-area" className={inputClass} type="number" inputMode="decimal" min="0" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="3.5" />
        </Field>

        <Field id="farm-sown" label={t('farm.sownDate')} error={errors.sownDate}>
          <input id="farm-sown" className={inputClass} type="date" value={sownDate} onChange={(e) => setSownDate(e.target.value)} />
        </Field>

        <Field id="farm-soil" label={t('farm.soil')}>
          <select id="farm-soil" className={inputClass} value={soil} onChange={(e) => setSoil(e.target.value)}>
            <option value="">{t('farm.soilUnknown')}</option>
            {SOIL_KEYS.map((s) => (
              <option key={s} value={s}>
                {t(`soil.${s}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <p className="font-semibold text-gray-700 mb-1 text-xs">{t('farm.location')}</p>
        <PlaceSearch
          id="farm-location"
          keepLabel
          onPick={(place) => {
            setPicked(place);
            setLocationText(placeLabel(place));
          }}
          placeholder={t('farm.locationPh')}
          buttonLabel={t('farm.locationFind')}
        />
        <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          {picked ? t('farm.locationPicked', { name: placeLabel(picked) }) : t('farm.locationDefault', { name: currentPlace.name })}
        </p>
      </div>

      <fieldset className="border border-emerald-200 rounded-lg p-3">
        <legend className="px-1 text-xs font-semibold text-gray-700">{t('farm.soilTest')}</legend>
        <p className="text-[11px] text-gray-500 mb-2">{t('farm.soilTestHint')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['n', 'N'],
            ['p', 'P'],
            ['k', 'K'],
          ].map(([key, label]) => (
            <Field key={key} id={`farm-test-${key}`} label={`${label} (kg/ha)`}>
              <input id={`farm-test-${key}`} className={inputClass} type="number" inputMode="decimal" min="0" value={test[key]} onChange={setTestField(key)} />
            </Field>
          ))}
          <Field id="farm-test-ph" label="pH" error={errors.ph}>
            <input id="farm-test-ph" className={inputClass} type="number" inputMode="decimal" min="0" max="14" step="0.1" value={test.ph} onChange={setTestField('ph')} />
          </Field>
        </div>
      </fieldset>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-xs text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50">
          {t('common.cancel')}
        </button>
        <button type="submit" className="px-5 py-2 text-xs font-bold bg-forest-900 text-white rounded-lg hover:bg-forest-700">
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}
