import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Bell, 
  Globe, 
  Edit2,
  Check,
  X,
  Loader2,
  Camera,
  Upload
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [editData, setEditData] = useState({
    full_name: '',
    age: '',
    phone: '',
    role: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
        setEditData({
          full_name: data.full_name || '',
          age: data.age || '',
          phone: data.phone || '',
          role: data.role || 'Student',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 1. Upload to Storage (Note: 'avatars' bucket must exist and be public)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update State
      setEditData({ ...editData, avatar_url: publicUrl });
      
      // If not in editing mode, update the profile immediately
      if (!isEditing) {
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    } catch (error) {
      alert(t('Error uploading avatar! Make sure the "avatars" bucket is created and public in Supabase.', 'அவதாரைப் பதிவேற்றுவதில் பிழை!'));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: editData.full_name,
          age: parseInt(editData.age) || null,
          phone: editData.phone,
          role: editData.role,
          avatar_url: editData.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-mb-dark-bg">
        <Loader2 className="animate-spin text-mb-indigo" size={32} />
      </div>
    );
  }

  // Display Avatar Logic
  const avatarSrc = editData.avatar_url || profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || 'User'}`;

  return (
    <div className="space-y-8 pb-12 pt-4">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-dm-serif text-white">{t('Your Profile', 'உங்கள் சுயவிவரம்')}</h1>
        <button onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')} className="glass-card px-4 py-2 text-xs font-bold text-mb-lavender uppercase tracking-widest border-white/5">
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </header>

      {/* Profile Card */}
      <section className="glass-card p-8 text-center relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-white/10 shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isEditing ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
          >
            {isEditing ? <X size={18} /> : <Edit2 size={18} />}
          </button>
        </div>

        {/* Avatar Section */}
        <div className="relative w-32 h-32 mx-auto mb-6 group">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-mb-indigo to-mb-violet flex items-center justify-center text-4xl shadow-2xl overflow-hidden border-4 border-white/10">
            {uploading ? (
              <Loader2 className="animate-spin text-white/50" size={32} />
            ) : (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            )}
          </div>
          
          {/* Upload Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-mb-indigo border-4 border-mb-dark-bg flex items-center justify-center shadow-lg hover:bg-mb-violet transition-colors cursor-pointer group-hover:scale-110"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={uploadAvatar} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {isEditing ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-xs mx-auto">
            <div className="space-y-1 text-left">
               <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">{t('Full Name', 'முழு பெயர்')}</label>
               <input 
                 type="text" 
                 value={editData.full_name}
                 onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                 className="input-field text-center font-bold text-lg py-3"
                 placeholder="Name"
               />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">{t('Age', 'வயது')}</label>
                <input 
                  type="number" 
                  value={editData.age}
                  onChange={(e) => setEditData({...editData, age: e.target.value})}
                  className="input-field text-center py-3"
                />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] text-white/30 font-bold uppercase tracking-widest ml-1">{t('Role', 'பங்கு')}</label>
                <select 
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="input-field text-center bg-mb-dark-bg py-3 text-sm"
                >
                  <option value="Student">Student</option>
                  <option value="Counsellor">Counsellor</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
            </div>
            <button 
              disabled={saving}
              onClick={handleUpdate}
              className="btn-primary w-full py-4 mt-2 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> {t('Save Changes', 'மாற்றங்களைச் சேமி')}</>}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-white mb-1">{profile?.full_name || t('Anonymous User', 'அநாமதேய பயனர்')}</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
               <span className="text-mb-lavender">{t(profile?.role || 'Student', profile?.role || 'மாணவர்')}</span>
               <span className="w-1 h-1 rounded-full bg-white/20"></span>
               <span>{profile?.age || '??'} {t('Years Old', 'வயது')}</span>
            </p>
            <div className="flex justify-center gap-8 py-6 border-t border-white/5">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profile?.wellness_score || 0}</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t('Wellness', 'நலன்')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{profile?.streak || 0}</div>
                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t('Streak', 'தொடர்ச்சி')}</div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Account Details */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-1">{t('Account Settings', 'கணக்கு அமைப்புகள்')}</h3>
        <div className="glass-card divide-y divide-white/5 overflow-hidden border-white/10 shadow-lg">
          {[
            { icon: <Bell size={18} />, label: t('Notifications', 'அறிவிப்புகள்'), color: 'text-mb-lavender', path: '/notifications' },
            { icon: <Shield size={18} />, label: t('Privacy & Security', 'தனியுரிமை & பாதுகாப்பு'), color: 'text-mb-mint' },
            { icon: <Globe size={18} />, label: t('Language', 'மொழி'), value: language === 'en' ? 'English' : 'தமிழ்', color: 'text-mb-sky' },
          ].map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => item.path && navigate(item.path)}
              className="w-full p-5 flex items-center justify-between group hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`${item.color} p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-all`}>{item.icon}</div>
                <div>
                  <div className="font-bold text-white text-sm">{item.label}</div>
                  {item.value && <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{item.value}</div>}
                </div>
              </div>
              <ChevronRight size={18} className="text-white/10 group-hover:text-white transition-all" />
            </button>
          ))}
        </div>
      </section>

      <button 
        onClick={handleLogout}
        className="w-full glass-card p-5 flex items-center justify-center gap-3 text-red-400 font-bold uppercase tracking-widest text-xs hover:bg-red-500/10 transition-all border-red-500/10 mb-8"
      >
        <LogOut size={18} />
        {t('Log Out', 'வெளியேறு')}
      </button>
    </div>
  );
};

export default Profile;
