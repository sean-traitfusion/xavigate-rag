import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import PlanPreview from '../sidebar/PlanPreview';

const navItems = [
  { id: 'home', label: '🏠 Home' },
  { id: 'chat', label: '💬 Chat' },
  { id: 'reflect', label: '🪞 Reflect' },
  { id: 'plan', label: '🧭 Plan' },
  { id: 'insights', label: '🧠 Insights' },
  { id: 'metrics', label: '📈 Metrics' },
  { id: 'avatar', label: '🎭 Avatar' },
  { id: 'modules', label: '🧩 Modules' },
  { id: 'account', label: '👤 Account' }
];

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { user, signOut } = useAuth();

  if (!isVisible) return null;

  return (
    <div style={{
      width: '240px',
      backgroundColor: '#fff',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{ padding: '1.5rem 1rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>
          Xavigate
        </h2>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              backgroundColor: item.id === activeView ? '#eef2ff' : 'transparent',
              color: item.id === activeView ? '#4338ca' : '#111',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontWeight: item.id === activeView ? 600 : 400,
              fontSize: '0.95rem',
              cursor: 'pointer',
              border: 'none',
              marginBottom: '0.25rem'
            }}
          >
            {item.label}
          </button>
        ))}

        <PlanPreview />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Signed in as <strong>{user?.name || 'Anonymous'}</strong>
        </div>
        <button
          onClick={signOut}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#f87171',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}