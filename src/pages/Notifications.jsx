import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ChevronRight,
  Sparkles,
  Info,
  BellRing
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Notifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'resource',
      title: t('New Resource Added!', 'புதிய தகவல் சேர்க்கப்பட்டது!'),
      message: t('Check out the new "Deep Sleep Rain Sounds" in the wellness library.', 'நல நூலகத்தில் புதிய "ஆழ்ந்த தூக்க மழை ஒலிகள்" பகுதியைச் சரிபார்க்கவும்.'),
      time: '10m ago',
      isRead: false,
      icon: <BookOpen className="text-mb-sky" />
    },
    {
      id: 2,
      type: 'booking',
      title: t('Booking Confirmed', 'முன்பதிவு உறுதிப்படுத்தப்பட்டது'),
      message: t('Your session with Dr. Meera Sharma is confirmed for Today at 4:00 PM.', 'டாக்டர் மீரா சர்மாவுடனான உங்கள் அமர்வு இன்று மாலை 4:00 மணிக்கு உறுதிப்படுத்தப்பட்டுள்ளது.'),
      time: '2h ago',
      isRead: false,
      icon: <Calendar className="text-mb-lavender" />
    },
    {
      id: 3,
      type: 'task',
      title: t('Daily Task Reminder', 'தினசரி பணி நினைவூட்டல்'),
      message: t('Time for your 5-minute breathing exercise. Stay mindful!', 'உங்கள் 5 நிமிட சுவாசப் பயிற்சிக்கான நேரம். கவனத்துடன் இருங்கள்!'),
      time: '5h ago',
      isRead: true,
      icon: <Clock className="text-mb-mint" />
    },
    {
      id: 4,
      type: 'system',
      title: t('Weekly Progress Ready', 'வாராந்திர முன்னேற்றம் தயார்'),
      message: t('Your wellness summary for the last week is now available to view.', 'கடந்த வாரத்திற்கான உங்கள் நலச் சுருக்கம் இப்போது பார்க்கக் கிடைக்கிறது.'),
      time: '1d ago',
      isRead: true,
      icon: <Sparkles className="text-mb-gold" />
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 pb-12 pt-4 max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-dm-serif text-white flex items-center gap-3">
            {t('Notifications', 'அறிவிப்புகள்')}
            <div className="w-2 h-2 rounded-full bg-mb-indigo animate-ping" />
          </h1>
          <p className="text-white/40 text-sm">{t('Stay updated on your wellness journey.', 'உங்கள் நலப் பயணத்தைப் பற்றிய தகவல்களை உடனுக்குடன் தெரிந்து கொள்ளுங்கள்.')}</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-xs font-bold text-mb-indigo hover:text-mb-lavender transition-all"
        >
          {t('Mark all as read', 'அனைத்தையும் படித்ததாகக் குறி')}
        </button>
      </header>

      {/* Notification List */}
      <div className="space-y-4">
        <AnimatePresence>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass-card p-5 border-white/5 relative group transition-all duration-300 ${
                  !n.isRead ? 'bg-white/10 border-mb-indigo/20 shadow-lg shadow-mb-indigo/5' : 'bg-white/5 opacity-80'
                }`}
              >
                {!n.isRead && (
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-mb-indigo shadow-[0_0_10px_rgba(91,109,246,0.5)]" />
                )}
                
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                    {n.icon}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold transition-colors ${!n.isRead ? 'text-white' : 'text-white/60'}`}>{n.title}</h3>
                      <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{n.time}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed max-w-[90%]">{n.message}</p>
                    
                    <div className="pt-3 flex gap-4">
                      <button className="text-[10px] font-black text-mb-indigo uppercase tracking-widest hover:text-mb-lavender flex items-center gap-1 group/btn">
                        {t('View Detail', 'விவரத்தைப் பார்க்க')}
                        <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button 
                        onClick={() => deleteNotification(n.id)}
                        className="text-[10px] font-black text-white/20 uppercase tracking-widest hover:text-red-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} /> {t('Remove', 'நீக்கு')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 glass-card bg-white/5 border-dashed border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/10">
                <Bell size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="text-white/40 font-bold">{t('All Caught Up!', 'எல்லாம் புதுப்பிக்கப்பட்டது!')}</h3>
                <p className="text-white/20 text-xs">{t('No new notifications for now.', 'தற்போது புதிய அறிவிப்புகள் எதுவுமில்லை.')}</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Tips Section */}
      <div className="p-6 bg-mb-indigo/5 rounded-3xl border border-white/5 flex gap-5 items-start">
        <div className="w-12 h-12 rounded-2xl bg-mb-indigo/20 flex items-center justify-center text-mb-indigo shrink-0">
          <Info size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">{t('Customizing Alerts', 'அறிவிப்புகளைத் தனிப்பயனாக்குதல்')}</h4>
          <p className="text-xs text-white/40 leading-relaxed">
            {t('You can manage your notification preferences in the Settings page to control what alerts you receive.', 'நீங்கள் எந்த அறிவிப்புகளைப் பெற வேண்டும் என்பதைக் கட்டுப்படுத்த அமைப்புகள் பக்கத்தில் உங்கள் அறிவிப்பு விருப்பங்களை நிர்வகிக்கலாம்.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
