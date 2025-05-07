import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import LanguageSelector from '../shared/LanguageSelector';
import PlanPreview from '../sidebar/PlanPreview';

import {
  User,
  MessageSquare,
  Mirror,
  Map,
  LineChart,
  BarChart2,
  SmilePlus,
  Puzzle,
  Settings,
  FlaskConical
} from 'lucide-react';

interface SidebarProps {
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView: string;
}

const navItems = [
  { label: "About You", view: "getToKnowYou", icon: User },
  { label: "Chat", view: "chat", icon: MessageSquare },
  { label: "Reflect", view: "reflect", icon: Mirror },
  { label: "Plan", view: "plan", icon: Map },
  { label: "Insights", view: "insights", icon: LineChart },
  { label: "Metrics", view: "metrics", icon: BarChart2 },
  { label: "Avatar Composer", view: "avatar", icon: SmilePlus },
  { label: "Modules", view: "modules", icon: Puzzle },
  { label: "My Account", view: "account", icon: Settings },
  { label: "Playground", view: "playground", icon: FlaskConical }
];

export default function Sidebar({
  setActiveView,
  isVisible,
  onClose,
  activeView
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#f5f5f5",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        height: "100vh",
        boxSizing: "border-box",
        position: isMobile ? "fixed" : "relative",
        top: 0,
        left: isMobile ? (isVisible ? "0px" : "-240px") : "0px",
        transition: "left 0.3s ease-in-out",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none" }}
            >
              ✕
            </button>
          </div>
        )}

        <h3>Xavigate</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {navItems.map(({ label, view, icon: Icon }) => (
            <li
              key={view}
              onClick={() => {
                setActiveView(view);
                if (isMobile) onClose();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                cursor: "pointer",
                fontWeight: view === activeView ? 600 : 400,
                backgroundColor:
                  view === activeView ? "#e0e7ff" : "transparent",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <PlanPreview />
      </div>

      <div>
        {user && (
          <div style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>
            Logged in as <strong>{user.name}</strong>
            <div>
              <button
                onClick={signOut}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.3rem 0.6rem",
                  fontSize: "0.85rem",
                  backgroundColor: "#eee",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
        <LanguageSelector />
      </div>
    </div>
  );
}