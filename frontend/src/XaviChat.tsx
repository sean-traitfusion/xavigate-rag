import { useState, useRef, useEffect } from 'react';

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
  };

export default function XaviChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        sender: 'assistant',
        text: data.answer,
        sources: data.sources || [],
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching RAG response:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
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
      </div>
    </div>
  );
}