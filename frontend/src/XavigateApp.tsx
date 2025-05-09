import React, { useState, useEffect } from 'react';

import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './ui-kit/components/account/SignIn';

import Sidebar from './ui-kit/components/layout/Sidebar';
import MobileHeader from './ui-kit/components/layout/MobileHeader';

import HomeView from './ui-kit/components/home/GetToKnowYouView';
import ChatView from './ui-kit/components/chat/RagChatView';
import ReflectView from './ui-kit/components/reflect/ReflectView';
// import InsightsView from './ui-kit/components/insights/InsightsView';
// import MetricsView from './ui-kit/components/metrics/MetricsView';
import AvatarComposer from './ui-kit/components/avatar/AvatarComposer';
import PlanView from './ui-kit/components/plan/PlanView';
import AccountView from './ui-kit/components/account/AccountView';
// import ModulesView from './ui-kit/components/modules/ModulesView';
import { ToastProvider } from './ui-kit/components/toaster/ToastProvider';
import OnboardingWizard from './onboarding/OnboardingWizard';
import MNTESTView from './ui-kit/components/MNTEST/MNTESTView';

function AppContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState<string>(() =>
    localStorage.getItem('activeView') || 'getToKnowYou'
  );

  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.uuid) return;
    setIsUnlocked(true);
  }, [user?.uuid]);

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

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

  const renderView = () => {
    switch (activeView) {
      case 'getToKnowYou':
        return (
          <HomeView
            onNavigate={(view: string) => {
              setActiveView(view);
              if (isMobile) setSidebarOpen(false);
            }}
          />
        );
      case 'chat':
        return <ChatView />;
      case 'reflect':
        return <ReflectView />;
      case 'plan':
        return <PlanView />;
      case 'avatar':
        return (
          <AvatarComposer
            uuid={user?.uuid || 'unknown'}
            backendUrl={process.env.REACT_APP_API_URL || 'http://localhost:8010'}
            onSave={(profile) => console.log('✅ Avatar saved:', profile)}
          />
        );
      case 'account':
        return <AccountView />;
      case 'mntest':
        return <MNTESTView />;
      default:
        return <div><h1>Unknown View</h1></div>;
    }
  };

  if (!user) return <SignIn />;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        setActiveView={(view: string) => {
          setActiveView(view);
          if (isMobile) setSidebarOpen(false);
        }}
        isVisible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <MobileHeader
          onToggle={() => {
            if (isMobile) setSidebarOpen(prev => !prev);
          }}
        />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#fafafa'
        }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default function XavigateApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
