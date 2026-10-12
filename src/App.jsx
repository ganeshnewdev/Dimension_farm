import React, { useState, useEffect } from 'react';
import { Menu, Globe, MapPin, Plus, Sprout, ArrowRight, Bot, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import Sidebar from './components/Sidebar';
import WeatherBanner from './components/WeatherBanner';
import FarmModal from './components/FarmModal';
import MandiSection from './components/MandiSection';
import MarketplaceSection from './components/MarketplaceSection';
import CropScanner from './components/CropScanner';
import CropAdvisorySection from './components/CropAdvisorySection';
import FinancesSection from './components/FinancesSection';
import DimensionsFarmAI from './components/DimensionsFarmAI';
import { TRANSLATIONS } from './data/translations';
import { INITIAL_FARMS } from './data/initialData';
import { fetchLiveWeather } from './services/weatherService';

export default function App() {
  const [lang, setLang] = useState('hi');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Weather State (Jaipur Default)
  const [locationName, setLocationName] = useState("जयपुर (Jaipur, Rajasthan)");
  const [coords, setCoords] = useState({ lat: 26.9124, lon: 75.7873 });
  const [weather, setWeather] = useState(null);

  // Farms State
  const [farms, setFarms] = useState(() => {
    const saved = localStorage.getItem('dim_farm_plots');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmCrop, setNewFarmCrop] = useState("");
  const [newFarmLoc, setNewFarmLoc] = useState("");

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('dim_farm_plots', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    loadWeather(coords.lat, coords.lon);
  }, [coords]);

  const loadWeather = async (lat, lon) => {
    const data = await fetchLiveWeather(lat, lon);
    if (data) setWeather(data);
  };

  const handleLocationSelect = (lat, lon, name) => {
    setCoords({ lat, lon });
    setLocationName(name);
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          handleLocationSelect(lat, lon, "मेरा वर्तमान स्थान (GPS)");
        },
        () => {
          alert("GPS अनुमति प्राप्त नहीं हुई। कृपया खोज बॉक्स में अपना शहर दर्ज करें।");
        }
      );
    } else {
      alert("आपके डिवाइस में GPS उपलब्ध नहीं है।");
    }
  };

  const handleAddFarm = (e) => {
    e.preventDefault();
    if (!newFarmName.trim() || !newFarmCrop.trim()) return;
    const newFarm = {
      id: `farm-${Date.now()}`,
      name: newFarmName,
      crop: newFarmCrop,
      area: "3.0",
      unit: "एकड़",
      location: newFarmLoc || locationName,
      lat: coords.lat,
      lon: coords.lon,
      soil: "सामान्य दोमट मिट्टी",
      npk: "N: 120 (सामान्य) | P: 22 (मध्यम) | K: 170 (मध्यम)",
      ph: "7.0 (उदासीन)",
      stage: "प्रारंभिक बढ़वार",
      sownDate: new Date().toISOString().split('T')[0],
      estHarvest: "3 महीने बाद"
    };
    setFarms([newFarm, ...farms]);
    setNewFarmName("");
    setNewFarmCrop("");
    setNewFarmLoc("");
    setShowAddFarm(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F3] flex relative">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        t={t} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2.5">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="Dimensions Farm" 
                className="w-9 h-9 rounded-full object-cover border border-[#75B85B] shadow-sm bg-white"
              />
              <div>
                <h2 className="text-base font-bold text-[#193729] leading-tight">
                  {activeTab === 'dashboard' ? 'स्मार्ट कृषि डैशबोर्ड' : activeTab.toUpperCase()}
                </h2>
                <p className="text-[11px] text-gray-500 hidden sm:block">
                  Dimensions Farm • {locationName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-[#145C38] text-white rounded-full hover:bg-[#23764A] transition-all shadow-sm"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-300" />
              <span>डाइमेंशन्स फार्म एआई</span>
            </button>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-[#145C38] border border-emerald-200 rounded-full hover:bg-emerald-100 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {/* Universal Weather First Hero Banner (Available across top) */}
          <WeatherBanner
            weather={weather}
            locationName={locationName}
            onLocationSelect={handleLocationSelect}
            onDetectGPS={handleDetectGPS}
            onOpenAI={() => setIsAIOpen(true)}
            t={t}
          />

          {/* TAB 1: Main Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Quick AI Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('scanner')}
                  className="bg-gradient-to-br from-[#145C38] to-[#1E6B43] text-white p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.01] transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-black/20 px-2 py-0.5 rounded-full">
                    विज़न मॉडल
                  </span>
                  <h3 className="font-bold text-base mt-2 flex items-center justify-between">
                    AI क्रॉप स्कैनर
                    <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">
                    पत्ती की तस्वीर से फसल रोग व कीट पहचानें और जैविक व रासायनिक उपाय पाएं।
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('advisory')}
                  className="bg-white border border-emerald-200 p-5 rounded-2xl shadow-sm cursor-pointer hover:border-[#145C38] transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ICAR मानक
                  </span>
                  <h3 className="font-bold text-base text-[#193729] mt-2 flex items-center justify-between">
                    फसल सलाह व सिंचाई चक्र
                    <ArrowRight className="w-4 h-4 text-[#145C38]" />
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    बुवाई से कटाई तक क्रांतिक सिंचाई चरण, NPK खाद और खरपतवार नियंत्रण।
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('income')}
                  className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm cursor-pointer hover:border-[#145C38] transition-all"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    वित्तीय प्रबंधन
                  </span>
                  <h3 className="font-bold text-base text-[#193729] mt-2 flex items-center justify-between">
                    आय, खर्च व शुद्ध लाभ
                    <ArrowRight className="w-4 h-4 text-[#145C38]" />
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    प्रति एकड़ लागत, मंडी बिक्री एवं कुल मुनाफे का सटीक ऑटो-कैलकुलेटर।
                  </p>
                </div>
              </div>

              {/* My Farms Overview */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#193729] flex items-center gap-2">
                      <Sprout className="w-6 h-6 text-[#145C38]" />
                      पंजीकृत खेत (My Farms)
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      प्रत्येक खेत का समर्पित उपग्रह मौसम और N-P-K स्वास्थ्य कार्ड
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddFarm(!showAddFarm)}
                    className="bg-[#145C38] hover:bg-[#23764A] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ नया खेत जोड़ें</span>
                  </button>
                </div>

                {showAddFarm && (
                  <form onSubmit={handleAddFarm} className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 text-xs">
                    <h4 className="font-bold text-[#145C38]">नया खेत पंजीकृत करें</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="खेत का नाम (उदा. गंगा फार्म)"
                        value={newFarmName}
                        onChange={(e) => setNewFarmName(e.target.value)}
                        required
                        className="p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                      <input
                        type="text"
                        placeholder="मुख्य फसल (उदा. गेहूं, सरसों)"
                        value={newFarmCrop}
                        onChange={(e) => setNewFarmCrop(e.target.value)}
                        required
                        className="p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                      <input
                        type="text"
                        placeholder="स्थान / जिला (उदा. कुरुक्षेत्र)"
                        value={newFarmLoc}
                        onChange={(e) => setNewFarmLoc(e.target.value)}
                        className="p-2.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddFarm(false)}
                        className="px-3 py-1.5 text-gray-600 bg-white rounded-lg border border-gray-200"
                      >
                        रद्द करें
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 font-bold bg-[#145C38] text-white rounded-lg hover:bg-[#23764A]"
                      >
                        सहेजें
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className="border border-gray-200 hover:border-[#75B85B] rounded-xl p-4 bg-white hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-semibold text-[#145C38] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {farm.area} एकड़
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            उत्कृष्ट स्वास्थ्य
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#193729] mt-2 group-hover:text-[#145C38]">
                          {farm.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {farm.location}
                        </p>
                        <div className="mt-3 p-2 bg-[#F4F7F3] rounded-lg text-xs space-y-1">
                          <p><span className="text-gray-500">फसल:</span> <span className="font-semibold text-gray-800">{farm.crop}</span></p>
                          <p><span className="text-gray-500">अवस्था:</span> <span className="text-gray-700">{farm.stage}</span></p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#145C38] font-bold">
                        <span>खेत व समर्पित मौसम देखें</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandi Section on Dashboard */}
              <MandiSection t={t} />
            </div>
          )}

          {/* TAB 2: AI Crop Scanner */}
          {activeTab === 'scanner' && <CropScanner />}

          {/* TAB 3: Crop Advisory */}
          {activeTab === 'advisory' && <CropAdvisorySection weather={weather} />}

          {/* TAB 4: Income & Profit */}
          {activeTab === 'income' && <FinancesSection defaultTab="income" />}

          {/* TAB 5: Budget & Expenses */}
          {activeTab === 'budget' && <FinancesSection defaultTab="budget" />}

          {/* TAB 6: Mandi Rates */}
          {activeTab === 'mandi' && <MandiSection t={t} />}

          {/* TAB 7: My Farms */}
          {activeTab === 'myFarms' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-[#193729]">खेत प्रबंधन (Multi-Farm Management)</h3>
                  <button
                    onClick={() => setShowAddFarm(!showAddFarm)}
                    className="bg-[#145C38] text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    + नया खेत जोड़ें
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className="border border-gray-200 hover:border-[#145C38] p-4 rounded-xl cursor-pointer bg-white"
                    >
                      <h4 className="font-bold text-[#145C38]">{farm.name}</h4>
                      <p className="text-xs text-gray-500">{farm.location} ({farm.area} एकड़)</p>
                      <p className="text-xs font-semibold text-gray-800 mt-2">फसल: {farm.crop}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Weather Only */}
          {activeTab === 'weather' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-[#193729] mb-2">अखिल भारतीय उपग्रह मौसम पूर्वानुमान</h3>
              <p className="text-xs text-gray-500 mb-6">
                Open-Meteo उपग्रह नेटवर्क द्वारा वास्तविक समय में तापमान, हवा की दिशा, गति एवं वर्षा संभावना।
              </p>
              <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-950 border border-emerald-200">
                शीर्ष खोज पट्टी से भारत का कोई भी शहर, कस्बा या तहसील खोजें।
              </div>
            </div>
          )}

          {/* TAB 9: Marketplace */}
          {activeTab === 'shop' && <MarketplaceSection />}
        </main>
      </div>

      {/* Floating AI Button */}
      {!isAIOpen && (
        <button
          onClick={() => setIsAIOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#145C38] to-[#23764A] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-3 border-2 border-[#75B85B]"
          title="डाइमेंशन्स फार्म एआई से पूछें"
        >
          <div className="relative">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="AI" 
              className="w-8 h-8 rounded-full object-cover border border-emerald-300 bg-white"
            />
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute -top-0.5 -right-0.5 border border-white animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-sm">डाइमेंशन्स फार्म एआई</span>
        </button>
      )}

      {/* Dimensions Farm AI Chatbot */}
      <DimensionsFarmAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        t={t}
      />

      {/* Farm Detail & Live Weather Modal */}
      <FarmModal
        farm={selectedFarm}
        onClose={() => setSelectedFarm(null)}
        t={t}
      />
    </div>
  );
}
