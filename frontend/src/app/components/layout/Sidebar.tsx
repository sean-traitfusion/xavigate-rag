import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import UserMenu from '../layout/UserMenu';
import {
  MessageSquare,
  Compass,
  User,
  UserCircle
} from 'lucide-react';

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { user } = useAuth();

  const navItems = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquare size={18} style={{ marginRight: '16px', color: '#10b981' }} />
    },
    {
      id: 'avatar',
      label: 'Avatar',
      icon: <UserCircle size={18} style={{ marginRight: '16px', color: '#6366f1' }} />
    },
    {
      id: 'mntest',
      label: 'MN Profile',
      icon: <User size={18} style={{ marginRight: '16px', color: '#f59e0b' }} />
    }
  ];

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
        <h2 style={{
          marginBottom: '1rem',
          fontSize: '1.25rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          color: '#4338ca'
        }}>
          <Compass size={20} style={{ marginRight: '16px', color: '#4338ca' }} />
          Xavigate
        </h2>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
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
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <UserMenu setActiveView={setActiveView} />
    </div>
  );
}
