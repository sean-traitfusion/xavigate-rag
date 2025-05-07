import { useState, useRef, useEffect } from 'react';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { useAuth } from '../../../context/AuthContext';

type Message = {
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
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
  const [followup, setFollowup] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8010';

  useEffect(() => {
    setUUID(getOrCreateUserUUID());
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("xavigate_chat");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      } catch (e) {
        console.warn("❌ Failed to parse chat session");
      }
    }
  }, [user?.name]);

  useEffect(() => {
    sessionStorage.setItem("xavigate_chat", JSON.stringify(messages));
  }, [messages]);

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

    const traitSummary = user?.traitScores
      ? Object.entries(user.traitScores)
          .map(([trait, score]) => `- ${trait}: ${score.toFixed(2)}`)
          .join('\n')
      : '';

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
          tone: profile?.prompt_framing,
          traitSummary
        })
      });

      const data = await res.json();

      const assistantMessage: Message = {
        sender: 'assistant',
        text: data.answer || "⚠️ No response received from AI.",
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
      console.error('❌ Error fetching response:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "❌ Something went wrong while connecting to the AI.",
          timestamp: getTimestamp()
        }
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded shadow">
      <ChatHeader
        avatar={user?.avatarProfile?.avatar_id || user?.name || null}
        tone={profile?.prompt_framing}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.sender === "user" ? (
              <div className="flex justify-end">
                <div className="bg-indigo-100 text-indigo-900 text-[1rem] leading-[1.8] px-4 py-2 rounded-lg max-w-[60ch]">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="text-[1.125rem] leading-[1.9] max-w-[60ch] text-gray-900 mx-auto px-4">
                {msg.text.split('\n\n').map((para, idx) => (
                  <p key={idx} className="mb-6">{para}</p>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-base text-gray-500">AI is typing...</div>
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