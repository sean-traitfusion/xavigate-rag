import React, { useState } from 'react';

export default function NewUser() {
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Failed to create user');
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setSuccess(false);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full space-y-4">
        <h1 className="text-xl font-semibold text-gray-800">Create New User</h1>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full border border-gray-300 px-4 py-2 rounded text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Create
        </button>

        {success && <p className="text-green-600 text-sm">✅ User created successfully</p>}
        {error && <p className="text-red-500 text-sm">❌ {error}</p>}
      </div>
    </div>
  );
}