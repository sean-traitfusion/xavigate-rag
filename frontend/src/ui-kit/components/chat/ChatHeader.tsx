import { useAuth } from '../../../context/AuthContext';

type ChatHeaderProps = {
  avatar: string | null;
  tone?: string;
};

export default function ChatHeader({ avatar, tone }: ChatHeaderProps) {
  return (
    <div className="py-4 px-6 border-b bg-gray-50">
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
  );
}
