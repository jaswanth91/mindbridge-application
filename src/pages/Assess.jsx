import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Info,
  Calendar,
  MessageSquare,
  Activity,
  History,
  TrendingUp,
  Brain,
  Clock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Assess = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('landing'); // 'landing', 'quiz', 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const questions = [
    { id: 1, text: t('Little interest or pleasure in doing things', 'காரியங்களைச் செய்வதில் ஆர்வம் அல்லது மகிழ்ச்சி குறைவாக இருப்பது'), type: 'PHQ9' },
    { id: 2, text: t('Feeling down, depressed, or hopeless', 'சோர்வாக, மனச்சோர்வாக அல்லது நம்பிக்கையற்றவராக உணர்தல்'), type: 'PHQ9' },
    { id: 3, text: t('Trouble falling or staying asleep, or sleeping too much', 'உறங்குவதில் சிக்கல், அல்லது அதிகமாக உறங்குதல்'), type: 'PHQ9' },
    { id: 4, text: t('Feeling tired or having little energy', 'சோர்வாக அல்லது குறைந்த ஆற்றலுடன் உணர்தல்'), type: 'PHQ9' },
    { id: 5, text: t('Poor appetite or overeating', 'பசி குறைவாக இருப்பது அல்லது அதிகமாக உண்பது'), type: 'PHQ9' },
    { id: 6, text: t('Feeling bad about yourself or that you are a failure', 'உங்களைப் பற்றி மோசமாக உணர்தல் அல்லது நீங்கள் ஒரு தோல்வி என்று எண்ணுதல்'), type: 'PHQ9' },
    { id: 7, text: t('Trouble concentrating on things', 'காரியங்களில் கவனம் செலுத்துவதில் சிக்கல்'), type: 'PHQ9' },
    { id: 8, text: t('Moving or speaking so slowly that other people could have noticed', 'மற்றவர்கள் கவனிக்கும் அளவுக்கு மெதுவாக நகர்வது அல்லது பேசுவது'), type: 'PHQ9' },
    { id: 9, text: t('Thoughts that you would be better off dead', 'உயிர் வாழ்வதை விட இறப்பதே சிறந்தது என்ற எண்ணம்'), type: 'PHQ9' }
  ];

  const options = [
    { label: t('Not at all', 'இல்லவே இல்லை'), value: 0 },
    { label: t('Several days', 'சில நாட்கள்'), value: 1 },
    { label: t('More than half the days', 'பாதிக்கும் மேற்பட்ட நாட்கள்'), value: 2 },
    { label: t('Nearly every day', 'கிட்டத்தட்ட ஒவ்வொரு நாளும்'), value: 3 }
  ];

  const updateWellnessData = async (phqScore) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate Wellness Score (0-100)
      // PHQ-9 max is 27. We invert it: (27 - score) / 27 * 100
      const wellnessScore = Math.round(((27 - phqScore) / 27) * 100);

      // Fetch current streak to increment it
      const { data: profile } = await supabase
        .from('profiles')
        .select('streak')
        .eq('id', user.id)
        .single();

      const newStreak = (profile?.streak || 0) + 1;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          wellness_score: wellnessScore,
          streak: newStreak
        })
        .eq('id', user.id);

      if (error) throw error;
      console.log("Success: Wellness data updated!");
    } catch (error) {
      console.error("Error updating wellness data:", error);
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((a, b) => a + b, 0);
      setScore(totalScore);
      updateWellnessData(totalScore); // Save to database!
      setActiveStep('result');
    }
  };

  const getResultCategory = (s) => {
    if (s <= 4) return { label: t('Minimal Depression', 'குறைந்த மனச்சோர்வு'), color: 'text-mb-mint' };
    if (s <= 9) return { label: t('Mild Depression', 'லேசான மனச்சோர்வு'), color: 'text-mb-sky' };
    if (s <= 14) return { label: t('Moderate Depression', 'மிதமான மனச்சோர்வு'), color: 'text-mb-lavender' };
    if (s <= 19) return { label: t('Moderately Severe', 'மிதமான கடுமையான'), color: 'text-mb-violet' };
    return { label: t('Severe Depression', 'கடுமையான மனச்சோர்வு'), color: 'text-red-400' };
  };

  const resetQuiz = () => {
    setActiveStep('landing');
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  const result = getResultCategory(score);

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        {/* Landing Page */}
        {activeStep === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <header className="space-y-2">
              <h1 className="text-3xl font-dm-serif text-white">{t('Mental Health Check', 'மனநல சோதனை')}</h1>
              <p className="text-white/40 text-sm">{t('Take a few minutes to track your wellness progress.', 'உங்கள் நலனை மேம்படுத்த சில நிமிடங்கள் ஒதுக்குங்கள்.')}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <History className="text-mb-indigo" />, label: t('Last Check', 'கடைசி சோதனை'), value: '2 days ago' },
                { icon: <TrendingUp className="text-mb-mint" />, label: t('Avg Score', 'சராசரி மதிப்பெண்'), value: 'Low' },
                { icon: <Brain className="text-mb-lavender" />, label: t('Status', 'நிலை'), value: 'Good' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-5 border-white/5 bg-white/5 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">{stat.icon}</div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 border-white/10 bg-gradient-to-br from-mb-indigo/10 to-transparent relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <ClipboardCheck size={120} />
              </div>
              <div className="max-w-md space-y-6 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">PHQ-9 Assessment</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {t('The Patient Health Questionnaire (PHQ-9) is a multipurpose instrument for screening, diagnosing, monitoring and measuring the severity of depression.', 'நோயாளி ஆரோக்கிய வினாத்தாள் (PHQ-9) என்பது மனச்சோர்வின் தீவிரத்தை திரையிடுவதற்கும், கண்டறிவதற்கும் மற்றும் அளவிடுவதற்கும் ஒரு பல்நோக்கு கருவியாகும்.')}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Clock size={14} /> 2-3 {t('Mins', 'நிமிடங்கள்')}</span>
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Activity size={14} /> 9 {t('Questions', 'கேள்விகள்')}</span>
                </div>

                <button 
                  onClick={() => setActiveStep('quiz')}
                  className="btn-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl group"
                >
                  {t('Start Assessment', 'சோதனையைத் தொடங்கு')}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-5 items-start">
              <div className="w-12 h-12 rounded-2xl bg-mb-sky/20 flex items-center justify-center text-mb-sky">
                <Info size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{t('Private & Secure', 'தனியார் மற்றும் பாதுகாப்பானது')}</h4>
                <p className="text-xs text-white/40 leading-relaxed">
                  {t('Your assessment results are private and are only used to help you track your progress over time.', 'உங்கள் மதிப்பீட்டு முடிவுகள் தனிப்பட்டவை மற்றும் காலப்போக்கில் உங்கள் முன்னேற்றத்தைக் கண்காணிக்க மட்டுமே பயன்படுத்தப்படுகின்றன.')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Flow */}
        {activeStep === 'quiz' && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto space-y-10 py-10"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-mb-indigo uppercase tracking-widest">{t('Question', 'கேள்வி')} {currentQuestion + 1} of 9</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">PHQ-9 Screening</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / 9) * 100}%` }}
                  className="h-full bg-mb-indigo"
                />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-dm-serif text-white leading-tight">
                {questions[currentQuestion].text}
              </h2>

              <div className="grid gap-3">
                {options.map((option, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl text-left flex justify-between items-center group transition-all"
                  >
                    <span className="font-medium text-white/80 group-hover:text-white">{option.label}</span>
                    <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center group-hover:border-mb-indigo group-hover:bg-mb-indigo/10 transition-all">
                      <div className="w-2 h-2 rounded-full bg-mb-indigo opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
              className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
            >
              <ChevronLeft size={16} /> {t('Previous Question', 'முந்தைய கேள்வி')}
            </button>
          </motion.div>
        )}

        {/* Result Page */}
        {activeStep === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto py-10 space-y-10"
          >
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-mb-mint/10 rounded-full flex items-center justify-center mx-auto text-mb-mint mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-dm-serif text-white">{t('Your Assessment Result', 'உங்கள் மதிப்பீட்டு முடிவு')}</h2>
              <p className="text-white/40 text-sm">Patient Health Questionnaire</p>
            </div>

            <div className="glass-card p-10 border-white/10 bg-gradient-to-br from-white/5 to-transparent text-center space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{t('Total Score', 'மொத்த மதிப்பெண்')}</p>
                <p className="text-7xl font-dm-serif text-white">{score}</p>
              </div>
              <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10">
                <span className={`text-lg font-bold ${result.color}`}>{result.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={resetQuiz}
                className="w-full py-4 bg-white/5 border border-white/5 rounded-2xl font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                {t('Return to Hub', 'முகப்புக்குச் செல்')}
              </button>
              <button 
                onClick={() => navigate('/counsellors')}
                className="btn-primary w-full py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 group"
              >
                {t('Book a Counsellor', 'ஆலோசகரை முன்பதிவு செய்')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-6 bg-mb-mint/5 rounded-3xl border border-mb-mint/10 space-y-3">
              <div className="flex items-center gap-3 text-mb-mint font-bold text-sm">
                <CheckCircle2 size={18} />
                {t('Next Steps', 'அடுத்த படிகள்')}
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                {t('We recommend speaking with a campus counsellor to discuss these results. They can provide personalized support and strategies.', 'இந்த முடிவுகளைப் பற்றி விவாதிக்க வளாக ஆலோசகருடன் பேச பரிந்துரைக்கிறோம். அவர்கள் தனிப்பயனாக்கப்பட்ட ஆதரவு மற்றும் உத்திகளை வழங்க முடியும்.')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assess;
