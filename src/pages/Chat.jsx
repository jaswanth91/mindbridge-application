import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Trash2, 
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Chat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t(
        "Hi! I'm Aria, your mental health companion powered by OpenRouter. How are you feeling today?", 
        "வணக்கம்! நான் ஆரியா, உங்கள் மனநலத் துணை. இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?"
      ),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("OPENROUTER_API_KEY_MISSING");

      // Prepare history for OpenRouter (OpenAI format)
      const apiMessages = [
        {
          role: "system",
          content: `You are Aria, a compassionate mental health companion for students. 
          Respond in ${language === 'en' ? 'English' : 'Tamil'}. Keep it short and supportive.`
        },
        ...messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: "user", content: currentInput }
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "MindBridge AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free", // Use the FREE tier model
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      let data = await response.json();
      
      // FALLBACK: If Gemini Free fails, try Llama Free
      if (!response.ok && data.error?.message?.includes("No endpoints")) {
        const fallbackRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "MindBridge AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct:free",
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 500
          })
        });
        data = await fallbackRes.json();
        if (!fallbackRes.ok) throw new Error(data.error?.message || "All models failed");
      } else if (!response.ok) {
        throw new Error(data.error?.message || `HTTP Error ${response.status}`);
      }

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("OpenRouter Error:", error);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[10px]">
              <AlertTriangle size={14} /> OpenRouter Connection Failed
            </div>
            <div className="text-[10px] bg-black/20 p-2 rounded border border-white/5 font-mono break-all opacity-60">
              {error.message}
            </div>
          </div>
        ),
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      text: t("History cleared. How can I help you now?", "வரலாறு அழிக்கப்பட்டது. இப்போது நான் உங்களுக்கு எப்படி உதவ முடியும்?"),
      timestamp: new Date()
    }]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto">
      {/* Chat Header */}
      <header className="flex justify-between items-center p-4 glass-card border-white/10 rounded-2xl mb-4 bg-mb-indigo/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-mb-indigo flex items-center justify-center shadow-lg relative overflow-hidden">
            <Bot className="text-white relative z-10" size={28} />
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-tr from-mb-sky/40 to-transparent"
            />
          </div>
          <div>
            <h2 className="font-bold text-white flex items-center gap-2">
              Aria <Zap size={14} className="text-mb-sky animate-pulse" />
            </h2>
            <p className="text-[10px] font-black text-mb-mint uppercase tracking-widest">{t('Powered by OpenRouter', 'OpenRouter மூலம் இயக்கப்படுகிறது')}</p>
          </div>
        </div>
        <button onClick={clearChat} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-red-400 transition-all">
          <Trash2 size={18} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 scrollbar-hide py-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${msg.type === 'user' ? 'bg-mb-lavender' : (msg.isError ? 'bg-red-500' : 'bg-mb-indigo')} text-white shadow-md`}>
                  {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.type === 'user' ? 'bg-mb-indigo text-white rounded-tr-none shadow-lg' : 'glass-card bg-white/5 text-white/80 rounded-tl-none border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-mb-indigo flex items-center justify-center text-white"><Bot size={16} /></div>
              <div className="glass-card bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-mb-indigo rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-mb-indigo rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-mb-indigo rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/5 rounded-t-3xl backdrop-blur-xl">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Tell Aria what's on your mind...", "ஆரியாவிடம் உங்கள் மனதில் உள்ளதைச் சொல்லுங்கள்...")}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-mb-indigo/50 transition-all"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="w-14 h-14 rounded-2xl bg-mb-indigo text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50">
            {isTyping ? <RefreshCw className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
