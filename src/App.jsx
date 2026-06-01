import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Onboard from './pages/Onboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Feature Pages
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Assess from './pages/Assess';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Crisis from './pages/Crisis';
import Counsellors from './pages/Counsellors';
import Meditation from './pages/Meditation';
import Notifications from './pages/Notifications';

import Welcome from './pages/Welcome';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public / Onboarding Flow */}
          <Route path="/" element={<Onboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
          
          {/* Main Application (Protected in Layout) */}
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/chat" element={<MainLayout><Chat /></MainLayout>} />
          <Route path="/assess" element={<MainLayout><Assess /></MainLayout>} />
          <Route path="/resources" element={<MainLayout><Resources /></MainLayout>} />
          <Route path="/community" element={<MainLayout><Community /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          <Route path="/crisis" element={<MainLayout><Crisis /></MainLayout>} />
          <Route path="/counsellors" element={<MainLayout><Counsellors /></MainLayout>} />
          <Route path="/meditation" element={<MainLayout><Meditation /></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
