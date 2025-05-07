import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

import SignIn from './ui-kit/components/account/SignIn';
import Sidebar from './ui-kit/components/layout/Sidebar';
import MobileHeader from './ui-kit/components/layout/MobileHeader';
import HomeView from './ui-kit/components/home/GetToKnowYouView';
import ChatView from './ui-kit/components/chat/RagChatView';
import ReflectView from './ui-kit/components/reflect/ReflectView';
import AvatarComposer from './ui-kit/components/avatar/AvatarComposer';
import PlanView from './ui-kit/components/plan/PlanView';
import AccountView from './ui-kit/components/account/AccountView';
import PlaygroundView from './ui-kit/components/dev/PlaygroundView';

function AppContent() {
  console.log("🚀 XavigateApp loaded");

  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('xavigate_user'));
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState<string>('playground');

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignIn = (name: string) => {
    setUserName(name);
    localStorage.setItem('xavigate_user', name);
  };


  const renderView = () => {
    switch (activeView) {
      case 'getToKnowYou':
        return <HomeView onNavigate={setActiveView} />;
      case 'chat':
        return <ChatView />;
      case 'reflect':
        return <ReflectView />;
      case 'plan':
        return <PlanView />;
      case 'avatar':
        return (
          <AvatarComposer
            uuid={userName || 'unknown'}
            backendUrl={import.meta.env.VITE_API_URL || 'http://localhost:8010'}
            onSave={(profile) => console.log('✅ Avatar saved:', profile)}
          />
        );
      case 'account':
        return <AccountView />;
      case 'tailwindTest':
        return (
          <div className="p-6 text-center">
            <div className="bg-red-500 text-white p-4 rounded-lg shadow text-lg">
              ✅ Tailwind is working inside XavigateApp!
            </div>
            <Flame className="w-10 h-10 text-orange-500 mt-4 mx-auto" />
            <p className="text-gray-500 mt-2">Lucide is working too.</p>
          </div>
        );
      case 'playground':
        return <PlaygroundView />;
      default:
        return <div><h1>Unknown View</h1></div>;
    }
  };

  if (!userName) {
    return <SignIn onSubmit={handleSignIn} />;
  }
  

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        userName={userName}
        setActiveView={(view: string) => {
          setActiveView(view);
          if (isMobile) setSidebarOpen(false);
        }}
        isVisible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MobileHeader onToggle={() => isMobile && setSidebarOpen(prev => !prev)} />
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default function XavigateApp() {
  return <AppContent />;
}