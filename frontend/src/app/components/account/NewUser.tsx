console.log("🔧 API_URL:", API_URL);
import { API_URL } from '../../../config';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function NewUser() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/user/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: name.trim() })
      });

      const data = await res.json();

      if (data.status === "ok") {
        console.log("✅ Created user:", name);
        await signIn(name.trim());
        navigate("/app");
      } else {
        setError("❌ Failed to create user.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '4rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '0.75rem',
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
          Create
        </button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'underline' }}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
