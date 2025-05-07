import { Button } from '../shared/Button';
import { useAuth } from '../../../context/AuthContext';
import { Bot } from 'lucide-react';

type ChatHeaderProps = {
  avatar: string | null;
  tone?: string;
};

export default function ChatHeader({ avatar, tone }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b bg-gray-50 pl-14 md:pl-6">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-1">
          <Bot size={20} /> Xavigate Assistant
        </h2>
        {avatar && (
          <p className="text-sm text-gray-600">
            Chatting with: <strong>{avatar}</strong>
          </p>
        )}
        {tone && (
          <p className="text-xs text-gray-400">
            Speaking as: <em>{tone}</em>
          </p>
        )}
      </div>

      <Button variant="ghost" className="text-sm text-pink-600 hover:text-pink-800">
        Change
      </Button>
    </div>
  );
}
