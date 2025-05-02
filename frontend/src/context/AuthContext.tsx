import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user type (expand later)
type User = {
  name: string;
  uuid: string;
};

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  signIn: (username: string) => void;
  signOut: () => void;
}

// Create the context with an initial null value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing the context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signOut = () => {
    localStorage.removeItem('xavigate_user_uuid');
    setUser(null);
  };

  const signIn = async (username: string) => {
    const storedUUID = localStorage.getItem('xavigate_user_uuid');
    const uuid = storedUUID || crypto.randomUUID();

    if (!storedUUID) {
      localStorage.setItem('xavigate_user_uuid', uuid);
      try {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/persistent-memory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid, preferences: {} })
        });
      } catch (err) {
        console.warn('⚠️ Failed to initialize persistent memory:', err);
      }
    }

    setUser({ name: username || 'Anonymous', uuid });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}