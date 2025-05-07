import React, { useState } from 'react';

interface SignInProps {
  onSubmit: (name: string) => void;
}

export default function SignIn({ onSubmit }: SignInProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 max-w-sm w-full space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">What’s Your Username?</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your name"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          Continue
        </button>

        <p className="text-sm text-center text-gray-500">
          New user? Just enter your name to get started.
        </p>
      </form>
    </div>
  );
}