import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const Welcome = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const quotes = [
    { en: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.", ta: "உங்கள் மனநலம் ஒரு முன்னுரிமை. உங்கள் மகிழ்ச்சி ஒரு அத்தியாவசியம். உங்கள் சுய பாதுகாப்பு ஒரு தேவை." },
    { en: "You don't have to see the whole staircase, just take the first step.", ta: "நீங்கள் முழு படிக்கட்டுகளையும் பார்க்க வேண்டியதில்லை, முதல் அடியை மட்டும் எடுத்து வைக்கவும்." },
    { en: "This too shall pass. You are stronger than you think.", ta: "இதுவும் கடந்து போகும். நீங்கள் நினைப்பதை விட நீங்கள் வலிமையானவர்." },
    { en: "Peace comes from within. Do not seek it without.", ta: "அமைதி நமக்குள் இருந்து வருகிறது. அதை வெளியில் தேடாதீர்கள்." }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setName(data?.full_name?.split(' ')[0] || 'User');
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-mb-dark-bg flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-20 w-80 h-80 bg-mb-indigo/20 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 -right-20 w-80 h-80 bg-mb-violet/20 rounded-full blur-[100px]" 
      />

      <div className="max-w-2xl w-full text-center space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="w-20 h-20 bg-mb-indigo/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Sparkles className="text-mb-lavender" size={40} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-dm-serif text-white mb-4">
            {t('Welcome Home', 'வீட்டிற்கு வரவேற்கிறோம்')}, {name}
          </h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">{t('A Moment of Peace', 'ஒரு அமைதியான தருணம்')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="glass-card p-10 bg-white/5 border-white/5 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-mb-indigo rounded-full text-[10px] font-black uppercase tracking-widest text-white">
            {t('Daily Inspiration', 'தினசரி உத்வேகம்')}
          </div>
          <p className="text-xl md:text-2xl font-dm-serif text-white/90 leading-relaxed italic">
            "{t(randomQuote.en, randomQuote.ta)}"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 mx-auto shadow-2xl group active:scale-95 transition-all"
          >
            {t('Enter MindBridge', 'மைண்ட்பிரிட்ஜிற்குள் நுழையுங்கள்')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
