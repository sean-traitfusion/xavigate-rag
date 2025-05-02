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

  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010'; //check this

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)'
    }}>
      {/* Header */}
      <ChatHeader
        avatar={user?.avatarProfile?.avatar_id || user?.name || null}
        tone={user?.avatarProfile?.prompt_framing}
      />

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <MessageList messages={messages} bottomRef={messagesEndRef} />

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>🤖</div>
            <div style={{
              backgroundColor: '#f4f4f4',
              padding: '0.75rem',
              borderRadius: '8px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              fontSize: '1.25rem'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666', animation: 'blink 1s infinite alternate', animationDelay: '0s' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666', animation: 'blink 1s infinite alternate', animationDelay: '0.2s' }} />
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#666', animation: 'blink 1s infinite alternate', animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        followup={followup}
        setShowReflection={setShowReflection}
      />
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '0.5rem', padding: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button type="submit" style={{
          padding: '0.5rem 1rem',
          border: 'none',
          background: '#1976d2',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Send
        </button>
      </form>
    </div>
  );
}