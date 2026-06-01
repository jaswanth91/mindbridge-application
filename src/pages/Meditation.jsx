import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Wind,
  Timer,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Meditation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [activeTechnique, setActiveTechnique] = useState('4-7-8');
  const [sessionTime, setSessionTime] = useState(5); // in minutes
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionTime * 60);
  const [breathPhase, setBreathPhase] = useState('Breathe In'); // 'Breathe In', 'Hold', 'Breathe Out'
  const [phaseTime, setPhaseTime] = useState(4);
  
  const timerRef = useRef(null);
  const phaseRef = useRef(null);

  const techniques = {
    '4-7-8': { 
      name: t('4-7-8 Breath', '4-7-8 சுவாசம்'), 
      in: 4, hold: 7, out: 8,
      description: t('Calms the nervous system quickly.', 'நரம்பு மண்டலத்தை விரைவாக அமைதிப்படுத்துகிறது.')
    },
    'Box': { 
      name: t('Box Breath', 'பாக்ஸ் சுவாசம்'), 
      in: 4, hold: 4, out: 4, hold2: 4,
      description: t('Improves focus and stress management.', 'கவனம் மற்றும் மன அழுத்த மேலாண்மையை மேம்படுத்துகிறது.')
    },
    'Body Scan': { 
      name: t('Body Scan', 'உடல் ஸ்கேன்'), 
      in: 6, hold: 0, out: 6,
      description: t('Releases physical tension through awareness.', 'விழிப்புணர்வு மூலம் உடல் பதற்றத்தை நீக்குகிறது.')
    }
  };

  // Main Session Timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  // Breathing Phase Logic
  useEffect(() => {
    if (isActive) {
      phaseRef.current = setInterval(() => {
        setPhaseTime(prev => {
          if (prev <= 1) {
            // Switch Phase
            const tech = techniques[activeTechnique === '4-7-8' ? '4-7-8' : activeTechnique === 'Box Breath' ? 'Box' : 'Body Scan'];
            
            if (breathPhase === 'Breathe In') {
              if (activeTechnique === 'Body Scan') {
                setBreathPhase('Breathe Out');
                return 6;
              }
              setBreathPhase('Hold');
              return activeTechnique === '4-7-8' ? 7 : 4;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Breathe Out');
              return activeTechnique === '4-7-8' ? 8 : 4;
            } else if (breathPhase === 'Breathe Out') {
              if (activeTechnique === 'Box') {
                setBreathPhase('Hold'); // Box breath has a second hold
                return 4;
              }
              setBreathPhase('Breathe In');
              return activeTechnique === '4-7-8' ? 4 : 6;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(phaseRef.current);
    }
    return () => clearInterval(phaseRef.current);
  }, [isActive, breathPhase, activeTechnique]);

  const toggleSession = () => setIsActive(!isActive);
  
  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(sessionTime * 60);
    setBreathPhase('Breathe In');
    setPhaseTime(4);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-dm-serif text-white">{t('Breathing Space', 'சுவாச இடைவெளி')}</h1>
      </header>

      {/* Technique Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {Object.entries(techniques).map(([key, tech]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTechnique(key);
              resetSession();
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
              activeTechnique === key 
              ? 'bg-mb-indigo border-mb-indigo text-white shadow-[0_0_20px_rgba(91,109,246,0.3)]' 
              : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {tech.name}
          </button>
        ))}
      </div>

      {/* Breathing HUD */}
      <div className="flex flex-col items-center justify-center py-10 relative">
        {/* Animated Circles */}
        <div className="relative flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: breathPhase === 'Breathe In' ? 1.5 : breathPhase === 'Breathe Out' ? 1 : 1.5,
              opacity: breathPhase === 'Hold' ? 0.8 : 1
            }}
            transition={{ 
              duration: breathPhase === 'Breathe In' ? 4 : breathPhase === 'Breathe Out' ? 8 : 1,
              ease: "easeInOut"
            }}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-mb-indigo to-mb-violet shadow-[0_0_60px_rgba(91,109,246,0.3)] flex flex-col items-center justify-center text-center p-6 z-10"
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1"
              >
                <div className="text-sm font-bold text-white/80 uppercase tracking-widest">
                  {t(breathPhase, breathPhase)}
                </div>
                <div className="text-4xl font-bold text-white">{phaseTime}</div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Background Ring */}
          <div className="absolute w-72 h-72 rounded-full border border-white/5"></div>
          <div className="absolute w-96 h-96 rounded-full border border-white/5 opacity-50"></div>
        </div>

        {/* Timer Display */}
        <div className="mt-16 text-center space-y-1">
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">{t('Session Time', 'அமர்வு நேரம்')}</p>
          <h2 className="text-5xl font-dm-sans font-bold text-white tracking-tighter">{formatTime(timeLeft)}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 max-w-sm mx-auto">
        <button 
          onClick={toggleSession}
          className="btn-primary flex-1 py-4 text-base font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
        >
          {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isActive ? t('Pause', 'நிறுத்து') : t('Start', 'தொடங்கு')}
        </button>
        <button 
          onClick={resetSession}
          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:rotate-180 duration-500"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Time Options */}
      <div className="flex justify-center gap-2 max-w-sm mx-auto">
        {[3, 5, 10, 15].map(time => (
          <button 
            key={time}
            onClick={() => {
              setSessionTime(time);
              setTimeLeft(time * 60);
            }}
            className={`flex-1 py-3 rounded-xl border text-[10px] font-bold transition-all ${
              sessionTime === time 
              ? 'bg-mb-indigo/20 border-mb-indigo text-mb-lavender shadow-lg' 
              : 'bg-white/5 border-white/5 text-white/30 hover:bg-white/10'
            }`}
          >
            {time} min
          </button>
        ))}
      </div>

      {/* Info Card */}
      <div className="glass-card p-5 border-white/5 flex gap-4 items-start bg-gradient-to-br from-mb-indigo/5 to-transparent">
        <div className="p-2 bg-mb-indigo/20 rounded-lg text-mb-indigo">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm">{techniques[activeTechnique === '4-7-8' ? '4-7-8' : activeTechnique === 'Box Breath' ? 'Box' : 'Body Scan']?.name}</h4>
          <p className="text-xs text-white/40 leading-relaxed">
            {techniques[activeTechnique === '4-7-8' ? '4-7-8' : activeTechnique === 'Box Breath' ? 'Box' : 'Body Scan']?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Meditation;
