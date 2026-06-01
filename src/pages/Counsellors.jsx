import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Star, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  X,
  Phone,
  User,
  Globe,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Counsellors = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    language: ''
  });

  const counsellors = [
    {
      id: 1,
      name: 'Dr. Meera Sharma',
      specialty: t('Anxiety • Depression • 8 yrs', 'பதட்டம் • மனச்சோர்வு • 8 ஆண்டுகள்'),
      rating: 4.9,
      available: true,
      slots: ['Today 4PM', 'Today 6PM', 'Tmrw 10AM'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera'
    },
    {
      id: 2,
      name: 'Prof. Rajesh Kumar',
      specialty: t('Academic Stress • ADHD • 12 yrs', 'கல்வி அழுத்தம் • ADHD • 12 ஆண்டுகள்'),
      rating: 4.8,
      available: true,
      slots: ['Today 5PM', 'Tmrw 11AM', 'Tmrw 2PM'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      specialty: t('Relationships • Trauma • 5 yrs', 'உறவுகள் • அதிர்ச்சி • 5 ஆண்டுகள்'),
      rating: 4.7,
      available: false,
      slots: ['Next Monday', 'Next Tuesday'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    }
  ];

  const handleBookClick = (counsellor) => {
    if (!selectedTime) {
      alert(t('Please select a time slot first!', 'முதலில் நேரத்தைத் தேர்ந்தெடுக்கவும்!'));
      return;
    }
    setSelectedCounsellor(counsellor);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsBookingModalOpen(false);
      setSelectedTime(null);
      setFormData({ name: '', age: '', phone: '', language: '' });
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-12 pt-4">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-dm-serif text-white">{t('Find a Counsellor', 'ஆலோசகரைக் கண்டறியவும்')}</h1>
        <p className="text-white/40 text-sm">{t('Connect with verified professionals who understand your journey.', 'உங்கள் பயணத்தைப் புரிந்துகொள்ளும் சரிபார்க்கப்பட்ட நிபுணர்களுடன் இணையுங்கள்.')}</p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder={t('Search by name or specialty...', 'பெயர் அல்லது சிறப்புத் துறையின் அடிப்படையில் தேடுங்கள்...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12 bg-white/5 border-white/10 focus:bg-white/10"
        />
      </div>

      {/* Counsellor List */}
      <div className="space-y-6">
        {counsellors.map((c) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-white/5 hover:border-white/10 transition-all bg-gradient-to-br from-white/5 to-transparent"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  {c.available && <div className="absolute -top-1 -right-1 w-4 h-4 bg-mb-mint rounded-full border-4 border-mb-dark-bg animate-pulse" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-xs text-white/40">{c.specialty}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] font-black text-mb-mint uppercase tracking-widest">{c.available ? t('Available', 'கிடைக்கக்கூடியது') : t('Busy', 'வேலையில்')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-mb-gold font-bold bg-mb-gold/10 px-3 py-1 rounded-full text-xs border border-mb-gold/20">
                <Star size={12} fill="currentColor" />
                {c.rating}
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {c.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-3 rounded-xl text-[10px] font-bold transition-all border ${
                    selectedTime === slot
                    ? 'bg-mb-indigo border-mb-indigo text-white shadow-lg shadow-mb-indigo/20'
                    : 'bg-white/5 border-white/5 text-white/40 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleBookClick(c)}
              className="btn-primary w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-xl"
            >
              {t('Book Anonymous', 'அநாமதேயமாக முன்பதிவு செய்யுங்கள்')}
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-white/20 font-bold bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck size={14} className="text-mb-mint" />
              {t('Your identity is never shared unless you choose to reveal it.', 'நீங்கள் வெளிப்படுத்தத் தேர்வுசெய்தால் ஒழிய உங்கள் அடையாளம் பகிரப்படாது.')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSuccess && setIsBookingModalOpen(false)} className="absolute inset-0 bg-mb-dark-bg/95 backdrop-blur-xl" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-lg p-8 border-white/10 shadow-2xl relative z-10 bg-gradient-to-b from-white/5 to-transparent"
            >
              {isSuccess ? (
                <div className="py-10 text-center space-y-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="w-24 h-24 rounded-full bg-mb-mint/10 border border-mb-mint/20 flex items-center justify-center mx-auto text-mb-mint shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-dm-serif text-white">{t('Booking Confirmed!', 'முன்பதிவு உறுதிப்படுத்தப்பட்டது!')}</h2>
                    <p className="text-white/40">{t('A session link has been sent to your email.', 'அமர்வு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுள்ளது.')}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-dm-serif text-white">{t('Finalize Booking', 'முன்பதிவை முடிக்கவும்')}</h2>
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <Calendar size={12} /> {selectedTime} {t('with', 'உடன்')} {selectedCounsellor?.name}
                      </p>
                    </div>
                    <button onClick={() => setIsBookingModalOpen(false)} className="text-white/20 hover:text-white"><X size={24} /></button>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">{t('Alias Name', 'புனைபெயர்')}</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                          <input 
                            required
                            type="text" 
                            className="input-field pl-12 bg-white/5 border-white/10"
                            placeholder="e.g. Brave Soul"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">{t('Age', 'வயது')}</label>
                        <input 
                          required
                          type="number" 
                          className="input-field bg-white/5 border-white/10"
                          placeholder="e.g. 21"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">{t('Phone Number', 'தொலைபேசி எண்')}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          required
                          type="tel" 
                          className="input-field pl-12 bg-white/5 border-white/10"
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">{t('Preferred Language', 'விருப்பமான மொழி')}</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <select 
                          required
                          className="input-field pl-12 bg-white/5 border-white/10 appearance-none text-white"
                          value={formData.language}
                          onChange={(e) => setFormData({...formData, language: e.target.value})}
                        >
                          <option value="" className="bg-mb-dark-bg">Select Language</option>
                          <option value="English" className="bg-mb-dark-bg">English</option>
                          <option value="Tamil" className="bg-mb-dark-bg">தமிழ் (Tamil)</option>
                          <option value="Hindi" className="bg-mb-dark-bg">Hindi</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="btn-primary w-full py-5 rounded-2xl font-bold shadow-xl shadow-mb-indigo/20 mt-4 active:scale-95 transition-all"
                    >
                      {t('Confirm Booking', 'முன்பதிவை உறுதிப்படுத்தவும்')}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Counsellors;
