import React from 'react';
import { BookOpen, Bot, CloudSun, Coins, Home, MapPin, ScanLine, ShoppingBag, TrendingUp, Wallet, X } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import Logo from './ui/Logo.jsx';

const NAV = [
  { id: 'dashboard', icon: Home },
  { id: 'scanner', icon: ScanLine, badge: 'AI' },
  { id: 'advisory', icon: BookOpen },
  { id: 'income', icon: Coins },
  { id: 'budget', icon: Wallet },
  { id: 'mandi', icon: TrendingUp },
  { id: 'farms', icon: MapPin },
  { id: 'weather', icon: CloudSun },
  { id: 'shop', icon: ShoppingBag },
];

export default function Sidebar({ route, isOpen, onClose, onOpenAI }) {
  const { t } = useLang();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={onClose} aria-hidden="true" />}

      <aside
        id="site-nav"
        className={`fixed top-0 left-0 h-full w-64 bg-forest-900 text-white z-50 flex flex-col transition-transform duration-300 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full invisible lg:visible lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-forest-700 flex items-center justify-between bg-forest-950/40">
          <div className="flex items-center gap-3 min-w-0">
            <Logo alt="Dimensions Farm" className="w-11 h-11 shadow-lg border-2 border-forest-500 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-base leading-tight tracking-wide">Dimensions Farm</p>
              <p className="text-[11px] text-forest-500 font-medium leading-tight">{t('brand.tagline')}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="lg:hidden p-1 rounded-lg text-gray-300 hover:text-white">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label={t('nav.label')} className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {NAV.map(({ id, icon: Icon, badge }) => {
            const active = route === id;
            return (
              <a
                key={id}
                href={`#/${id}`}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  active ? 'bg-forest-500 text-white shadow-md font-bold' : 'text-gray-200 hover:bg-forest-700 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {t(`nav.${id}`)}
                </span>
                {badge && <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-extrabold">{badge}</span>}
              </a>
            );
          })}

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAI();
            }}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-forest-500 text-white shadow-md"
          >
            <Bot className="w-4 h-4 shrink-0" aria-hidden="true" />
            {t('nav.ai')}
          </button>
        </nav>

        <div className="p-3 border-t border-forest-700 bg-forest-950/60 text-[11px] leading-tight">
          <p className="font-bold text-white">{t('brand.footer')}</p>
          <p className="text-emerald-300">{t('brand.footerSub')}</p>
        </div>
      </aside>
    </>
  );
}
