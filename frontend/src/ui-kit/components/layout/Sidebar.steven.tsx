// src/ui-kit/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PlanPreview from '../sidebar/PlanPreview';
import {
  Home,
  MessageSquare,
  Compass,
  User,
  LogOut,
  UserCircle,
  Settings,
  ChevronUp
} from 'lucide-react';

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'getToKnowYou',
      label: 'Get to Know You',
      icon: <Home size={18} style={{ marginRight: '16px', color: '#3b82f6' }} />
    },
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

        <PlanPreview />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #eee', position: 'relative' }}>
        <div
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            fontSize: '0.85rem',
            padding: '0.5rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: userMenuOpen ? '#f3f4f6' : 'transparent',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <User size={14} style={{ marginRight: '16px' }} />
            <strong>{user?.name || 'Anonymous'}</strong>
          </div>
          <ChevronUp size={14} style={{
            transform: userMenuOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease'
          }} />
        </div>

        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '1rem',
            right: '1rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '0.5rem',
            overflow: 'hidden',
            border: '1px solid #e5e7eb'
          }}>
            <div
              onClick={() => {
                setActiveView('account');
                setUserMenuOpen(false);
              }}
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '0.85rem'
              }}
            >
              <Settings size={14} style={{ marginRight: '16px' }} />
              Account Settings
            </div>
            <div
              onClick={() => {
                signOut();
                setUserMenuOpen(false);
              }}
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                color: '#f43f5e',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <LogOut size={14} style={{ marginRight: '16px' }} />
              Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
