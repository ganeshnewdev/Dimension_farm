import React, { useEffect, useState } from 'react';
import { X, MapPin, CloudSun, Activity, Sprout } from 'lucide-react';
import { fetchLiveWeather } from '../services/weatherService';

export default function FarmModal({ farm, onClose, t }) {
  const [farmWeather, setFarmWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farm) return;
    setLoading(true);
    fetchLiveWeather(farm.lat, farm.lon)
      .then((data) => {
        setFarmWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [farm]);

  if (!farm) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Modal Header */}
        <div className="bg-[#145C38] text-white p-5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Logo" 
              className="w-9 h-9 rounded-full border border-emerald-400 object-cover bg-white"
            />
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {farm.name}
              </h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {farm.location} ({farm.area})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Farm-Specific Live Weather Section */}
          <div className="bg-[#F4F7F3] rounded-xl p-4 border border-emerald-100">
            <h4 className="text-sm font-bold text-[#145C38] flex items-center gap-2 mb-3">
              <CloudSun className="w-4 h-4 text-[#75B85B]" />
              खेत का लाइव उपग्रह मौसम ({farm.location})
            </h4>

            {loading ? (
              <p className="text-sm text-gray-500 py-2">लाइव मौसम डेटा लोड हो रहा है...</p>
            ) : farmWeather ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">तापमान</span>
                  <p className="text-xl font-bold text-[#193729]">{farmWeather.temp}°C</p>
                  <span className="text-[11px] text-gray-400">अनुमान: {farmWeather.feelsLike}°C</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">हवा की गति</span>
                  <p className="text-xl font-bold text-[#193729]">{farmWeather.wind} km/h</p>
                  <span className="text-[11px] text-emerald-600">
                    {farmWeather.wind > 18 ? "तेज हवा" : "शांत"}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">नमी</span>
                  <p className="text-xl font-bold text-[#193729]">{farmWeather.humidity}%</p>
                  <span className="text-[11px] text-gray-400">संतुलित</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">बारिश संभावना</span>
                  <p className="text-xl font-bold text-emerald-700">{farmWeather.rainProb}%</p>
                  <span className="text-[11px] text-emerald-600">
                    {farmWeather.rainProb > 40 ? "संभावित" : "न्यूनतम"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-600">मौसम डेटा प्राप्त नहीं हो सका। पुनः प्रयास करें।</p>
            )}
          </div>

          {/* Soil & Nutrient Health */}
          <div>
            <h4 className="text-sm font-bold text-[#145C38] mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#75B85B]" />
              मृदा स्वास्थ्य व N-P-K विश्लेषण
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500 block">मिट्टी का प्रकार:</span>
                <span className="font-semibold text-gray-800">{farm.soil}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-500 block">pH स्तर:</span>
                <span className="font-semibold text-emerald-800">{farm.ph}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 sm:col-span-2">
                <span className="text-xs text-gray-500 block">N-P-K अनुपात:</span>
                <span className="font-semibold text-gray-800">{farm.npk}</span>
              </div>
            </div>
          </div>

          {/* Crop Stage & Calendar */}
          <div>
            <h4 className="text-sm font-bold text-[#145C38] mb-2">फसल चक्र व महत्वपूर्ण तिथियां</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                <span className="text-gray-500 block">वर्तमान अवस्था</span>
                <span className="font-bold text-[#145C38] mt-0.5 block">{farm.stage}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-500 block">बुवाई तिथि</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{farm.sownDate}</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-500 block">संभावित कटाई</span>
                <span className="font-semibold text-gray-800 mt-0.5 block">{farm.estHarvest}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#145C38] text-white rounded-xl text-sm font-semibold hover:bg-[#23764A] transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
