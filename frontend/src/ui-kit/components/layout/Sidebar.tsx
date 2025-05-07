import React from 'react';
import { User, LogOut } from 'lucide-react';

interface SidebarProps {
  userName: string | null;
  onSignOut: () => void;
  setActiveView: (view: string) => void;
  activeView: string;
}

const navItems = [
  ["Chat", "chat"],
  ["MN Profile", "mnProfile"],
  ["Avatar", "avatar"],
];

export default function Sidebar({
  userName,
  onSignOut,
  setActiveView,
  activeView,
}: SidebarProps) {
  return (
    <div className="h-screen w-60 bg-gray-100 p-6 flex flex-col justify-between border-r">
      <div>
        <h2 className="text-lg font-bold mb-6">Xavigate</h2>
        <ul className="space-y-3">
          {navItems.map(([label, view]) => (
            <li
              key={view}
              onClick={() => setActiveView(view)}
              className={`cursor-pointer px-3 py-2 rounded hover:bg-indigo-100 ${
                view === activeView ? 'bg-indigo-200 font-semibold' : ''
              }`}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>

      {userName && (
        <div className="text-sm text-gray-600 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} />
            <span>{userName}</span>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 text-red-500 hover:underline text-sm"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}