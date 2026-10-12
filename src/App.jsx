import React, { useCallback, useState } from 'react';
import { Bot, Globe, Menu } from 'lucide-react';
import { LangProvider, useLang } from './i18n/index.jsx';
import { useRoute } from './hooks/useRoute.js';
import { useWeather } from './hooks/useWeather.js';
import { usePersistentState } from './hooks/usePersistentState.js';
import { KEYS, loadFarms, materializeSampleFarms } from './lib/records.js';
import { loadJSON } from './lib/storage.js';
import { placeLabel } from './services/weatherService.js';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import Logo from './components/ui/Logo.jsx';
import { ToastProvider, useToast } from './components/ui/Toast.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import WeatherPage from './components/WeatherPage.jsx';
import WeatherBanner from './components/WeatherBanner.jsx';
import FarmsSection from './components/FarmsSection.jsx';
import FarmModal from './components/FarmModal.jsx';
import MandiSection from './components/MandiSection.jsx';
import MarketplaceSection from './components/MarketplaceSection.jsx';
import CropScanner from './components/CropScanner.jsx';
import CropAdvisorySection from './components/CropAdvisorySection.jsx';
import FinancesSection from './components/FinancesSection.jsx';
import ChatWidget from './components/ChatWidget.jsx';

const DEFAULT_PLACE = { lat: 26.9124, lon: 75.7873, name: 'Jaipur, Rajasthan' };

function loadPlace() {
  const saved = loadJSON(KEYS.location, null);
  const ok =
    saved &&
    Number.isFinite(saved.lat) &&
    Number.isFinite(saved.lon) &&
    Math.abs(saved.lat) <= 90 &&
    Math.abs(saved.lon) <= 180 &&
    typeof saved.name === 'string';
  return ok ? saved : DEFAULT_PLACE;
}

function Shell() {
  const { t, lang, setLang } = useLang();
  const notify = useToast();
  const [route, navigate] = useRoute();
  const [navOpen, setNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [place, setPlace] = usePersistentState(KEYS.location, loadPlace);
  const [farms, setFarms] = usePersistentState(KEYS.farms, loadFarms);
  const [openFarmId, setOpenFarmId] = useState(null);
  const weather = useWeather(place.lat, place.lon);

  const openFarm = farms.find((f) => f.id === openFarmId) ?? null;
  const openChat = useCallback(() => setChatOpen(true), []);

  const pickPlace = useCallback(
    (p) => setPlace({ lat: p.lat, lon: p.lon, name: placeLabel(p) }),
    [setPlace],
  );

  const detectGPS = useCallback(() => {
    if (!('geolocation' in navigator)) {
      notify(t('loc.unsupported'), 'error');
      return;
    }
    setGpsBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsBusy(false);
        setPlace({
          lat: Math.round(pos.coords.latitude * 10000) / 10000,
          lon: Math.round(pos.coords.longitude * 10000) / 10000,
          name: t('loc.gpsName'),
        });
      },
      (err) => {
        setGpsBusy(false);
        notify(err.code === 1 ? t('loc.denied') : t('loc.failed'), 'error');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [notify, setPlace, t]);

  const addFarm = useCallback((farm) => setFarms((list) => [farm, ...list]), [setFarms]);
  const deleteFarm = useCallback(
    (id) => {
      setFarms((list) => list.filter((f) => f.id !== id));
      setOpenFarmId(null);
    },
    [setFarms],
  );
  const loadSamples = useCallback(() => {
    setFarms((list) => [...materializeSampleFarms().filter(Boolean), ...list]);
  }, [setFarms]);
  const clearSamples = useCallback(() => setFarms((list) => list.filter((f) => !f.sample)), [setFarms]);

  const title = route === 'dashboard' ? t('header.dashboard') : t(`nav.${route}`);
  const farmProps = {
    farms,
    currentPlace: place,
    onAddFarm: addFarm,
    onOpenFarm: setOpenFarmId,
    onLoadSamples: loadSamples,
    onClearSamples: clearSamples,
  };

  return (
    <div className="min-h-screen bg-forest-50 flex relative">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] bg-white text-forest-900 px-3 py-2 rounded-lg shadow">
        {t('a11y.skip')}
      </a>

      <Sidebar route={route} isOpen={navOpen} onClose={() => setNavOpen(false)} onOpenAI={openChat} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label={t('nav.open')}
              aria-controls="site-nav"
              aria-expanded={navOpen}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
            <Logo alt="" className="w-9 h-9 border border-forest-500 shadow-sm shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base font-bold text-forest-850 leading-tight truncate">{title}</h1>
              <p className="text-[11px] text-gray-500 hidden sm:block truncate">
                Dimensions Farm • {place.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={openChat} className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-forest-900 text-white rounded-full hover:bg-forest-700 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
              {t('nav.ai')}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              aria-label={t('lang.switch')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-forest-900 border border-emerald-200 rounded-full hover:bg-emerald-100"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6 outline-none">
          {route === 'dashboard' && (
            <Dashboard
              {...farmProps}
              weather={weather}
              place={place}
              onPlacePick={pickPlace}
              onDetectGPS={detectGPS}
              gpsBusy={gpsBusy}
              onOpenAI={openChat}
              onNavigate={navigate}
            />
          )}

          {route === 'scanner' && <CropScanner />}
          {route === 'advisory' && <CropAdvisorySection weather={weather.data} farms={farms} />}
          {route === 'income' && <FinancesSection tab="income" onTabChange={navigate} farms={farms} />}
          {route === 'budget' && <FinancesSection tab="budget" onTabChange={navigate} farms={farms} />}
          {route === 'mandi' && <MandiSection />}
          {route === 'farms' && <FarmsSection {...farmProps} />}

          {route === 'weather' && (
            <>
              <WeatherBanner weather={weather} placeName={place.name} onPlacePick={pickPlace} onDetectGPS={detectGPS} gpsBusy={gpsBusy} onOpenAI={openChat} />
              <WeatherPage weather={weather} />
            </>
          )}

          {route === 'shop' && <MarketplaceSection />}
        </main>
      </div>

      {!chatOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label={t('nav.ai')}
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-forest-900 to-forest-700 text-white p-3 sm:px-5 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-3 border-2 border-forest-500"
        >
          <span className="relative">
            <Logo alt="" className="w-8 h-8 border border-emerald-300" />
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -top-0.5 -right-0.5 border border-white" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline font-bold text-sm">{t('nav.ai')}</span>
        </button>
      )}

      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {openFarm && <FarmModal key={openFarm.id} farm={openFarm} onClose={() => setOpenFarmId(null)} onDelete={deleteFarm} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LangProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </LangProvider>
    </ErrorBoundary>
  );
}
