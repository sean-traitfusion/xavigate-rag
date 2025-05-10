import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './ui-kit/components/account/SignIn';

import Sidebar from './ui-kit/components/layout/Sidebar';
import MobileHeader from './ui-kit/components/layout/MobileHeader';

import ChatView from './ui-kit/components/chat/RagChatView';
import AvatarComposer from './ui-kit/components/avatar/AvatarComposer';
import AccountView from './ui-kit/components/account/AccountView';
import { ToastProvider } from './ui-kit/components/toaster/ToastProvider';
import MNTESTView from './ui-kit/components/MNTEST/MNTESTView';

import AboutXavigate from './ui-kit/content/AboutXavigate';
import PrivacyPolicy from './ui-kit/content/PrivacyPolicy';
import Terms from './ui-kit/content/Terms';

function ContentLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="content-layout">
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#4338ca',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 12px',
            borderRadius: '6px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ← Back
        </button>
      </div>

      <div style={{
        padding: '16px 0',
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
}

function HelpCenter() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 24px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: 1.6,
      color: '#333'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 600,
        marginBottom: '24px',
        color: '#4338ca'
      }}>
        Help Center
      </h1>
      <p style={{ marginBottom: '16px' }}>
        Welcome to the Xavigate Help Center. Here you'll find resources to help you navigate the platform and get the most out of your experience.
      </p>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 600,
        marginTop: '32px',
        marginBottom: '16px',
        color: '#333'
      }}>
        Getting Started
      </h2>
      <p style={{ marginBottom: '16px' }}>
        If you're new to Xavigate, start with our introductory guide to learn about the platform's key features and how to use them.
      </p>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 600,
        marginTop: '32px',
        marginBottom: '16px',
        color: '#333'
      }}>
        Contact Support
      </h2>
      <p style={{ marginBottom: '16px' }}>
        Need additional help? Our support team is here for you. Email us at support@xavigate.com.
      </p>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState<string>(() =>
    localStorage.getItem('activeView') || 'chat'
  );
  const location = useLocation();
  const isContentPage = ['/about', '/privacy', '/terms', '/help'].includes(location.pathname);

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
      case 'chat':
        return <ChatView />;
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
      {!isContentPage && (
        <Sidebar
          setActiveView={(view: string) => {
            setActiveView(view);
            if (isMobile) setSidebarOpen(false);
          }}
          isVisible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={activeView}
        />
      )}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
      }}>
        {!isContentPage && (
          <MobileHeader
            onToggle={() => {
              if (isMobile) setSidebarOpen(prev => !prev);
            }}
          />
        )}

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: isContentPage ? 0 : '2rem',
          backgroundColor: '#fafafa'
        }}>
          <Routes>
            <Route path="/about" element={
              <ContentLayout>
                <AboutXavigate />
              </ContentLayout>
            } />
            <Route path="/privacy" element={
              <ContentLayout>
                <PrivacyPolicy />
              </ContentLayout>
            } />
            <Route path="/terms" element={
              <ContentLayout>
                <Terms />
              </ContentLayout>
            } />
            <Route path="/help" element={
              <ContentLayout>
                <HelpCenter />
              </ContentLayout>
            } />
            <Route path="*" element={renderView()} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function XavigateApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
