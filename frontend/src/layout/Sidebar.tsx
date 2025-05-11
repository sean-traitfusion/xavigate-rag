import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScreenSize } from '@/layout/useScreenSize';
import UserMenu from './UserMenu';
import { Text } from '@/design-system/components';
import {
  MessageSquare,
  Compass,
  User,
  UserCircle,
  X
} from 'lucide-react';

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { isMobile } = useScreenSize();
  if (!isVisible) return null;

  const navItems = [
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquare size={18} style={{ marginRight: '12px', color: '#10b981' }} />
    },
    {
      id: 'avatar',
      label: 'Avatar',
      icon: <UserCircle size={18} style={{ marginRight: '12px', color: '#6366f1' }} />
    },
    {
      id: 'mntest',
      label: 'MN Profile',
      icon: <User size={18} style={{ marginRight: '12px', color: '#f59e0b' }} />
    }
  ];

  return (
    <div
      style={{
        width: isMobile ? '85%' : '260px',
        minWidth: isMobile ? '240px' : '260px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        padding: '1.5rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div>
        {/* Header with optional close */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <Text variant="subtitle" style={{ display: 'flex', alignItems: 'center', color: '#4338ca', fontWeight: 600 }}>
            <Compass size={20} style={{ marginRight: '0.5rem' }} />
            Xavigate
          </Text>
          {isMobile && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <X size={20} color="#6B7280" />
            </button>
          )}
        </div>

        {/* Navigation */}
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
