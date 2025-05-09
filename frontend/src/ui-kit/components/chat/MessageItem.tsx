// src/ui-kit/components/chat/MessageItem.tsx
import React from 'react';
import { Message } from './types';

type MessageItemProps = {
  message: Message;
  isUser: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isUser }) => {
  if (isUser) {
    return (
      <div 
        className="message-in"
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '24px'
        }}
      >
        <div 
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '16px',
            padding: '12px 16px',
            maxWidth: '75%',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#111827',
            fontFamily: '"Georgia", serif',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(219, 234, 254, 0.8)'
          }}
        >
          {message.text}
        </div>
      </div>
    );
  } else {
    // Improved paragraph processing for better text structure
    const paragraphs = message.text.split('\n\n').filter(p => p.trim() !== '');
    
    // Check for bullet points to style them properly
    const processParagraph = (text: string) => {
      // Handle bullet points - regex for lines starting with "• " or "- "
      if (text.match(/^(•|-)\s/)) {
        return (
          <ul style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '4px' }}>
            {text.split('\n').map((item, i) => {
              // Remove the bullet character and create a list item
              const content = item.replace(/^(•|-)\s/, '');
              return (
                <li key={i} style={{ marginBottom: '6px' }}>
                  {content}
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Handle numbered lists - regex for lines starting with "1. ", "2. " etc.
      if (text.match(/^\d+\.\s/)) {
        return (
          <ol style={{ paddingLeft: '20px', marginTop: '4px', marginBottom: '4px' }}>
            {text.split('\n').map((item, i) => {
              // Remove the number and create a list item
              const content = item.replace(/^\d+\.\s/, '');
              return (
                <li key={i} style={{ marginBottom: '6px' }}>
                  {content}
                </li>
              );
            })}
          </ol>
        );
      }
      
      // Handle regular paragraphs
      return <p>{text}</p>;
    };
    
    return (
      <div 
        className="message-in"
        style={{ 
          marginBottom: '28px',
          paddingLeft: '16px',
          maxWidth: '85%'
        }}
      >
        <div 
          style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: '#111827',
            fontFamily: '"Georgia", serif'
          }}
        >
          {paragraphs.map((paragraph, i) => (
            <div key={i} style={{ 
              marginBottom: i < paragraphs.length - 1 ? '16px' : '0',
              fontSize: paragraph.startsWith('# ') ? '20px' : '16px',
              fontWeight: paragraph.startsWith('# ') ? 'bold' : 'normal'
            }}>
              {processParagraph(paragraph)}
              {message.isTyping && i === paragraphs.length - 1 && (
                <span 
                  style={{ 
                    display: 'inline-block', 
                    width: '8px', 
                    height: '16px', 
                    backgroundColor: '#4B5563',
                    marginLeft: '2px',
                    animation: 'blink 1s infinite'
                  }}
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Sources section with improved styling */}
        {message.sources && message.sources.length > 0 && (
          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '12px 16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ fontWeight: '500', marginBottom: '8px' }}>Sources:</div>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              {message.sources.map((source, index) => (
                <li key={index} style={{ fontSize: '13px', marginBottom: '4px' }}>
                  {source.term || source.id}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
};

export default MessageItem;