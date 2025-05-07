import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

interface SidebarProps {
  userName: string | null;
  setActiveView: (view: string) => void;
  isVisible: boolean;
  onClose: () => void;
  activeView: string;
}

const navItems = [
  ["About You", "getToKnowYou"],
  ["Chat", "chat"],
  ["Reflect", "reflect"],
  ["Plan", "plan"],
  ["Avatar Composer", "avatar"],
  ["Account", "account"],
  ["Playground", "playground"],
];

export default function Sidebar({
  userName,
  setActiveView,
  isVisible,
  onClose,
  activeView,
}: SidebarProps) {
  const [showMenu, setShowMenu] = useState(false);
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
            <button onClick={onClose} style={{ background: "none", border: "none" }}>
              ✕
            </button>
          </div>
        )}

        <h3 className="font-semibold text-lg mb-4">Xavigate</h3>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {navItems.map(([label, view]) => (
            <li
              key={view}
              onClick={() => {
                setActiveView(view);
                if (isMobile) onClose();
              }}
              style={{
                marginBottom: "0.75rem",
                cursor: "pointer",
                fontWeight: view === activeView ? 600 : 400,
                backgroundColor: view === activeView ? "#e0e7ff" : "transparent",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {userName && (
        <div className="relative mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(prev => !prev);
            }}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition"
          >
            <User size={16} />
            <span>{userName}</span>
            <ChevronDown size={14} />
          </button>

          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-50"
            >
              <button
                onClick={() => {
                  localStorage.removeItem('xavigate_user');
                  window.location.reload();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}