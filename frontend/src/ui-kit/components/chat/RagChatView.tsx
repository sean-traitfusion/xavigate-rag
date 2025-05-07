import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import AvatarComposer from '../avatar/AvatarComposer';
import { useAuth } from '../../../context/AuthContext';

type Source = {
  term?: string;
  id?: string;
  metadata?: {
    term?: string;
    [key: string]: any;
  };
};

type Message = {
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
  sources?: Source[];
  followup?: string;
};

function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getOrCreateUserUUID(): string {
  const key = 'xavigate_user_uuid';
  let uuid = localStorage.getItem(key);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(key, uuid);
  }
  return uuid;
}

export default function RagChatView() {
  const { user } = useAuth();
  const profile = user?.avatarProfile;
  const [uuid, setUUID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [followup, setFollowup] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8010';

  useEffect(() => {
    setUUID(getOrCreateUserUUID());
  }, []);

  useEffect(() => {
    if (!uuid) return;
    fetch(`${BACKEND_URL}/session-memory/${uuid}`)
      .then(res => res.json())
      .then(data => {
        if (data?.messages?.length) setMessages(data.messages);
      });
  }, [uuid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      sender: 'user',
      text: trimmed,
      timestamp: getTimestamp()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XAVIGATE-KEY': 'supersecuredevkey'
        },
        body: JSON.stringify({
          prompt: trimmed,
          uuid,
          avatar: profile?.avatar_id,
          tone: profile?.prompt_framing
        })
      });

      const data = await res.json();

      const assistantMessage: Message = {
        sender: 'assistant',
        text: data.answer,
        sources: data.sources || [],
        followup: data.followup || null,
        timestamp: getTimestamp()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      await fetch(`${BACKEND_URL}/session-memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid,
          conversation_log: { messages: [...messages, userMessage, assistantMessage] },
          interim_scores: {}
        })
      });
    } catch (err) {
      console.error('Error fetching response:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      <ChatHeader
        avatar={user?.avatarProfile?.avatar_id || user?.name || null}
        tone={user?.avatarProfile?.prompt_framing}
      />

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <MessageList messages={messages} bottomRef={messagesEndRef} />

        {isTyping && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              🤖
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded flex gap-1 items-center text-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse delay-200" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse delay-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        followup={followup}
        setShowReflection={setShowReflection}
      />
    </div>
  );
}