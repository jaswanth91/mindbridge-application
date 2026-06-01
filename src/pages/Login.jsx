import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import { ArrowLeft, Mail, Lock, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError(t('Please fill all fields', 'அனைத்து விவரங்களையும் நிரப்பவும்'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      navigate('/welcome');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grad-onboard p-8 flex flex-col items-center overflow-hidden">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-16 max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
          <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-mb-indigo text-white shadow-lg' : 'text-white/40'}`}>EN</button>
          <button onClick={() => setLanguage('ta')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'ta' ? 'bg-mb-indigo text-white shadow-lg' : 'text-white/40'}`}>தமிழ்</button>
        </div>
        
        <div className="w-10 text-[10px] text-white/40 font-bold uppercase tracking-widest text-right">100%</div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg mb-6 w-full max-w-sm">
          {error}
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-12 text-center"
      >
        <div className="space-y-4">
          <div className="text-4xl animate-bounce">👋</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {t('Welcome back', 'மீண்டும் வருக')}
          </h1>
          <p className="text-white/40 text-sm">
            {t('Sign in to your safe space', 'உங்கள் பாதுகாப்பான இடத்திற்கு உள்நுழைக')}
          </p>
        </div>

        <div className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 ml-1">{t('College Email', 'கல்லூரி மின்னஞ்சல்')}</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@college.edu" 
              className="input-field bg-white/5 border-white/10 text-white placeholder:text-white/20 py-4 focus:bg-white/10" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 ml-1">{t('Password', 'கடவுச்சொல்')}</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="........" 
              className="input-field bg-white/5 border-white/10 text-white placeholder:text-white/20 py-4 focus:bg-white/10" 
            />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button 
            disabled={loading}
            onClick={handleLogin}
            className="btn-primary w-full py-4 text-base font-bold shadow-[0_10px_30px_rgba(91,109,246,0.3)] transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('Sign In', 'உள்நுழைக')}
          </button>
          
          <button 
            onClick={() => navigate('/signup')}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium hover:bg-white/10 transition-all active:scale-95"
          >
            {t('New here? Create Account', 'புதியவரா? கணக்கை உருவாக்குங்கள்')}
          </button>

          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95">
            {t('Continue with Google', 'கூகுள் மூலம் தொடரவும்')} <span className="text-lg">🎓</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] text-mb-mint/60 font-bold uppercase tracking-widest pt-8">
          <div className="w-1.5 h-1.5 rounded-full bg-mb-mint shadow-[0_0_8px_rgba(110,231,183,0.6)]"></div>
          {t('Anonymous mode available', 'அநாமதேய பயன்முறை உள்ளது')}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
