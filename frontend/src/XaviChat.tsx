import { useState, useRef, useEffect } from 'react';
import ReflectionPanel from "./session/ReflectionPanel";
import AlignmentDashboard from "./session/AlignmentDashboard";
import ReviewPanel from "./session/ReviewPanel";
import SessionInsightPanel from './components/SessionInsightPanel';
import MemoryPanel from './components/MemoryPanel';
import AgentFeedback from './components/AgentFeedback';




function getOrCreateUserUUID(): string {
  const key = "xavigate_user_uuid";
  let uuid = localStorage.getItem(key);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(key, uuid);
  }
  return uuid;
}


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
    sources?: Source[];
    followup?: string;
  };

export default function XaviChat() {
  const [uuid, setUUID] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarPromptVisible, setAvatarPromptVisible] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const [followup, setFollowup] = useState<string | null>(null);
  const [critique, setCritique] = useState<string | null>(null);
  

  useEffect(() => {
    const storedUUID = getOrCreateUserUUID();
    setUUID(storedUUID);
  }, []);

  useEffect(() => {
    if (!uuid) return;
  
    fetch(`${BACKEND_URL}/persistent-memory/${uuid}`)
      .then(res => {
        if (!res.ok) throw new Error("No memory");
        return res.json();
      })
      .then(data => {
        if (data.preferences?.avatar) {
          setAvatar(data.preferences.avatar);
        } else {
          setAvatarPromptVisible(true);
        }
      })
      .catch(() => {
        setAvatarPromptVisible(true);
      });
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;
  
    fetch(`${BACKEND_URL}/session-memory/${uuid}`)
      .then(res => {
        if (!res.ok) throw new Error("No session found");
        return res.json();
      })
      .then(data => {
        if (data?.messages?.length) {
          setMessages(data.messages); // Preload previous conversation
          console.log("🧠 Restored session memory");
        }
      })
      .catch(() => {
        console.log("🧼 No session memory — starting fresh");
      });
  }, [uuid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
  
    try {
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XAVIGATE-KEY': 'supersecuredevkey',
        },
        body: JSON.stringify({
          prompt: input,
          uuid: uuid,
          avatar: avatar || undefined,
        }),
      });
  
      const data = await response.json();
      console.log("💥 /generate full response:", data);
      const assistantMessage: Message = {
        sender: 'assistant',
        text: data.answer,
        sources: data.sources || [],
        followup: data.followup || null,
      };
  
      // Add assistant message to local state
      const updatedMessages = [...messages, userMessage, assistantMessage];
      setMessages(updatedMessages);
      setFollowup(data.followup || null);
      setCritique(data.critique || null);
  
      // ✅ Now save session memory with full message history
      await fetch(`${BACKEND_URL}/session-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid,
          conversation_log: { messages: updatedMessages },
          interim_scores: {}, // You can fill this later with trait analysis
        }),
      });
  
    } catch (error) {
      console.error('Error fetching RAG response:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      {avatar && (
        <div className="mb-4 flex items-center justify-between bg-white px-4 py-2 rounded-lg shadow">
          <span className="text-gray-700 font-medium">
            Chatting with: <span className="font-bold">{avatar}</span>
          </span>
          <button
            className="text-sm text-blue-600 underline hover:text-blue-800"
            onClick={() => setAvatarPromptVisible(true)}
          >
            Change
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto mb-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xl px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-white self-start text-left'
            }`}
          >
            <p className="text-xs font-medium text-gray-400 mb-1">
              {msg.sender === 'user' ? 'You' : 'XaviBot'}
            </p>
            <p className="text-base text-gray-800">{msg.text}</p>
  
            {msg.sources && msg.sources.length > 0 && (
              <ul className="mt-3 text-sm text-gray-500 list-disc list-inside">
                {msg.sources.map((source, i) => (
                  <li key={i}>
                    {source.term?.trim()
                      || source.metadata?.term?.trim()
                      || source.id?.trim()
                      || `Source ${i + 1}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {avatarPromptVisible && (
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <p className="mb-2 text-gray-700">
          To personalize your experience, is there someone you'd like me to sound like?
        </p>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-2"
          type="text"
          placeholder="e.g., Gandhi, Oprah, your mentor..."
          onKeyDown={async (e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const chosen = e.currentTarget.value.trim();
              setAvatar(chosen);
              setAvatarPromptVisible(false);

              await fetch(`${BACKEND_URL}/persistent-memory`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  uuid,
                  preferences: { avatar: chosen }
                }),
              });
            }
          }}
        />
        <p className="text-xs text-gray-500">Press Enter to confirm</p>
      </div>
    )}
  
      <div className="flex items-center">
        <input
          className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm mr-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask something..."
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
        {followup && (
          <button
            onClick={() => setInput(followup)}
            className="ml-3 px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm"
          >
            Suggest Follow-Up
          </button>
        )}
      </div>

      {/* ✨ New Reflection UI */}
      <button onClick={() => setShowReflection(true)}>Start Reflection</button>
      {showReflection && <ReflectionPanel userId={uuid} />}

      {uuid ? (
        <>
          <AlignmentDashboard userId={uuid} />
          <ReviewPanel uuid={uuid} backendUrl={BACKEND_URL} />
          <SessionInsightPanel uuid={uuid} backendUrl={BACKEND_URL} />
          <AgentFeedback critique={critique ?? undefined} followup={followup ?? undefined} />
          <MemoryPanel uuid={uuid} backendUrl={BACKEND_URL} />
        </>
      ) : (
        <div className="text-sm text-gray-500 mt-4">🔄 Loading your session...</div>
      )}

</div>
  );
}