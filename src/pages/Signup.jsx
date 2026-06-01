import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import { ArrowLeft, ChevronRight, Mail, Lock, Phone, Eye, Shield, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoginLink, setShowLoginLink] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const nextStep = () => {
    if (step === 1 && (!formData.fullName || !formData.age)) {
      setError(t('Please fill all fields', 'அனைத்து விவரங்களையும் நிரப்பவும்'));
      return;
    }
    if (step === 3 && !formData.email) {
      setError(t('Email is required', 'மின்னஞ்சல் தேவை'));
      return;
    }
    setError(null);
    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => step > 1 ? setStep(s => s - 1) : navigate(-1);

  const handleSignup = async () => {
    if (!formData.password || formData.password.length < 6) {
      setError(t('Password must be at least 6 characters', 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('Passwords do not match', 'கடவுச்சொற்கள் பொருந்தவில்லை'));
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowLoginLink(false);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setShowLoginLink(true);
        }
        throw authError;
      }

      if (authData.user) {
        // If user is created but email confirmation is on, session might be null
        // We try to insert the profile. If it fails due to RLS, it's likely the confirmation issue.
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: formData.fullName,
            age: parseInt(formData.age),
            phone: formData.phone,
            gender: formData.gender,
            updated_at: new Date().toISOString()
          }
        ]);

        if (profileError) {
          console.error('Profile Error:', profileError);
          // If profile setup fails, it's usually because the user isn't 'confirmed' yet in Supabase
          throw new Error(t(
            "Account created! Please check your email for a confirmation link, then log in.",
            "கணக்கு உருவாக்கப்பட்டது! உங்கள் மின்னஞ்சலில் உள்ள உறுதிப்படுத்தல் இணைப்பைச் சரிபார்த்து, பின்னர் உள்நுழையவும்."
          ));
        }
        
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      if (err.message.includes('created')) {
        setShowLoginLink(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grad-onboard p-8 flex flex-col items-center overflow-hidden">
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center mb-10 max-w-lg mx-auto">
        <button onClick={prevStep} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
          <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-mb-indigo text-white shadow-lg' : 'text-white/40'}`}>EN</button>
          <button onClick={() => setLanguage('ta')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'ta' ? 'bg-mb-indigo text-white shadow-lg' : 'text-white/40'}`}>தமிழ்</button>
        </div>
        
        <div className="w-10 text-[10px] text-white/40 font-bold uppercase tracking-widest text-right">100%</div>
      </div>

      {/* Step Indicator */}
      <div className="text-center mb-8">
        <div className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-4">
          {t(`STEP ${step} OF 5`, `படி ${step} / 5`)}
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-mb-lavender w-4' : 'bg-white/10'}`}></div>
          ))}
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500/50 text-red-200 text-[11px] font-bold uppercase tracking-widest px-4 py-3 rounded-xl mb-6 flex flex-col items-center gap-3 w-full max-w-sm shadow-lg text-center">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
          {showLoginLink && (
            <Link to="/login" className="bg-white/10 px-4 py-1.5 rounded-lg hover:bg-white/20 transition-all">
              {t('Go to Login', 'உள்நுழைவுக்குச் செல்லவும்')}
            </Link>
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-sm flex flex-col items-center"
        >
          {/* STEP 1: Name & Age */}
          {step === 1 && (
            <div className="w-full space-y-12 text-center">
              <div>
                <h1 className="t-hero text-3xl mb-3">{t('Tell us about yourself', 'உங்களைப் பற்றி சொல்லுங்கள்')}</h1>
                <p className="t-body text-mb-lavender/60">{t('So we can personalize your experience 🌱', 'அனுபவத்தை தனிப்பயனாக்கலாம் 🌱')}</p>
              </div>
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Full Name', 'முழு பெயர்')}</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="jaswanth" 
                    className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Age', 'வயது')}</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="23" 
                      className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10 appearance-none" 
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 text-white/40 pointer-events-none"><ChevronRight size={14} className="-rotate-90" /><ChevronRight size={14} className="rotate-90" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Phone & Gender */}
          {step === 2 && (
            <div className="w-full space-y-10 text-center">
              <div>
                <h1 className="t-hero text-3xl mb-3">{t('A bit more about you', 'உங்களைப் பற்றி இன்னும் கொஞ்சம்')}</h1>
                <p className="t-body text-mb-lavender/60">{t('Optional — skip if you prefer', 'விருப்பமானது — விரும்பினால் தவிர்க்கவும்')}</p>
              </div>
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Phone Number (optional)', 'தொலைபேசி எண்')}</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210" 
                    className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Gender (optional)', 'பாலினம்')}</label>
                  <div className="flex flex-wrap gap-2">
                    {['Male', 'Female', 'Non-binary'].map(g => (
                      <button 
                        key={g} 
                        onClick={() => setFormData({...formData, gender: g})}
                        className={`px-5 py-2.5 rounded-xl border transition-all ${formData.gender === g ? 'bg-mb-indigo/30 border-mb-indigo text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}
                      >
                        {g === 'Male' ? '♂️ ' : g === 'Female' ? '♀️ ' : '⚧ '}{t(g, g)}
                      </button>
                    ))}
                    <button 
                      onClick={() => setFormData({...formData, gender: 'Private'})}
                      className={`px-5 py-2.5 rounded-xl border transition-all ${formData.gender === 'Private' ? 'bg-mb-indigo/30 border-mb-indigo text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                    >
                      <Lock size={12} className="inline mr-2" /> {t('Prefer not to say', 'சொல்ல விரும்பவில்லை')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Email */}
          {step === 3 && (
            <div className="w-full space-y-10 text-center">
              <div>
                <h1 className="t-hero text-3xl mb-3">{t('Your Email Address', 'உங்கள் மின்னஞ்சல்')}</h1>
                <p className="t-body text-mb-lavender/60">{t("We'll send a verification link to your email", 'சரிபார்க்க உங்கள் மின்னஞ்சலுக்கு இணைப்பை அனுப்புவோம்')}</p>
              </div>
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-white/5">
                <Mail className="text-mb-lavender" size={28} />
              </div>
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Email Address', 'மின்னஞ்சல் முகவரி')}</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="you@college.edu" 
                    className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Password */}
          {step === 5 && (
            <div className="w-full space-y-10 text-center">
              <div>
                <h1 className="t-hero text-3xl mb-3">{t('Set Your Password', 'கடவுச்சொல்லை அமைக்கவும்')}</h1>
                <p className="t-body text-mb-lavender/60">{t('Create a secure password', 'பாதுகாப்பான கடவுச்சொல்லை உருவாக்கவும்')}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                <Lock className="text-white relative z-10" size={28} />
              </div>
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Password', 'கடவுச்சொல்')}</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Min. 8 characters" 
                      className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10" 
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors group-focus-within:text-mb-indigo"><Eye size={18} /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 ml-1">{t('Confirm Password', 'கடவுச்சொல்லை உறுதிப்படுத்தவும்')}</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Re-enter password" 
                      className="input-field bg-white/5 border-white/10 py-4 focus:bg-white/10" 
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors group-focus-within:text-mb-indigo"><Eye size={18} /></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="w-full pt-12 space-y-6">
            <button 
              disabled={loading}
              onClick={step === 5 ? handleSignup : nextStep}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(91,109,246,0.3)] group active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {step === 5 ? t('Complete Registration', 'பதிவை முடிக்கவும்') : t('Continue', 'தொடர்க')} 
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
            
            {(step === 1 || step === 2) && !loading && (
              <button className="text-white/30 hover:text-white transition-colors text-xs font-medium tracking-wide block mx-auto hover:underline">
                {t('Skip for now', 'இப்போதைக்கு தவிர்க்கவும்')}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Signup;
