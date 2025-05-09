import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  ChevronUp, 
  User, 
  Settings, 
  LogOut, 
  Info, 
  HelpCircle, 
  Shield, 
  FileText 
} from 'lucide-react';

type UserMenuProps = {
  setActiveView: (view: string) => void;
};

export default function UserMenu({ setActiveView }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Handle clicks outside of menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseLeave = () => {
    // Use a small delay before closing the menu to allow the user
    // to move the mouse into the dropdown area
    timeoutRef.current = window.setTimeout(() => {
      setUserMenuOpen(false);
    }, 300); // 300ms delay
  };

  const handleMouseEnter = () => {
    // Clear the timeout if user moves back into the menu area
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div
      ref={menuRef}
      style={{
        padding: '1rem',
        borderTop: '1px solid #eee',
        position: 'relative'
      }}
    >
      <div
        onClick={() => setUserMenuOpen(prev => !prev)}
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

      {/* Enhanced dropdown menu */}
      {userMenuOpen && (
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
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
          }}
        >
          {/* Account Settings Option */}
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
          
          {/* About Xavigate */}
          <div
            onClick={() => {
              navigate('/about');
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
            <Info size={14} style={{ marginRight: '16px', color: '#4f46e5' }} />
            About Xavigate
          </div>
          
          {/* Help Center */}
          <div
            onClick={() => {
              navigate('/help');
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
            <HelpCircle size={14} style={{ marginRight: '16px', color: '#3b82f6' }} />
            Help Center
          </div>
          
          {/* Privacy Policy */}
          <div
            onClick={() => {
              navigate('/privacy');
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
            <Shield size={14} style={{ marginRight: '16px', color: '#10b981' }} />
            Privacy Policy
          </div>
          
          {/* Terms of Service */}
          <div
            onClick={() => {
              navigate('/terms');
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
            <FileText size={14} style={{ marginRight: '16px', color: '#f59e0b' }} />
            Terms of Service
          </div>
          
          {/* Sign Out option */}
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
  );
}