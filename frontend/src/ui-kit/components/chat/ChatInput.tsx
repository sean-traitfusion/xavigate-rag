import { useState } from 'react';
import { Button } from '../shared/Button';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  followup: string | null;
  setShowReflection: (value: boolean) => void;
};

export default function ChatInput({
  input,
  setInput,
  sendMessage,
  followup,
  setShowReflection
}: ChatInputProps) {
  return (
    <form
      onSubmit={sendMessage}
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem',
        borderTop: '1px solid #eee',
        alignItems: 'center'
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{
          flex: 1,
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '1rem'
        }}
      />
      <Button type="submit" variant="primary">
        Send
      </Button>
      {followup && (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setInput(followup)}
          style={{ fontSize: '0.75rem' }}
        >
          Suggest Follow-Up
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setShowReflection(true)}
        style={{ fontSize: '0.75rem' }}
      >
        Start Reflection
      </Button>
    </form>
  );
}