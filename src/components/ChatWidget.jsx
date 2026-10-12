import React, { useEffect, useRef, useState } from 'react';
import { Bot, RotateCcw, Send, Sparkles, WifiOff, X } from 'lucide-react';
import { useLang } from '../i18n/index.jsx';
import { askChat } from '../services/aiService.js';
import Logo from './ui/Logo.jsx';

const MAX_HISTORY = 10;

function timeLabel(lang) {
  return new Date().toLocaleTimeString(lang === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWidget({ isOpen, onClose }) {
  const { t, lang } = useLang();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [messages, loading, isOpen]);

  const send = async (text) => {
    const message = text.trim().slice(0, 500);
    if (!message || loading) return;
    const history = messages.slice(-MAX_HISTORY).map((m) => ({ sender: m.sender, text: m.text }));
    setMessages((list) => [...list, { id: `u-${Date.now()}`, sender: 'user', text: message, time: timeLabel(lang) }]);
    setInput('');
    setLoading(true);
    const reply = await askChat({ message, history, lang });
    setMessages((list) => [
      ...list,
      { id: `a-${Date.now()}`, sender: 'ai', text: reply.text, source: reply.source, time: timeLabel(lang) },
    ]);
    setLoading(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  if (!isOpen) return null;

  const samples = [t('chat.q1'), t('chat.q2'), t('chat.q3'), t('chat.q4')];

  return (
    <div
      role="dialog"
      aria-label={t('chat.title')}
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-emerald-200 flex flex-col overflow-hidden animate-slide-up"
    >
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <Logo alt="" className="w-10 h-10 border-2 border-forest-500 shrink-0" />
          <div className="min-w-0">
            <h2 className="font-bold text-sm flex items-center gap-1.5 truncate">
              {t('chat.title')}
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
            </h2>
            <p className="text-[11px] text-emerald-200 truncate">{t('chat.tagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {messages.length > 0 && (
            <button type="button" onClick={() => setMessages([])} aria-label={t('chat.clear')} title={t('chat.clear')} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={onClose} aria-label={t('common.close')} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="bg-emerald-50/70 border-b border-emerald-100 p-2 overflow-x-auto flex gap-1.5 text-[11px]">
        {samples.map((q) => (
          <button key={q} type="button" onClick={() => send(q)} disabled={loading} className="bg-white hover:bg-emerald-100 text-forest-900 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 disabled:opacity-60">
            {q}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-forest-50/60" aria-live="polite">
        <div className="flex gap-2.5">
          <Logo alt="" className="w-7 h-7 border border-emerald-400 mt-1 shrink-0" />
          <div className="max-w-[80%] rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed shadow-sm bg-white text-gray-800 border border-gray-200/80">
            {t('chat.greeting')}
          </div>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && <Logo alt="" className="w-7 h-7 border border-emerald-400 mt-1 shrink-0" />}
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm whitespace-pre-line break-words ${
                m.sender === 'user' ? 'bg-forest-900 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-none'
              }`}
            >
              {m.text}
              <span className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${m.sender === 'user' ? 'text-emerald-200' : 'text-gray-400'}`}>
                {m.source === 'offline' && (
                  <span className="inline-flex items-center gap-0.5 mr-auto" title={t('chat.offlineHint')}>
                    <WifiOff className="w-3 h-3" aria-hidden="true" />
                    {t('chat.offlineBadge')}
                  </span>
                )}
                {m.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-gray-500" role="status">
            <Bot className="w-7 h-7 text-forest-900 p-1 bg-white rounded-full border border-emerald-300" aria-hidden="true" />
            <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-forest-900 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-forest-900 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-forest-900 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-forest-900 font-medium ml-1">{t('chat.thinking')}</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={onSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          maxLength={500}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          aria-label={t('chat.placeholder')}
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-forest-500 text-gray-800"
        />
        <button type="submit" disabled={!input.trim() || loading} aria-label={t('chat.send')} className="bg-forest-900 hover:bg-forest-700 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center shrink-0">
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
