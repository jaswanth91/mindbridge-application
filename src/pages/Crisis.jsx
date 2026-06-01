import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MessageSquare, 
  Heart, 
  ShieldAlert, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  ExternalLink,
  Users,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Crisis = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      id: 1,
      name: t('National Helpline', 'தேசிய உதவி எண்'),
      number: '14416',
      desc: t('24/7 Free & Confidential Support', '24/7 இலவச மற்றும் ரகசிய ஆதரவு'),
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: t('Student Crisis Support', 'மாணவர் நெருக்கடி ஆதரவு'),
      number: '1800-599-0019',
      desc: t('Specialized for academic stress', 'கல்வி அழுத்தத்திற்காக நிபுணத்துவம் பெற்றது'),
      color: 'bg-mb-indigo'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: t('Start Safe Chat', 'பாதுகாப்பான அரட்டையைத் தொடங்கு'),
      desc: t('Talk to our AI companion instantly.', 'எங்கள் AI துணையுடன் உடனடியாகப் பேசுங்கள்.'),
      icon: <MessageSquare size={24} className="text-mb-sky" />,
      action: () => navigate('/chat'),
      color: 'mb-sky'
    },
    {
      id: 2,
      title: t('Book Session', 'அமர்வை முன்பதிவு செய்'),
      desc: t('Speak with a professional counsellor.', 'ஒரு தொழில்முறை ஆலோசகருடன் பேசுங்கள்.'),
      icon: <Calendar size={24} className="text-mb-lavender" />,
      action: () => navigate('/counsellors'),
      color: 'mb-lavender'
    },
    {
      id: 3,
      title: t('Peer Support', 'சக நண்பர்களின் ஆதரவு'),
      desc: t('Connect with the community.', 'சமூகத்துடன் இணையுங்கள்.'),
      icon: <Users size={24} className="text-mb-mint" />,
      action: () => navigate('/community'),
      color: 'mb-mint'
    }
  ];

  return (
    <div className="space-y-8 pb-12 pt-4">
      {/* Critical Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
          <ShieldAlert size={20} className="animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">{t('24/7 Immediate Support', '24/7 உடனடி ஆதரவு')}</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-dm-serif text-white">{t('Crisis Support', 'நெருக்கடி ஆதரவு')}</h1>
          <p className="text-white/40 text-sm max-w-lg">
            {t('You are not alone. Reach out to these verified resources if you need immediate assistance or just someone to talk to.', 'நீங்கள் தனியாக இல்லை. உங்களுக்கு உடனடி உதவி தேவைப்பட்டால் அல்லது யாராவது பேச விரும்பினால் இந்த சரிபார்க்கப்பட்ட ஆதாரங்களைத் தொடர்பு கொள்ளுங்கள்.')}
          </p>
        </div>
      </header>

      {/* Emergency Hotline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emergencyContacts.map((contact) => (
          <motion.div 
            key={contact.id}
            whileHover={{ y: -5 }}
            className="glass-card p-8 border-red-500/10 bg-gradient-to-br from-red-500/5 to-transparent relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Phone size={100} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{contact.name}</h3>
                <p className="text-sm text-white/40">{contact.desc}</p>
              </div>
              <a 
                href={`tel:${contact.number.replace(/-/g, '')}`}
                className="inline-flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_10px_25px_rgba(239,68,68,0.3)] active:scale-95"
              >
                <Phone size={24} />
                <span className="text-xl tracking-tight">{contact.number}</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white/80 px-2">{t('MindBridge Support', 'MindBridge ஆதரவு')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="glass-card p-6 border-white/5 bg-white/5 text-left flex flex-col gap-6 hover:border-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                {action.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white">{action.title}</h4>
                <p className="text-xs text-white/40 leading-relaxed">{action.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-mb-indigo uppercase tracking-widest mt-auto">
                {t('Continue', 'தொடர்க')} <ChevronRight size={14} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reassurance Message */}
      <div className="p-8 bg-mb-indigo/10 rounded-[2.5rem] border border-mb-indigo/20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-20 h-20 rounded-full bg-mb-indigo flex items-center justify-center text-white shrink-0 shadow-[0_10px_30px_rgba(91,109,246,0.4)]">
          <Heart size={40} />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white">{t('Take a deep breath.', 'ஆழ்ந்த மூச்சை விடுங்கள்.')}</h4>
          <p className="text-sm text-white/50 leading-relaxed">
            {t('Asking for help is a sign of strength. We are here to support you every step of the way. Your safety and well-being are our top priority.', 'உதவி கேட்பது பலத்தின் அறிகுறி. ஒவ்வொரு அடியிலும் உங்களுக்கு ஆதரவாக நாங்கள் இருக்கிறோம். உங்கள் பாதுகாப்பு மற்றும் நல்வாழ்வே எங்களது முன்னுரிமை.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Crisis;
