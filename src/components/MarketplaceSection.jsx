import React, { useMemo, useState } from 'react';
import { MapPin, MessageCircle, Phone, Plus, Search, ShoppingBag, Trash2 } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { usePersistentState } from '../hooks/usePersistentState.js';
import { useToast } from './ui/Toast.jsx';
import Modal from './ui/Modal.jsx';
import { SAMPLE_LISTINGS } from '../data/sample.js';
import { pick } from '../data/crops.js';
import { KEYS, LISTING_CATEGORIES, loadListings, normalizeListing } from '../lib/records.js';
import { parsePositive } from '../lib/finance.js';
import { formatINR, uid } from '../lib/format.js';
import { cleanText, formatIndianPhone, normalizeIndianPhone } from '../lib/validators.js';

const inputClass = 'w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none text-xs focus:ring-2 focus:ring-forest-500';

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

function ListingForm({ onSubmit, onCancel }) {
  const { t } = useLang();
  const [form, setForm] = useState({ title: '', category: 'Seeds', price: '', unit: '', vendor: '', phone: '', location: '', desc: '' });
  const [errors, setErrors] = useState({});
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!cleanText(form.title, 120)) next.title = t('shop.err.title');
    const price = parsePositive(form.price);
    if (price === null) next.price = t('shop.err.price');
    const phone = normalizeIndianPhone(form.phone);
    if (!phone) next.phone = t('shop.err.phone');
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit(
      normalizeListing({
        id: uid('prod'),
        title: form.title,
        category: form.category,
        price,
        unit: form.unit,
        vendor: form.vendor || t('shop.defaultVendor'),
        phone,
        location: form.location || t('shop.defaultLocation'),
        desc: form.desc,
        sample: false,
      }),
    );
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <Field id="l-title" label={t('shop.fTitle')} error={errors.title}>
        <input id="l-title" className={inputClass} value={form.title} maxLength={120} onChange={set('title')} placeholder={t('shop.fTitlePh')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field id="l-cat" label={t('shop.fCategory')}>
          <select id="l-cat" className={inputClass} value={form.category} onChange={set('category')}>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`shop.cat.${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="l-price" label={t('shop.fPrice')} error={errors.price}>
          <input id="l-price" className={inputClass} type="number" inputMode="decimal" min="0" value={form.price} onChange={set('price')} placeholder="1200" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="l-unit" label={t('shop.fUnit')}>
          <input id="l-unit" className={inputClass} value={form.unit} maxLength={40} onChange={set('unit')} placeholder={t('shop.fUnitPh')} />
        </Field>
        <Field id="l-loc" label={t('shop.fLocation')}>
          <input id="l-loc" className={inputClass} value={form.location} maxLength={80} onChange={set('location')} />
        </Field>
      </div>
      <Field id="l-vendor" label={t('shop.fVendor')}>
        <input id="l-vendor" className={inputClass} value={form.vendor} maxLength={80} onChange={set('vendor')} />
      </Field>
      <Field id="l-phone" label={t('shop.fPhone')} error={errors.phone}>
        <input id="l-phone" className={inputClass} type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="98765 43210" />
      </Field>
      <Field id="l-desc" label={t('shop.fDesc')}>
        <textarea id="l-desc" rows="2" className={inputClass} value={form.desc} maxLength={300} onChange={set('desc')} />
      </Field>
      <p className="text-[11px] text-gray-500">{t('shop.localNote')}</p>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-xs border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100">
          {t('common.cancel')}
        </button>
        <button type="submit" className="px-5 py-2 text-xs bg-forest-900 text-white rounded-xl font-bold hover:bg-forest-700">
          {t('shop.publish')}
        </button>
      </div>
    </form>
  );
}

export default function MarketplaceSection() {
  const { t, lang } = useLang();
  const notify = useToast();
  const [listings, setListings] = usePersistentState(KEYS.listings, () => loadListings(SAMPLE_LISTINGS));
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (!q) return true;
      return [pick(p.title, lang), pick(p.desc, lang), pick(p.location, lang), pick(p.vendor, lang)].some((s) => s.toLowerCase().includes(q));
    });
  }, [listings, category, query, lang]);

  const remove = (listing) => {
    if (!window.confirm(t('shop.confirmDelete'))) return;
    setListings((list) => list.filter((x) => x.id !== listing.id));
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-forest-850 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-forest-900" aria-hidden="true" />
            {t('shop.title')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('shop.subtitle')}</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="bg-forest-900 hover:bg-forest-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5">
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('shop.add')}
        </button>
      </section>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label={t('shop.fCategory')}>
          {['All', ...LISTING_CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${category === cat ? 'bg-forest-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat === 'All' ? t('shop.all') : t(`shop.cat.${cat}`)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('shop.search')}
            aria-label={t('shop.search')}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center bg-white rounded-2xl border border-gray-200">{t('common.noResults')}</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((p) => (
            <li key={p.id} className="border border-gray-200 rounded-2xl p-4 bg-white hover:border-forest-500 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{t(`shop.cat.${p.category}`)}</span>
                  {p.sample ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{t('common.sample')}</span>
                  ) : (
                    <span className="text-[11px] text-gray-400 flex items-center gap-0.5 min-w-0">
                      <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{pick(p.location, lang)}</span>
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-forest-850 mt-2">{pick(p.title, lang)}</h3>
                {p.desc && <p className="text-xs text-gray-500 mt-1">{pick(p.desc, lang)}</p>}
                <div className="mt-3">
                  <span className="text-base font-extrabold text-forest-900">{formatINR(p.price)}</span>
                  {p.unit && <span className="text-xs text-gray-500"> / {p.unit}</span>}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {t('shop.seller')}: <strong className="text-gray-700">{pick(p.vendor, lang)}</strong>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                {p.phone ? (
                  <>
                    <a href={`tel:+91${p.phone}`} className="flex-1 bg-forest-900 hover:bg-forest-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2">
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="truncate">{formatIndianPhone(p.phone)}</span>
                    </a>
                    <a
                      href={`https://wa.me/91${p.phone}?text=${encodeURIComponent(pick(p.title, lang))}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="WhatsApp"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl flex items-center justify-center"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </>
                ) : (
                  <p className="flex-1 text-[11px] text-gray-400 py-2">{t('shop.noContact')}</p>
                )}
                <button type="button" onClick={() => remove(p)} aria-label={t('common.delete')} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-2">
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <Modal title={t('shop.formTitle')} maxWidth="max-w-md" onClose={() => setShowForm(false)}>
          <ListingForm
            onCancel={() => setShowForm(false)}
            onSubmit={(listing) => {
              if (!listing) return;
              setListings((list) => [listing, ...list]);
              setShowForm(false);
              notify(t('shop.published'), 'success');
            }}
          />
        </Modal>
      )}
    </div>
  );
}
