// src/ui-kit/components/chat/ChatInput.tsx
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatAvatarSelector from './ChatAvatarSelector';

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  avatar: string;
  setAvatar: (id: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  sendMessage,
  avatar,
  setAvatar
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const scrollPos = window.scrollY;
    textarea.style.height = '20px';
    textarea.style.height = `${Math.min(Math.max(40, textarea.scrollHeight), 150)}px`;
    window.scrollTo(0, scrollPos);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage(e as any);
    }
  };

  return (
    <div
      style={{
        borderTop: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Input Form */}
      <div style={{ padding: '16px 24px 0' }}>
        <form
          onSubmit={sendMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #C4B5FD',
            borderRadius: '8px', // changed from '9999px' to rectangular
            padding: '8px 16px',
            backgroundColor: '#fff',
            overflow: 'hidden'
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts or ask a question..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '16px',
              lineHeight: '1.5',
              padding: '6px 8px',
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              backgroundColor: 'transparent',
              minHeight: '40px'
            }}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: input.trim() === '' ? 'default' : 'pointer',
              borderRadius: '8px'
            }}
          >
            <Send size={18} color="#8B5CF6" />
          </button>
        </form>
      </div>

      {/* Footer with hint text and avatar selector */}
      <ChatAvatarSelector 
        selectedId={avatar} 
        setSelectedId={setAvatar} 
      />
    </div>
  );
};

export default ChatInput;
