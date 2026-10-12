import React, { useState } from 'react';
import { TrendingUp, Phone, MessageSquare, Search } from 'lucide-react';
import { MANDI_RATES } from '../data/initialData';

export default function MandiSection({ t }) {
  const [selectedState, setSelectedState] = useState("All");
  const [searchCrop, setSearchCrop] = useState("");

  const states = ["All", ...new Set(MANDI_RATES.map((m) => m.state))];

  const filteredRates = MANDI_RATES.filter((m) => {
    const matchState = selectedState === "All" || m.state === selectedState;
    const matchCrop =
      !searchCrop ||
      m.commodity.toLowerCase().includes(searchCrop.toLowerCase()) ||
      m.mandi.toLowerCase().includes(searchCrop.toLowerCase()) ||
      m.district.toLowerCase().includes(searchCrop.toLowerCase());
    return matchState && matchCrop;
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#193729] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#145C38]" />
            {t.mandiTitle}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t.mandiSub}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 outline-none font-semibold text-gray-700 focus:ring-1 focus:ring-[#75B85B]"
          >
            <option value="All">{t.allStates}</option>
            {states.filter(s => s !== "All").map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="फसल या मंडी खोजें..."
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-300 rounded-xl pl-8 pr-3 py-2 outline-none text-gray-700 focus:ring-1 focus:ring-[#75B85B]"
            />
          </div>
        </div>
      </div>

      {/* Mandi Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredRates.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl p-4 hover:border-[#75B85B] hover:shadow-md transition-all bg-white flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#145C38] border border-emerald-200">
                  {item.mandi}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">{item.date}</span>
              </div>

              <h3 className="text-base font-bold text-[#193729] mt-2">{item.commodity}</h3>
              <p className="text-xs text-gray-500">{item.district}, {item.state}</p>

              <div className="mt-3 p-2.5 bg-[#F4F7F3] rounded-lg">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-500">{t.modalPrice}:</span>
                  <span className="text-lg font-extrabold text-[#145C38]">
                    ₹{item.modalPrice} <span className="text-xs font-normal text-gray-600">{item.unit}</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t.minMaxPrice}:</span>
                  <span className="font-medium text-gray-700">₹{item.minPrice} - ₹{item.maxPrice}</span>
                </div>
              </div>

              {/* Commission Agent / Trader Details */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 font-medium">{t.contactTrader}:</p>
                <p className="text-xs font-semibold text-gray-800 truncate">{item.trader}</p>
              </div>
            </div>

            {/* Direct Call & WhatsApp Buttons */}
            <div className="mt-4 pt-2 flex gap-2">
              <a
                href={`tel:${item.phone.replace(/\s+/g, '')}`}
                className="flex-1 bg-[#145C38] hover:bg-[#23764A] text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t.callNow}</span>
              </a>
              <a
                href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्ते, मुझे ${item.commodity} (${item.mandi}) के भाव के संदर्भ में बात करनी है।`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                title="WhatsApp पर बात करें"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
