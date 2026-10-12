import React, { useState } from 'react';
import { BookOpen, Calendar, Droplets, Layers, ShieldCheck, Sprout, AlertCircle, Thermometer } from 'lucide-react';
import { ICAR_CROPS } from '../data/initialData';

export default function CropAdvisorySection({ weather }) {
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [stage, setStage] = useState('vegetative');
  const [soilType, setSoilType] = useState('loamy');

  const crop = ICAR_CROPS.find(c => c.id === selectedCropId) || ICAR_CROPS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#193729] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#145C38]" />
            वैज्ञानिक फसल सलाह (ICAR & KVK मानक)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            फसल के चयन अनुसार बुवाई, सिंचाई चक्र, संतुलित N-P-K पोषण एवं सामयिक मौसम चेतावनियां
          </p>
        </div>

        {/* Live Weather Advisory Badge */}
        {weather && (
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 text-[#145C38]">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span>
              क्षेत्रीय तापमान: <strong>{weather.temp}°C</strong> | वर्षा संभावना: <strong>{weather.rainProb}%</strong>
            </span>
          </div>
        )}
      </div>

      {/* Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-semibold text-gray-700 block mb-1">फसल का चयन करें:</label>
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-[#145C38] focus:ring-2 focus:ring-[#75B85B]"
          >
            {ICAR_CROPS.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.season}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">वर्तमान फसल अवस्था:</label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-800 focus:ring-2 focus:ring-[#75B85B]"
          >
            <option value="sowing">बुवाई एवं अंकुरण (Germination)</option>
            <option value="vegetative">कल्ले फूटना / बढ़वार (Tillering / Vegetative)</option>
            <option value="flowering">फूल एवं फलियां बनना (Flowering)</option>
            <option value="maturity">परिपक्वता व कटाई (Maturity / Harvest)</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700 block mb-1">खेत की मिट्टी का प्रकार:</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl outline-none text-gray-800 focus:ring-2 focus:ring-[#75B85B]"
          >
            <option value="loamy">दोमट मिट्टी (Loamy Soil)</option>
            <option value="black">काली मिट्टी (Black Cotton Soil)</option>
            <option value="sandy">बलुई दोमट (Sandy Loam)</option>
            <option value="clay">चिकनी मिट्टी (Clayey Soil)</option>
          </select>
        </div>
      </div>

      {/* Main Guidance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sowing & Seed Rate */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#145C38] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#193729]">बुवाई समय व बीज दर</h4>
          <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">अवधि:</span> {crop.sowingPeriod}</p>
          <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">बीज दर:</span> {crop.seedRate}</p>
          <p className="text-xs text-gray-600"><span className="font-semibold text-gray-800">कतार दूरी:</span> {crop.spacing}</p>
        </div>

        {/* Card 2: Soil & pH */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#145C38] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#193729]">मृदा एवं अनुकूल pH</h4>
          <p className="text-xs text-gray-600">{crop.soil}</p>
          <p className="text-xs text-emerald-700 font-semibold mt-2">औसत उपज: {crop.avgYield}</p>
        </div>

        {/* Card 3: Fertilizers NPK */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#145C38] flex items-center justify-center font-bold">
            <Sprout className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#193729]">संतुलित N-P-K पोषण</h4>
          <p className="text-xs text-gray-700 font-medium">{crop.npkRatio}</p>
          <p className="text-[11px] text-gray-500">बुवाई पर पूरा फास्फोरस व पोटाश दें। यूरिया को 2-3 खुराकों में सिंचाई के साथ दें।</p>
        </div>

        {/* Card 4: Disease Prevention */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#193729]">प्रमुख रोग व रोकथाम</h4>
          <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
            {crop.commonDiseases.map((dis, idx) => (
              <li key={idx}>{dis}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical Irrigation Calendar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-[#193729] flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-600" />
          {crop.name} — क्रांतिक सिंचाई चक्र (Critical Irrigation Stages)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {crop.irrigationStages.map((stg, idx) => (
            <div key={idx} className="p-3.5 bg-[#F4F7F3] rounded-xl border border-gray-200/80 text-xs">
              <span className="text-[10px] font-bold text-cyan-700 uppercase block mb-1">चरण {idx + 1}</span>
              <p className="font-semibold text-gray-800">{stg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
