import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Camera, CheckCircle, FileText, Info, Loader2, RefreshCw, ScanLine, ShieldAlert, Sparkles, Upload } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { CROPS, pick } from '../data/crops.js';
import { analyzeCrop, checkBackend } from '../services/aiService.js';
import { fileToResizedDataURL } from '../lib/images.js';
import { cleanText } from '../lib/validators.js';

const MAX_FILE_BYTES = 15 * 1024 * 1024;

const SEVERITY_STYLE = {
  low: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-800 border-amber-200',
  severe: 'bg-red-50 text-red-800 border-red-200',
  critical: 'bg-red-100 text-red-900 border-red-300',
};

// The model's JSON is untrusted: coerce every field defensively before rendering.
function asList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v)).filter(Boolean).slice(0, 10);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function asText(value, fallback = '—') {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 400) : fallback;
}

function severityKey(value) {
  const key = String(value ?? '').toLowerCase();
  return SEVERITY_STYLE[key] ? key : 'moderate';
}

function List({ items, className = '' }) {
  if (items.length === 0) return <p className="text-gray-500">—</p>;
  return (
    <ul className={`space-y-1 list-disc list-inside ${className}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function CropScanner() {
  const { t, lang } = useLang();
  const [backend, setBackend] = useState(null); // null = checking
  const [preview, setPreview] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const [cropType, setCropType] = useState('auto');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    let alive = true;
    checkBackend().then((status) => alive && setBackend(status));
    return () => {
      alive = false;
    };
  }, []);

  const ready = backend?.online && backend?.ai;

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorCode('notImage');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorCode('tooLarge');
      return;
    }
    setPreparing(true);
    setErrorCode(null);
    setDiagnosis(null);
    try {
      setPreview(await fileToResizedDataURL(file));
    } catch {
      setPreview(null);
      setErrorCode('decode');
    } finally {
      setPreparing(false);
    }
  };

  const run = async () => {
    if (!preview || loading) return;
    setLoading(true);
    setErrorCode(null);
    setDiagnosis(null);
    try {
      const cropName = cropType === 'auto' ? 'auto' : pick(CROPS.find((c) => c.id === cropType)?.name, 'en');
      setDiagnosis(await analyzeCrop({ imageDataUrl: preview, cropType: cropName, notes: cleanText(notes, 200), lang }));
    } catch (err) {
      setErrorCode(err?.code || 'server');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setDiagnosis(null);
    setErrorCode(null);
    setNotes('');
  };

  const sev = diagnosis ? severityKey(diagnosis.severity) : null;
  const confidence = diagnosis ? Math.max(0, Math.min(100, Math.round(Number(diagnosis.confidenceScore) || 0))) : 0;

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-forest-500/20 rounded-xl border border-forest-500/40">
              <ScanLine className="w-6 h-6 text-forest-500" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold tracking-wide">{t('scan.title')}</h2>
          </div>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">{t('scan.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 text-xs" role="status">
          {backend === null ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <span className={`w-2 h-2 rounded-full ${ready ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />
          )}
          <span className="font-semibold text-emerald-200">
            {backend === null ? t('scan.checking') : ready ? t('scan.ready') : t('scan.unavailable')}
          </span>
        </div>
      </section>

      {backend && !ready && (
        <div role="alert" className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs">
          <Info className="w-5 h-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold">{backend.online ? t('scan.noKeyTitle') : t('scan.offlineTitle')}</p>
            <p className="mt-0.5">{backend.online ? t('scan.noKeyBody') : t('scan.offlineBody')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-sm text-forest-850 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4 text-forest-900" aria-hidden="true" />
              {t('scan.upload')}
            </h3>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[220px] ${preview ? 'border-forest-500 bg-emerald-50/20' : 'border-gray-300 hover:border-forest-900 bg-gray-50/60'}`}
            >
              {preparing ? (
                <Loader2 className="w-8 h-8 animate-spin text-forest-900" aria-hidden="true" />
              ) : preview ? (
                <>
                  <img src={preview} alt={t('scan.previewAlt')} className="max-h-[200px] rounded-lg object-contain shadow-sm" />
                  <span className="mt-2 text-[11px] text-gray-500">{t('scan.change')}</span>
                </>
              ) : (
                <span className="space-y-2 py-4 block">
                  <span className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-forest-900">
                    <Camera className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <span className="block text-xs font-bold text-gray-700">{t('scan.pick')}</span>
                  <span className="block text-[11px] text-gray-400">{t('scan.formats')}</span>
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" aria-label={t('scan.pick')} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" aria-label={t('scan.camera')} />

            <button type="button" onClick={() => cameraRef.current?.click()} className="mt-2 w-full text-xs font-semibold text-forest-900 border border-forest-900/30 hover:bg-emerald-50 rounded-xl py-2 flex items-center justify-center gap-2 sm:hidden">
              <Camera className="w-4 h-4" aria-hidden="true" />
              {t('scan.camera')}
            </button>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="scan-crop" className="text-xs font-semibold text-gray-700 block mb-1">
                  {t('scan.crop')}
                </label>
                <select id="scan-crop" value={cropType} onChange={(e) => setCropType(e.target.value)} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-forest-500 font-medium">
                  <option value="auto">{t('scan.cropAuto')}</option>
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {pick(c.name, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="scan-notes" className="text-xs font-semibold text-gray-700 block mb-1">
                  {t('scan.notes')}
                </label>
                <input id="scan-notes" type="text" maxLength={200} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('scan.notesPh')} className="w-full text-xs p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-forest-500" />
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={run}
                  disabled={loading || preparing || !preview || !ready}
                  className="flex-1 bg-forest-900 hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                      {t('scan.analyzing')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
                      {t('scan.run')}
                    </>
                  )}
                </button>
                {(preview || diagnosis) && (
                  <button type="button" onClick={reset} className="px-3 py-3 border border-gray-300 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-medium">
                    {t('common.reset')}
                  </button>
                )}
              </div>
            </div>
          </section>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs text-gray-700 space-y-1.5">
            <p className="font-bold text-forest-900 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              {t('scan.tipsTitle')}
            </p>
            <p>1. {t('scan.tip1')}</p>
            <p>2. {t('scan.tip2')}</p>
            <p>3. {t('scan.tip3')}</p>
          </div>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          {errorCode && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-xs mb-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">{t('scan.errorTitle')}</p>
                <p className="mt-0.5">{t(`scan.err.${errorCode}`)}</p>
              </div>
            </div>
          )}

          {diagnosis ? (
            <article className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-5 sm:p-6 space-y-5">
              <header className="border-b border-gray-100 pb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{asText(diagnosis.conditionType)}</span>
                  <h3 className="text-xl font-extrabold text-forest-850 mt-2">{asText(diagnosis.conditionName)}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {t('scan.identified')}: <span className="text-forest-900 font-bold">{asText(diagnosis.identifiedCrop)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${SEVERITY_STYLE[sev]}`}>
                    {t('scan.severity')}: {t(`scan.sev.${sev}`)}
                  </span>
                  <p className="text-[11px] text-gray-500 mt-1">{t('scan.confidence', { n: confidence })}</p>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <section className="bg-forest-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-forest-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    {t('scan.symptoms')}
                  </h4>
                  <List items={asList(diagnosis.visibleSymptoms)} className="text-gray-700" />
                </section>
                <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    {t('scan.causes')}
                  </h4>
                  <List items={asList(diagnosis.possibleCauses)} className="text-gray-700" />
                </section>
              </div>

              <div className="space-y-3 text-xs">
                <section className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-forest-900 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    {t('scan.organic')}
                  </h4>
                  <List items={asList(diagnosis.organicTreatment)} className="text-emerald-950 font-medium" />
                </section>
                <section className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    {t('scan.chemical')}
                  </h4>
                  <List items={asList(diagnosis.chemicalTreatment)} className="text-gray-800" />
                </section>
              </div>

              <section className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 space-y-2">
                <p className="font-bold text-forest-850">{t('scan.prevention')}</p>
                <List items={asList(diagnosis.preventiveMeasures)} className="text-gray-600" />
                <p className="pt-2 border-t border-gray-200 text-[11px] text-gray-500 italic">
                  {t('scan.disclaimer')} {asText(diagnosis.expertAdvisory, '')}
                </p>
              </section>
            </article>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500 min-h-[360px] flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-forest-50 flex items-center justify-center text-gray-400">
                <FileText className="w-8 h-8" aria-hidden="true" />
              </div>
              <h4 className="font-bold text-base text-forest-850">{t('scan.emptyTitle')}</h4>
              <p className="text-xs max-w-sm text-gray-400">{t('scan.emptyBody')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
