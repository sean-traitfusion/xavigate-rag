// src/ui-kit/components/chat/RagChatView.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import MessageItem from './MessageItem';
import ThinkingIndicator from './ThinkingIndicator';
import WelcomeScreen from './WelcomeScreen';
import ChatInput from './ChatInput';
import AnimationStyles from './AnimationStyles';
import { Message } from './types';
import { getTimestamp, getOrCreateUserUUID } from './utils';

export default function RagChatView() {
  const { user } = useAuth();
  const profile = user?.avatarProfile;
  const [uuid, setUUID] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatar, setAvatar] = useState('chappelle'); // Avatar selection

  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [followup, setFollowup] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const isInitialLoad = useRef(true);

  const [typingSpeed] = useState(8);
  const [typingChunkSize] = useState(2);
  const [typingVariability] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

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

  // Improved scroll behavior - stops automatic scrolling on page load
  useEffect(() => {
    // Only scroll when a new message is added or typing state changes
    if (messages.length > 0) {
      // For initial load - scroll without animation
      if (isInitialLoad.current) {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
        isInitialLoad.current = false;
      } 
      // For new messages or typing - scroll smoothly
      else if (messages.length > 0) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const typingMessage = messages.find(m => m.isTyping === true);

    if (typingMessage) {
      const fullText = typingMessage.fullText || '';
      const currentText = typingMessage.text || '';

      if (currentText.length < fullText.length) {
        const remainingChars = fullText.length - currentText.length;
        const charsToAdd = Math.min(typingChunkSize, remainingChars);
        const newText = fullText.substring(0, currentText.length + charsToAdd);
        const nextChar = fullText[currentText.length];
        let adjustedSpeed = typingSpeed;

        if (typingVariability && nextChar) {
          if ('.!?'.includes(nextChar)) adjustedSpeed = typingSpeed * 4;
          else if (',;:'.includes(nextChar)) adjustedSpeed = typingSpeed * 2;
          else if (nextChar === ' ' && Math.random() < 0.1) adjustedSpeed = typingSpeed * 1.5;
        }

        const timer = setTimeout(() => {
          setMessages(prev =>
            prev.map(m =>
              m.isTyping ? { ...m, text: newText } : m
            )
          );
        }, adjustedSpeed);

        return () => clearTimeout(timer);
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.isTyping ? { ...m, isTyping: false } : m
          )
        );
      }
    }
  }, [messages, typingSpeed, typingChunkSize, typingVariability]);

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
          avatar, // Use selected avatar from dropdown
          tone: avatar // Also use avatar as tone for now
        })
      });

      const data = await res.json();

      const assistantMessage: Message = {
        sender: 'assistant',
        text: '',
        fullText: data.answer,
        isTyping: true,
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
          conversation_log: {
            messages: [...messages, userMessage, {
              ...assistantMessage,
              text: assistantMessage.fullText,
              isTyping: false
            }]
          },
          interim_scores: {}
        })
      });
    } catch (err) {
      console.error('Error fetching response:', err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: getTimestamp()
      }]);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      document.querySelector('textarea')?.focus();
    }, 100);
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return <WelcomeScreen onSuggestionClick={handleSuggestionClick} />;
    }

    return messages.map((message, index) => (
      <MessageItem
        key={index}
        message={message}
        isUser={message.sender === 'user'}
      />
    ));
  };

  return (
    <>
      <AnimationStyles />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#FAFAFA',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FAFAFA',
          scrollBehavior: 'auto',
          justifyContent: messages.length > 0 ? 'flex-start' : 'flex-end'
        }}>
          {renderMessages()}
          {isTyping && <ThinkingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input with Avatar Selector */}
        <ChatInput
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      </div>
    </>
  );
}