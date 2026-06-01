import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Onboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grad-onboard flex flex-col items-center justify-between p-8 text-center overflow-hidden">
      <div className="mt-20 space-y-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40 mx-auto"
        >
          {/* Animated Rings */}
          <div className="absolute inset-0 border-2 border-mb-indigo/30 rounded-full animate-breathe"></div>
          <div className="absolute inset-4 border-2 border-mb-violet/30 rounded-full animate-breathe" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🧠</div>
        </motion.div>
        
        <h1 className="t-hero text-4xl">MindBridge</h1>
        <p className="t-body text-mb-lavender text-lg max-w-xs mx-auto">
          {t('Your anonymous bridge to mental wellness.', 'மன நலத்திற்கான உங்கள் அநாமதேய பாலம்.')}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-4 mb-12">
        <button 
          onClick={() => navigate('/signup')}
          className="btn-primary w-full py-4 text-lg"
        >
          {t('Get Started', 'தொடங்குங்கள்')}
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="w-full py-4 text-white/60 hover:text-white transition-colors text-sm font-medium"
        >
          {t('Already have an account? Sign In', 'ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக')}
        </button>
      </div>
    </div>
  );
};

export default Onboard;
