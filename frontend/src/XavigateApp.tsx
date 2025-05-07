import React, { useState, useEffect } from 'react';
import SignIn from './ui-kit/components/account/SignIn';
import Sidebar from './ui-kit/components/layout/Sidebar';
import ChatView from './ui-kit/components/chat/RagChatView';
import MNProfileView from './ui-kit/components/reflect/MNProfileView';
import AvatarComposer from './ui-kit/components/avatar/AvatarComposer';
import MNTestForm from './ui-kit/components/mntest/MNTestForm';

function AppContent() {
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem('xavigate_user'));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState<string>('chat');
  const [traitScores, setTraitScores] = useState<Record<string, number> | null | undefined>(undefined);

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

  useEffect(() => {
    if (activeView === 'mnProfile' && userName) {
      const safeName = userName.toLowerCase().trim();

      fetch(`http://localhost:8010/api/user/${safeName}`)
        .then(async (res) => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data?.traitScores && Object.keys(data.traitScores).length > 0) {
              setTraitScores(data.traitScores);
            } else {
              setTraitScores(null);
            }
          } catch {
            setTraitScores(null);
          }
        })
        .catch(() => {
          setTraitScores(null);
        });
    }
  }, [activeView, userName]);

  const handleSignIn = (name: string) => {
    const cleanName = name.trim().toLowerCase();
    setUserName(cleanName);
    localStorage.setItem('xavigate_user', cleanName);
  };

  const handleSignOut = () => {
    localStorage.removeItem('xavigate_user');
    setUserName(null);
    setTraitScores(undefined);
  };

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatView />;
      case 'mnProfile':
        if (traitScores === undefined) {
          return <p className="text-gray-500">🔄 Loading your MN Profile...</p>;
        }
        if (traitScores === null) {
          return (
            <MNTestForm
              userName={userName!}
              onComplete={(answers) => {
                fetch(`http://localhost:8010/api/user/${userName!}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user: userName,
                    testCompleted: true,
                    traitScores: answers,
                  }),
                })
                  .then((res) => res.json())
                  .then(() => {
                    setTraitScores(answers);
                  })
                  .catch(() => {
                    setTraitScores(answers);
                  });
              }}
            />
          );
        }
        return (
          <MNProfileView
            traitScores={traitScores}
            onAskGPT={(prompt) => {
              fetch("http://localhost:8010/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt }),
              })
                .then(res => res.json())
                .then(data => {
                  alert("AI says:\n\n" + data.reply);
                });
            }}
          />
        );
      case 'avatar':
        return (
          <AvatarComposer
            uuid={userName || 'unknown'}
            backendUrl={import.meta.env.VITE_API_URL || 'http://localhost:8010'}
            onSave={(profile) => console.log('✅ Avatar saved:', profile)}
          />
        );
      default:
        return <div><h1>Unknown View</h1></div>;
    }
  };

  if (!userName) {
    return <SignIn onSubmit={handleSignIn} />;
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Mobile hamburger button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-white shadow p-2 rounded-md border border-gray-200"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:static md:z-10 bg-black/30 md:bg-transparent">
          <Sidebar
            userName={userName}
            setActiveView={setActiveView}
            activeView={activeView}
            onSignOut={handleSignOut}
            isVisible={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50 z-0">{renderView()}</div>
    </div>
  );
}

export default function XavigateApp() {
  return <AppContent />;
}
