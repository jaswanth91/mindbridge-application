import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, 
  Volume2, 
  Search, 
  ChevronRight, 
  Heart, 
  X, 
  FileText, 
  Gamepad2,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Music,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Resources = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Game State
  const [bubbles, setBubbles] = useState([]);
  const [popCount, setPopCount] = useState(0);
  
  const audioRef = useRef(null);

  const library = [
    {
      id: 1,
      type: 'Video',
      title: t('Guided Meditation for Anxiety', 'பதட்டத்திற்கான வழிகாட்டப்பட்ட தியானம்'),
      description: t('A powerful 10-minute session to calm your mind and find peace.', 'உங்கள் மனதை அமைதிப்படுத்தவும் அமைதியைக் காணவும் உதவும் 10 நிமிட அமர்வு.'),
      duration: '10:00',
      icon: <PlayCircle />,
      link: 'https://www.youtube.com/embed/FpiWSFcL3-c',
      thumbnail: 'https://img.youtube.com/vi/FpiWSFcL3-c/maxresdefault.jpg'
    },
    {
      id: 2,
      type: 'Video',
      title: t('Managing Academic Stress', 'கல்வி அழுத்தத்தை நிர்வகித்தல்'),
      description: t('Expert tips on how to handle study pressure and exam anxiety.', 'படிப்பு அழுத்தம் மற்றும் தேர்வு பதட்டத்தை எவ்வாறு கையாள்வது என்பது குறித்த நிபுணர் குறிப்புகள்.'),
      duration: '08:45',
      icon: <PlayCircle />,
      link: 'https://www.youtube.com/embed/6Rg0mBkVAeo',
      thumbnail: 'https://img.youtube.com/vi/6Rg0mBkVAeo/maxresdefault.jpg'
    },
    {
      id: 3,
      type: 'Audio',
      title: t('Anxiety Relief Audio', 'பதட்ட நிவாரண ஆடியோ'),
      description: t('Binaural beats and calming frequencies to reduce stress instantly.', 'மன அழுத்தத்தை உடனடியாகக் குறைக்க பைனரல் பீட்ஸ் மற்றும் அமைதிப்படுத்தும் அதிர்வெண்கள்.'),
      duration: '04:12',
      icon: <Headphones />,
      link: 'https://qxvmtppfosgiefnhnqez.supabase.co/storage/v1/object/public/resources/leberch-stress-relief-262609.mp3'
    },
    {
      id: 4,
      type: 'Game',
      title: t('Bubble Pop Breathing', 'பப்பில் பாப் சுவாசம்'),
      description: t('Pop the floating bubbles to the rhythm of your breath to relax.', 'ஓய்வெடுக்க உங்கள் சுவாசத்தின் தாளத்திற்கு ஏற்ப மிதக்கும் குமிழ்களை பாப் செய்யவும்.'),
      duration: 'Infinite',
      icon: <Gamepad2 />,
      link: 'game_bubble_pop'
    },
    {
      id: 5,
      type: 'Video',
      title: t('Deep Sleep Rain Sounds', 'ஆழ்ந்த தூக்க மழை ஒலிகள்'),
      description: t('Nature sounds to help you fall asleep faster and improve sleep quality.', 'நீங்கள் விரைவாக உறங்கவும் தூக்கத்தின் தரத்தை மேம்படுத்தவும் உதவும் இயற்கை ஒலிகள்.'),
      duration: '3 hours',
      icon: <PlayCircle />,
      link: 'https://www.youtube.com/embed/eTeD8DAta4c',
      thumbnail: 'https://img.youtube.com/vi/eTeD8DAta4c/maxresdefault.jpg'
    },
    {
      id: 6,
      type: 'Video',
      title: t('Understanding Anxiety', 'பதட்டத்தைப் புரிந்துகொள்வது'),
      description: t('Learn what causes anxiety and how to rewire your brain for calm.', 'பதட்டம் எதனால் ஏற்படுகிறது மற்றும் உங்கள் மூளையை அமைதிப்படுத்த எப்படி மீண்டும் உருவாக்குவது என்பதை அறிந்து கொள்ளுங்கள்.'),
      duration: '12:30',
      icon: <PlayCircle />,
      link: 'https://www.youtube.com/embed/ZtBlAXo8LsY',
      thumbnail: 'https://img.youtube.com/vi/ZtBlAXo8LsY/maxresdefault.jpg'
    }
  ];

  // Game Loop
  useEffect(() => {
    let interval;
    if (isGameOpen) {
      interval = setInterval(() => {
        const newBubble = {
          id: Math.random(),
          x: Math.random() * 80 + 10, // 10% to 90% width
          size: Math.random() * 40 + 40,
          delay: Math.random() * 2
        };
        setBubbles(prev => [...prev.slice(-15), newBubble]); // Keep last 15 bubbles
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isGameOpen]);

  const handlePop = (id) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setPopCount(prev => prev + 1);
  };

  const filteredLibrary = library.filter(item => {
    const matchesFilter = filter === 'All' || item.type === filter;
    const title = item.title || '';
    const desc = item.description || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenResource = (item) => {
    if (item.type === 'Video') {
      setSelectedVideo(item);
    } else if (item.type === 'Audio') {
      setSelectedAudio(item);
      setIsAudioPlaying(false);
    } else if (item.link === 'game_bubble_pop') {
      setIsGameOpen(true);
      setPopCount(0);
      setBubbles([]);
    } else if (item.link && item.link !== '#') {
      window.open(item.link, '_blank');
    }
  };

  const closeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSelectedAudio(null);
    setIsAudioPlaying(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      // Use the play() promise to catch potential interruptions
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          if (e.name !== 'AbortError') {
            console.error("Audio play failed:", e);
          }
        });
      }
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="space-y-8 pb-12 pt-4">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-dm-serif text-white">{t('Wellness Library', 'நல நூலகம்')}</h1>
        <p className="text-white/40 text-sm">{t('Curated resources to help you thrive and find peace.', 'நீங்கள் செழிக்கவும் அமைதியைக் காணவும் உதவும் தேர்ந்தெடுக்கப்பட்ட தகவல்கள்.')}</p>
      </header>

      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder={t('Search articles, videos, audios, games...', 'கட்டுரைகள், வீடியோக்கள், ஆடியோக்கள், விளையாட்டுகளைத் தேடுங்கள்...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12 bg-white/5 border-white/10 focus:bg-white/10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Video', 'Audio', 'Game', 'Guide'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-300 ${
                filter === type 
                ? 'bg-mb-indigo border-mb-indigo text-white shadow-[0_0_20px_rgba(91,109,246,0.3)]' 
                : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              {t(type, type)}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredLibrary.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 border-white/5 hover:border-white/10 transition-all group flex flex-col h-full bg-gradient-to-br from-white/5 to-transparent shadow-xl"
            >
              {item.type === 'Video' && item.thumbnail && (
                <div className="relative mb-6 rounded-2xl overflow-hidden group/thumb cursor-pointer" onClick={() => handleOpenResource(item)}>
                  <img src={item.thumbnail} alt={item.title} className="w-full h-44 object-cover group-hover/thumb:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-mb-dark-bg/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <PlayCircle size={24} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform text-white/60">
                  {item.icon}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                  <Clock size={12} />
                  {item.duration}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-mb-lavender transition-colors">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button 
                  onClick={() => handleOpenResource(item)}
                  className="flex items-center gap-2 text-xs font-bold text-mb-indigo hover:text-mb-lavender transition-all group/btn"
                >
                  {t('Open Resource', 'தகவலைத் திற')} 
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
                <button className="text-white/10 hover:text-red-400 transition-all"><Heart size={18} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVideo(null)} className="absolute inset-0 bg-mb-dark-bg/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card w-full max-w-4xl overflow-hidden relative z-10 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
                <button onClick={() => setSelectedVideo(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
              </div>
              <div className="aspect-video bg-black">
                <iframe width="100%" height="100%" src={selectedVideo.link} title="Video" frameBorder="0" allowFullScreen />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Audio Modal */}
      <AnimatePresence>
        {selectedAudio && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAudio} className="absolute inset-0 bg-mb-dark-bg/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="glass-card w-full max-w-md p-8 border-mb-indigo/30 shadow-2xl relative z-10 text-center">
              <button onClick={closeAudio} className="absolute top-4 right-4 text-white/40 hover:text-white"><X size={24} /></button>
              <div className="w-24 h-24 rounded-full bg-mb-indigo mx-auto mb-6 flex items-center justify-center shadow-2xl">
                <Music size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-dm-serif text-white mb-2">{selectedAudio.title}</h2>
              <audio ref={audioRef} src={selectedAudio.link} onEnded={() => setIsAudioPlaying(false)} hidden />
              <div className="flex items-center justify-center gap-6 mt-8">
                <button onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0; }} className="text-white/40 hover:text-white"><RotateCcw size={20} /></button>
                <button onClick={toggleAudio} className="w-20 h-20 rounded-full bg-mb-indigo flex items-center justify-center text-white">
                  {isAudioPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <div className="w-12 h-12" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bubble Pop Game Modal */}
      <AnimatePresence>
        {isGameOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-mb-dark-bg/95 backdrop-blur-2xl" />
            
            <button onClick={() => setIsGameOpen(false)} className="absolute top-8 right-8 z-50 text-white/40 hover:text-white bg-white/5 p-3 rounded-full transition-all"><X size={32} /></button>

            <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
              {/* Game HUD */}
              <div className="absolute top-10 text-center space-y-2 pointer-events-none">
                <div className="flex items-center justify-center gap-2 text-mb-mint">
                  <Sparkles size={20} />
                  <span className="text-3xl font-bold tracking-tighter">{popCount}</span>
                </div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">{t('Bubbles Popped', 'பாப் செய்யப்பட்ட குமிழ்கள்')}</p>
              </div>

              {/* Game Area */}
              <div className="w-full h-full relative">
                <AnimatePresence>
                  {bubbles.map((bubble) => (
                    <motion.div
                      key={bubble.id}
                      initial={{ y: '110vh', x: `${bubble.x}vw`, opacity: 0, scale: 0.5 }}
                      animate={{ y: '-20vh', opacity: 1, scale: 1 }}
                      exit={{ scale: 2, opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 8, ease: 'linear', delay: bubble.delay }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        handlePop(bubble.id);
                      }}
                      className="absolute cursor-pointer rounded-full bg-gradient-to-br from-white/40 to-mb-indigo/40 border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center backdrop-blur-md group touch-none"
                      style={{ width: bubble.size, height: bubble.size }}
                    >
                      <div className="w-[30%] h-[30%] bg-white/40 rounded-full absolute top-2 left-2 blur-[1px]"></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Breathing Guide */}
              <div className="absolute bottom-20 text-center pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="text-lg font-bold text-mb-lavender uppercase tracking-widest px-8 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md"
                >
                  {t('Pop on Exhale', 'மூச்சை விடும்போது பாப் செய்யவும்')}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;
