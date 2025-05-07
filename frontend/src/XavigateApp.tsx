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
      console.log("🔍 Fetching profile for:", safeName);

      fetch(`http://localhost:8010/api/user/${safeName}`)
        .then(async (res) => {
          const text = await res.text();
          console.log("📦 Raw response text:", text);

          try {
            const data = JSON.parse(text);
            console.log("🧠 Parsed user data:", data);

            if (data?.traitScores && Object.keys(data.traitScores).length > 0) {
              console.log("✅ Valid traitScores found");
              setTraitScores(data.traitScores);
            } else {
              console.warn("⚠️ traitScores missing or empty:", data);
              setTraitScores(null);
            }
          } catch (err) {
            console.error("❌ Failed to parse JSON:", err);
            setTraitScores(null);
          }
        })
        .catch((err) => {
          console.error("❌ Fetch error:", err);
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
                  .then((res) => {
                    console.log("✅ Saved to backend:", res);
                    setTraitScores(answers);
                  })
                  .catch((err) => {
                    console.error("❌ Failed to save:", err);
                    setTraitScores(answers);
                  });
              }}
            />
          );
        }

        console.log("✅ Rendering MNProfileView for", userName, traitScores);
        return (
          <MNProfileView
            traitScores={traitScores}
            onAskGPT={(prompt) => console.log('ask:', prompt)}
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userName={userName}
        setActiveView={setActiveView}
        activeView={activeView}
        onSignOut={handleSignOut}
        isVisible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
        {renderView()}
      </div>
    </div>
  );
}

export default function XavigateApp() {
  return <AppContent />;
}
