import React, { useState } from 'react';
import { CloudSun, Search, Navigation, Droplets, Wind, ShieldCheck, Sparkles } from 'lucide-react';
import { searchGeocoding } from '../services/weatherService';

export default function WeatherBanner({ weather, locationName, onLocationSelect, onDetectGPS, onOpenAI, t }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const data = await searchGeocoding(query);
    setResults(data);
    setSearching(false);
  };

  const handlePick = (loc) => {
    const fullName = `${loc.name}, ${loc.admin1 || loc.country}`;
    onLocationSelect(loc.latitude, loc.longitude, fullName);
    setResults([]);
    setQuery("");
  };

  return (
    <div className="bg-gradient-to-br from-[#145C38] via-[#1E6B43] to-[#23764A] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-6">
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
            {t.liveBadge}
          </span>
          {weather?.timestamp && (
            <span className="text-xs text-gray-300">({weather.timestamp})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 bg-[#75B85B] hover:bg-[#629f4a] text-white text-xs px-3.5 py-1.5 rounded-full transition-all shadow-md font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>डाइमेंशन्स फार्म एआई से पूछें</span>
          </button>
          <button
            onClick={onDetectGPS}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-xs px-3.5 py-1.5 rounded-full transition-all border border-white/20 font-medium"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.locateMe}</span>
          </button>
        </div>
      </div>

      {/* Universal All-India Search */}
      <form onSubmit={handleSearch} className="mb-6 relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white text-gray-900 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#75B85B] shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-[#75B85B] hover:bg-[#629f4a] font-semibold px-4 py-2.5 rounded-xl text-sm text-white transition-all shadow-md flex items-center gap-1 flex-shrink-0"
          >
            {searching ? "खोज रहे..." : t.searchBtn}
          </button>
        </div>

        {/* Dropdown search results */}
        {results.length > 0 && (
          <div className="absolute top-12 left-0 right-0 bg-white text-gray-900 rounded-xl shadow-2xl z-30 overflow-hidden border border-gray-100 max-h-60 overflow-y-auto">
            {results.map((loc, idx) => (
              <div
                key={idx}
                onClick={() => handlePick(loc)}
                className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center text-sm"
              >
                <div>
                  <span className="font-bold text-[#193729]">{loc.name}</span>
                  <span className="text-gray-500 text-xs ml-2">({loc.admin1}, {loc.country})</span>
                </div>
                <span className="text-xs text-[#145C38] font-bold">चुनें →</span>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Temp & Location */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <CloudSun className="w-9 h-9 text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-emerald-200">{locationName}</h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold">{weather ? `${weather.temp}°C` : "--"}</span>
              {weather && (
                <span className="text-xs text-gray-200">
                  (अनुमान: {weather.feelsLike}°C)
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-300 mt-0.5">
              अधिकतम: {weather?.dailyMax ?? "--"}°C | न्यूनतम: {weather?.dailyMin ?? "--"}°C
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <Droplets className="w-8 h-8 text-cyan-300 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-200">{t.humidity}</p>
            <p className="text-xl font-bold">{weather ? `${weather.humidity}%` : "--"}</p>
            <p className="text-xs text-emerald-300">संतुलित वातावरण</p>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <Wind className="w-8 h-8 text-sky-200 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-200">{t.wind}</p>
            <p className="text-xl font-bold">{weather ? `${weather.wind} km/h` : "--"}</p>
            <p className="text-xs text-emerald-300">
              {weather?.wind > 20 ? "हवा तेज (छिड़काव न करें)" : "हवा सामान्य (छिड़काव अनुकूल)"}
            </p>
          </div>
        </div>

        {/* Spray Advisory */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-300 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-200">{t.sprayAdvisory}</p>
            <p className="text-sm font-bold text-white mt-0.5">
              {weather?.wind <= 18 && weather?.rainProb < 30 ? "अनुकूल समय (Safe)" : "छिड़काव से बचें"}
            </p>
            <p className="text-xs text-emerald-200">बारिश आशंका: {weather?.rainProb ?? 0}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
