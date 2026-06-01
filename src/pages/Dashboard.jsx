import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smile, 
  Activity, 
  ChevronRight, 
  Zap,
  BrainCircuit,
  Loader2,
  Star,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    fetchProfile();

    const profileSubscription = supabase
      .channel('dashboard_profile_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, payload => {
        // Only update if the change is for the current user
        setProfile(prev => {
          if (prev && prev.id === payload.new.id) {
            return { ...prev, ...payload.new };
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const wellnessMetrics = [
    { label: t('Wellness Score', 'நலன் மதிப்பெண்'), value: profile?.wellness_score ?? '...', icon: <Activity className="text-mb-indigo" />, color: 'mb-indigo' },
    { label: t('Daily Streak', 'தினசரி தொடர்ச்சி'), value: profile?.streak ?? '...', icon: <Zap className="text-yellow-400" />, color: 'yellow-400' },
  ];

  console.log("Current Profile Data:", profile);

  if (loading && !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-mb-dark-bg">
        <Loader2 className="animate-spin text-mb-indigo" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 pt-4">
      {/* Header / Greeting */}
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-dm-serif text-white"
          >
            {t('Hello', 'வணக்கம்')}, {profile?.full_name?.split(' ')[0] || 'Guest'}!
          </motion.h1>
          <p className="text-white/40 text-sm">{t("How are you feeling today?", "இன்று நீங்கள் எப்படி உணருகிறீர்கள்?")}</p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-mb-dark-bg bg-mb-violet/20 flex items-center justify-center text-xs overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="avatar" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-mb-dark-bg bg-mb-indigo/20 flex items-center justify-center text-[10px] font-bold text-mb-lavender">+12</div>
        </div>
      </header>

      {/* Wellness Metrics */}
      <section className="grid grid-cols-2 gap-4">
        {wellnessMetrics.map((metric, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5 space-y-4 border-white/5 shadow-xl"
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-white/5 rounded-xl">{metric.icon}</div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{t('Realtime', 'நேரலை')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">{metric.value}</div>
              <div className="text-[10px] text-white/40 font-medium uppercase tracking-[0.1em]">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Quick Insights (With Navigation) */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">{t('Quick Insights', 'விரைவான நுண்ணறிவு')}</h3>
        <div className="grid gap-4">
          <motion.div 
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/chat')}
            className="glass-card p-5 flex items-center gap-5 cursor-pointer relative overflow-hidden group border-white/5"
          >
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-mb-indigo/10 to-transparent"></div>
            <div className="w-14 h-14 rounded-2xl bg-mb-indigo/20 flex items-center justify-center text-2xl shadow-inner group-hover:bg-mb-indigo/30 transition-all border border-mb-indigo/10">
              <BrainCircuit className="text-mb-indigo" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">{t('Aria AI Assistant', 'ஆரியா AI உதவியாளர்')}</h4>
              <p className="text-[11px] text-white/40 leading-relaxed">{t('Analyze your mood patterns with Aria', 'ஆரியாவுடன் உங்கள் மனநிலை முறைகளை ஆராயுங்கள்')}</p>
            </div>
            <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/assess')}
            className="glass-card p-5 flex items-center gap-5 cursor-pointer group border-white/5"
          >
            <div className="w-14 h-14 rounded-2xl bg-mb-violet/20 flex items-center justify-center text-2xl shadow-inner group-hover:bg-mb-violet/30 transition-all border border-mb-violet/10">
              <Activity className="text-mb-violet" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white mb-1">{t('Mental Health Check', 'மனநல சோதனை')}</h4>
              <p className="text-[11px] text-white/40 leading-relaxed">{t('Take your weekly PHQ-9 screening', 'உங்கள் வாராந்திர PHQ-9 பரிசோதனையை மேற்கொள்ளுங்கள்')}</p>
            </div>
            <ChevronRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
          </motion.div>
        </div>
      </section>

      {/* Mood Selector (With Selection Logic) */}
      <section className="glass-card p-6 bg-gradient-to-br from-white/10 to-transparent border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-white">{t('How is your mood?', 'உங்கள் மனநிலை எப்படி இருக்கிறது?')}</h3>
          <span className="text-[10px] bg-mb-indigo/20 px-2 py-1 rounded text-mb-lavender font-bold uppercase tracking-widest">{t('Weekly', 'வாராந்திரம்')}</span>
        </div>
        <div className="flex justify-between">
          {[
            { e: '😔', l: t('Sad', 'வருத்தம்'), id: 'sad' },
            { e: '😐', l: t('Neutral', 'சாதாரண'), id: 'neutral' },
            { e: '😊', l: t('Good', 'நல்லது'), id: 'good' },
            { e: '🤩', l: t('Great', 'அற்புதம்'), id: 'great' }
          ].map((mood, idx) => (
            <motion.button 
              key={idx}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedMood(mood.id)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 border shadow-lg ${
                selectedMood === mood.id 
                ? 'bg-mb-indigo border-mb-indigo shadow-[0_0_20px_rgba(91,109,246,0.4)] scale-110' 
                : 'bg-white/5 border-white/5 group-hover:bg-white/10 group-hover:border-white/20'
              }`}>
                {mood.e}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
                selectedMood === mood.id ? 'text-mb-lavender' : 'text-white/30'
              }`}>{mood.l}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Counsellor Support Section (New) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{t('Counsellor Support', 'ஆலோசகர் ஆதரவு')}</h3>
          <button className="text-[10px] font-bold text-mb-lavender hover:underline">{t('View All', 'அனைத்தையும் பார்')}</button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 border-white/10 shadow-2xl bg-gradient-to-br from-mb-indigo/5 to-transparent relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span className="text-xs font-bold">4.9</span>
            </div>
          </div>

          <div className="flex gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-mb-violet/20 flex items-center justify-center text-3xl shadow-inner border border-mb-violet/10">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" alt="counsellor" className="w-12 h-12" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Dr. Meera Sharma</h4>
              <p className="text-xs text-white/40 mb-1">{t('Anxiety • Depression • 8 yrs', 'பதட்டம் • மனச்சோர்வு • 8 ஆண்டுகள்')}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mb-mint animate-pulse"></div>
                <span className="text-[10px] text-mb-mint font-bold uppercase tracking-widest">{t('Available', 'கிடைக்கக்கூடியது')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {['Today 4PM', 'Today 6PM', 'Tmrw 10AM'].map((slot, idx) => (
              <button key={idx} className="py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white/60 hover:bg-mb-indigo/20 hover:border-mb-indigo/30 transition-all">
                {slot}
              </button>
            ))}
          </div>

          <button className="btn-primary w-full py-4 text-sm font-bold shadow-lg flex items-center justify-center gap-2 group active:scale-95 transition-all">
            {t('Book Anonymous', 'அநாமதேய முன்பதிவு')}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
            <ShieldCheck size={16} className="text-mb-mint" />
            <p className="text-[10px] text-white/40 leading-tight">
              {t('Your identity is never shared with counsellors unless you choose to reveal it.', 'நீங்கள் வெளிப்படுத்தத் தேர்வுசெய்யும் வரை உங்கள் அடையாளம் ஆலோசகர்களுடன் பகிரப்படாது.')}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;
