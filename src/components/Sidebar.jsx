import React from 'react';
import { 
  Home, 
  MapPin, 
  CloudSun, 
  TrendingUp, 
  BookOpen, 
  ScanLine, 
  ShoppingBag, 
  Wallet, 
  Coins, 
  Bot, 
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, t, isMobileOpen, setIsMobileOpen, onOpenAI }) {
  const navItems = [
    { id: "dashboard", label: "डैशबोर्ड (Home)", icon: Home },
    { id: "scanner", label: "AI क्रॉप स्कैनर (Vision)", icon: ScanLine, isHot: true },
    { id: "advisory", label: "फसल सलाह (ICAR)", icon: BookOpen },
    { id: "income", label: "आय व मुनाफा (P&L)", icon: Coins },
    { id: "budget", label: "लागत व बजट (Budget)", icon: Wallet },
    { id: "mandi", label: "लाइव मंडी भाव (Mandi)", icon: TrendingUp },
    { id: "myFarms", label: "मेरे खेत (My Farms)", icon: MapPin },
    { id: "weather", label: "लाइव मौसम (Weather)", icon: CloudSun },
    { id: "shop", label: "कृषि बाज़ार (Marketplace)", icon: ShoppingBag },
    { id: "aiAssistant", label: "डाइमेंशन्स फार्म AI", icon: Bot, isSpecial: true },
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#145C38] text-white z-50 flex flex-col transition-transform duration-300 shadow-2xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#23764A] flex items-center justify-between bg-[#0E4227]/40">
          <div className="flex items-center gap-3">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Dimensions Farm" 
              className="w-11 h-11 rounded-full object-cover shadow-lg border-2 border-[#75B85B] bg-white"
            />
            <div>
              <h1 className="font-bold text-base leading-tight tracking-wide text-white">
                Dimensions Farm
              </h1>
              <p className="text-[11px] text-[#75B85B] font-medium leading-tight">
                Better Farming, Better Future
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "aiAssistant") {
                    onOpenAI();
                  } else {
                    setActiveTab(item.id);
                  }
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.isSpecial
                    ? 'bg-gradient-to-r from-emerald-600 to-[#75B85B] text-white shadow-md'
                    : isActive
                    ? 'bg-[#75B85B] text-white shadow-md font-bold'
                    : 'text-gray-200 hover:bg-[#23764A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.isHot && (
                  <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-extrabold uppercase">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-3 border-t border-[#23764A] bg-[#0E4227]/60 flex items-center gap-2 text-xs">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Logo Mini" 
            className="w-6 h-6 rounded-full border border-emerald-400 object-cover bg-white"
          />
          <div className="leading-tight">
            <p className="font-bold text-white">डाइमेंशन्स फार्म (v4.0)</p>
            <p className="text-[10px] text-emerald-300">स्मार्ट कृषि पोर्टल 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}
