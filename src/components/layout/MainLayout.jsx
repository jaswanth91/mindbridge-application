import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  ClipboardCheck, 
  User, 
  ShieldAlert, 
  BookOpen, 
  BarChart3, 
  Users, 
  Bell,
  LogOut,
  ChevronRight,
  Loader2,
  Stethoscope,
  Wind
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { supabase } from "../../utils/supabaseClient";

const MainLayout = ({ children }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(true); // Mocked for UI demo

  useEffect(() => {
    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchProfile();
      }
    });

    const profileSubscription = supabase
      .channel('profile_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles' 
      }, payload => {
        setProfile(prev => ({ ...prev, ...payload.new }));
      })
      .subscribe();

    return () => {
      authListener.subscription.unsubscribe();
      supabase.removeChannel(profileSubscription);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    } catch (error) {
      console.error('Sidebar profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { icon: <Home size={22} />, label: t("Dashboard", "முகப்பு"), path: "/dashboard" },
    { icon: <MessageSquare size={22} />, label: t("Aria AI", "ஆரியா AI"), path: "/chat" },
    { icon: <Wind size={22} />, label: t("Meditation", "தியானம்"), path: "/meditation" },
    { icon: <ClipboardCheck size={22} />, label: t("Assess", "பரிசோதனை"), path: "/assess" },
    { icon: <Stethoscope size={22} />, label: t("Counsellors", "ஆலோசகர்கள்"), path: "/counsellors" },
    { icon: <BookOpen size={22} />, label: t("Resources", "தகவல்கள்"), path: "/resources" },
    { icon: <Users size={22} />, label: t("Community", "சமூகம்"), path: "/community" },
    { icon: <Bell size={22} />, label: t("Notifications", "அறிவிப்புகள்"), path: "/notifications" },
    { icon: <ShieldAlert size={22} />, label: t("Crisis", "உதவி"), path: "/crisis" },
  ];

  const isActive = (path) => location.pathname === path;

  const shortId = profile?.id ? `#MB-${profile.id.substring(0, 4).toUpperCase()}` : "#MB-0000";
  const avatarSrc = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.full_name || 'User'}`;

  return (
    <div className="flex min-h-screen bg-mb-dark-bg text-white font-dm-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-mb-dark-bg border-r border-white/5 p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mb-indigo to-mb-violet flex items-center justify-center text-xl shadow-lg">🧠</div>
          <span className="text-xl font-dm-serif tracking-tight">MindBridge</span>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pb-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                isActive(item.path)
                  ? "bg-mb-indigo/10 text-mb-lavender shadow-inner border border-mb-indigo/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`${isActive(item.path) ? "text-mb-indigo scale-110" : "group-hover:scale-110"} transition-transform duration-300 shrink-0`}>
                {item.icon}
              </span>
              <span className="font-medium truncate">{item.label}</span>
              
              {item.path === '/notifications' && hasNewNotifications && !isActive(item.path) && (
                <div className="absolute top-3 right-4 w-1.5 h-1.5 rounded-full bg-mb-indigo shadow-[0_0_8px_rgba(91,109,246,0.8)] animate-pulse"></div>
              )}

              {isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-mb-indigo shadow-[0_0_8px_rgba(91,109,246,0.8)]"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile Card */}
        <Link 
          to="/profile"
          className="mt-4 glass-card p-4 flex items-center gap-4 group hover:bg-white/5 transition-all border-white/5 shadow-lg"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mb-indigo to-mb-violet flex items-center justify-center text-2xl shadow-lg relative border-2 border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
             <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
             <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-mb-mint border-2 border-mb-dark-bg flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
             </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-xs truncate">{profile?.full_name || 'User'}</h4>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{shortId}</p>
          </div>
          <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-all" />
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        <header className="md:hidden flex justify-between items-center p-6 sticky top-0 bg-mb-dark-bg/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mb-indigo to-mb-violet flex items-center justify-center text-sm shadow-lg">🧠</div>
            <span className="text-lg font-dm-serif">MindBridge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/notifications" className="relative text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              {hasNewNotifications && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-mb-indigo border-2 border-mb-dark-bg animate-pulse"></div>
              )}
            </Link>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-mb-dark-bg/90 backdrop-blur-xl border-t border-white/5 flex justify-around p-4 pb-8 z-40">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive(item.path) ? "text-mb-indigo scale-110" : "text-white/30"
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
