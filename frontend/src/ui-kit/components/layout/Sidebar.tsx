import {
  MessageSquare,
  BarChart2,
  SmilePlus,
  User,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  userName: string | null;
  onSignOut: () => void;
  setActiveView: (view: string) => void;
  activeView: string;
  onClose?: () => void;
  isVisible?: boolean;
}

const navItems = [
  { label: "Chat", view: "chat", icon: <MessageSquare size={18} /> },
  { label: "MN Profile", view: "mnProfile", icon: <BarChart2 size={18} /> },
  { label: "Avatar", view: "avatar", icon: <SmilePlus size={18} /> },
];

export default function Sidebar({
  userName,
  onSignOut,
  setActiveView,
  activeView,
  onClose,
  isVisible
}: SidebarProps) {
  return (
    <div
      className="h-full w-64 bg-gray-100 p-6 flex flex-col justify-between border-r shadow fixed z-50"
      style={{ top: 0, left: 0 }}
    >
      {/* ❌ Mobile close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
      )}

      <div>
        <h2 className="text-xl font-bold mb-6 text-indigo-700 tracking-tight">Xavigate</h2>
        <ul className="space-y-2">
          {navItems.map(({ label, view, icon }) => (
            <li
              key={view}
              onClick={() => {
                setActiveView(view);
                if (onClose) onClose(); // close sidebar on any click
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer transition ${
                view === activeView
                  ? 'bg-indigo-200 font-semibold text-indigo-900'
                  : 'hover:bg-indigo-100 text-gray-800'
              }`}
            >
              {icon}
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      {userName && (
        <div className="text-sm text-gray-600 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} />
            <span className="font-medium">{userName}</span>
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
