import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { placeLabel, searchPlaces } from '../services/weatherService.js';

// Search any place via Open-Meteo geocoding and pick a result.
//   variant 'hero' : large white input used on the weather banner
//   variant 'form' : compact bordered input used inside forms
export default function PlaceSearch({ onPick, placeholder, buttonLabel, variant = 'form', keepLabel = false, id }) {
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null); // null = nothing shown, [] = no matches
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  const boxRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (results === null) return undefined;
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setResults(null);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setResults(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [results]);

  const runSearch = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setSearching(true);
    setFailed(false);
    try {
      setResults(await searchPlaces(q, lang, ctrl.signal));
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setFailed(true);
        setResults(null);
      }
    } finally {
      if (abortRef.current === ctrl) setSearching(false);
    }
  };

  const pick = (place) => {
    onPick(place);
    setResults(null);
    setQuery(keepLabel ? placeLabel(place) : '');
  };

  const hero = variant === 'hero';
  const inputClass = hero
    ? 'w-full bg-white text-gray-900 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-forest-500 shadow-inner'
    : 'w-full bg-white text-gray-900 placeholder-gray-400 pl-8 pr-3 py-2.5 rounded-lg text-xs border border-gray-300 outline-none focus:ring-2 focus:ring-forest-500';
  const buttonClass = hero
    ? 'bg-forest-500 hover:bg-[#629f4a] font-semibold px-4 py-2.5 rounded-xl text-sm text-white shadow-md flex items-center gap-1.5 shrink-0 disabled:opacity-60'
    : 'bg-forest-900 hover:bg-forest-700 font-semibold px-3 py-2.5 rounded-lg text-xs text-white flex items-center gap-1.5 shrink-0 disabled:opacity-60';

  return (
    <div ref={boxRef} className="relative">
      <form onSubmit={runSearch} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 text-gray-400 absolute left-3 ${hero ? 'top-3.5' : 'top-3'}`} aria-hidden="true" />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={searching || query.trim().length < 2} className={buttonClass}>
          {searching && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {searching ? t('search.searching') : buttonLabel}
        </button>
      </form>

      {failed && (
        <p role="alert" className={`mt-2 text-xs ${hero ? 'text-amber-200' : 'text-red-600'}`}>
          {t('search.failed')}
        </p>
      )}

      {results !== null && (
        <ul className="absolute top-full mt-1 left-0 right-0 bg-white text-gray-900 rounded-xl shadow-2xl z-30 overflow-hidden border border-gray-100 max-h-60 overflow-y-auto">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-xs text-gray-500">{t('search.none')}</li>
          ) : (
            results.map((place) => (
              <li key={place.id} className="border-b border-gray-100 last:border-0">
                <button
                  type="button"
                  onClick={() => pick(place)}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 flex justify-between items-center gap-3 text-sm"
                >
                  <span className="min-w-0">
                    <span className="font-bold text-forest-850">{place.name}</span>
                    <span className="text-gray-500 text-xs ml-2">
                      {[place.admin1, place.country].filter(Boolean).join(', ')}
                    </span>
                  </span>
                  <span className="text-xs text-forest-900 font-bold shrink-0">{t('search.pick')}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
