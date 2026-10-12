import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, RefreshCw } from 'lucide-react';
import { askDimensionsAI } from '../services/aiService';

export default function DimensionsFarmAI({ isOpen, onClose, t }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "राम-राम किसान भाई! मैं डाइमेंशन्स फार्म एआई (Dimensions Farm AI) हूँ। आप अपनी फसल, खाद की मात्रा, कीट-रोग या मंडी भाव से जुड़ा कोई भी सवाल पूछ सकते हैं। मैं आपकी क्या मदद कर सकता हूँ?",
      time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: userText,
      time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askDimensionsAI(userText, messages);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: reply,
        time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "माफ़ करें, इस समय संपर्क स्थापित नहीं हो सका। कृपया पुनः प्रयास करें।",
          time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "गेहूं में पीला रतुआ का इलाज क्या है?",
    "1 एकड़ में DAP और यूरिया की कितनी मात्रा डालें?",
    "मौसम को देखकर कीटनाशक स्प्रे कब करें?",
    "प्याज के कंद का आकार कैसे बढ़ाएं?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-emerald-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#145C38] via-[#1E6B43] to-[#23764A] p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Dimensions Farm AI" 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#75B85B] shadow-sm bg-white"
            />
            <span className="w-3 h-3 bg-emerald-400 border-2 border-white rounded-full absolute bottom-0 right-0 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
              डाइमेंशन्स फार्म एआई
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <p className="text-[11px] text-emerald-200">डिजिटल कृषि सलाहकार • 24x7 सक्रिय</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          title="बंद करें"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-emerald-50/70 border-b border-emerald-100 p-2 overflow-x-auto whitespace-nowrap flex gap-1.5 text-[11px]">
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInput(q);
            }}
            className="bg-white hover:bg-emerald-100 text-[#145C38] border border-emerald-200 px-2.5 py-1 rounded-full transition-colors flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F7F3]/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && (
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="AI" 
                className="w-7 h-7 rounded-full object-cover border border-emerald-400 mt-1 flex-shrink-0"
              />
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-[#145C38] text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200/80 rounded-tl-none"
              }`}
            >
              {msg.text}
              <span
                className={`block text-[9px] mt-1 text-right ${
                  msg.sender === "user" ? "text-emerald-200" : "text-gray-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-center text-xs text-gray-500">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="AI" 
              className="w-7 h-7 rounded-full object-cover border border-emerald-400 animate-spin"
            />
            <div className="bg-white p-2.5 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#145C38] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#145C38] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#145C38] rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-[#145C38] font-medium ml-1">डाइमेंशन्स फार्म एआई विचार कर रहा है...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="फसल, बीमारी, खाद या मंडी का सवाल यहाँ लिखें..."
          className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#75B85B] text-gray-800"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-[#145C38] hover:bg-[#23764A] disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center flex-shrink-0"
          title="संदेश भेजें"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
