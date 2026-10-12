import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useLang } from '../../i18n/index.jsx';

// Accessible dialog: Esc and backdrop click close it, focus moves in and is restored,
// and the page behind does not scroll.
export default function Modal({ title, subtitle, onClose, children, footer, maxWidth = 'max-w-2xl' }) {
  const { t } = useLang();
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl outline-none animate-slide-up`}
      >
        <div className="bg-forest-900 text-white p-5 flex items-start justify-between gap-3 rounded-t-2xl sticky top-0 z-10">
          <div className="min-w-0">
            <h3 className="text-lg font-bold truncate">{title}</h3>
            {subtitle && <p className="text-xs text-emerald-200 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => closeRef.current()}
            aria-label={t('common.close')}
            className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
}
