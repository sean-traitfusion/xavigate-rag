import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import PlanPreview from '../sidebar/PlanPreview';
import { 
  Home, 
  MessageSquare, 
  Compass, 
  BarChart2, 
  PieChart, 
  BookOpen, 
  User, 
  LogOut,
  LineChart,
  UserCircle,
  Puzzle
} from 'lucide-react';

type SidebarProps = {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView?: string;
};

export default function Sidebar({ setActiveView, isVisible, onClose, activeView }: SidebarProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { 
      id: 'getToKnowYou', 
      label: 'Get to Know You', 
      icon: <Home size={18} className="mr-4 text-blue-500" /> 
    },
    { 
      id: 'chat', 
      label: 'Chat', 
      icon: <MessageSquare size={18} className="mr-4 text-green-500" /> 
    },
    { 
      id: 'reflect', 
      label: 'Reflect', 
      icon: <Compass size={18} className="mr-4 text-purple-500" /> 
    },
    { 
      id: 'plan', 
      label: 'Plan', 
      icon: <PieChart size={18} className="mr-4 text-orange-500" /> 
    },
    { 
      id: 'insights', 
      label: 'Insights', 
      icon: <BarChart2 size={18} className="mr-4 text-yellow-500" /> 
    },
    { 
      id: 'metrics', 
      label: 'Metrics', 
      icon: <LineChart size={18} className="mr-4 text-red-500" /> 
    },
    { 
      id: 'avatar', 
      label: 'Avatar', 
      icon: <UserCircle size={18} className="mr-4 text-indigo-500" /> 
    },
    { 
      id: 'modules', 
      label: 'Modules', 
      icon: <Puzzle size={18} className="mr-4 text-pink-500" /> 
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: <User size={18} className="mr-4 text-cyan-500" /> 
    }
  ];

  if (!isVisible) return null;

  // Use inline styles first to test if changes are visible
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
          color: '#4338ca' // Make title purple to test
        }}>
          <Compass size={20} style={{ marginRight: '12px', color: '#4338ca' }} />
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut size={16} style={{ marginRight: '12px' }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}