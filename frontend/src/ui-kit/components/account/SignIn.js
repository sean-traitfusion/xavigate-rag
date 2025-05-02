import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SignIn() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    signIn(username.trim());
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '4rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Enter your name:
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}