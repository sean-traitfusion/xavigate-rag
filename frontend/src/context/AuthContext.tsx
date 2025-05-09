import React, { createContext, useContext, useState, ReactNode } from 'react';

type AvatarProfile = {
  avatar_id: string;
  prompt_framing: string;
};

type User = {
  name: string;
  uuid: string;
  avatarProfile?: AvatarProfile;
  onboardingCompleted?: boolean; // Added to skip onboarding
};

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  signIn: (username: string) => void;
  signOut: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context with an initial undefined value
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
export function AuthProvider({ children }: { children: ReactNode }) {
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

    // Adding onboardingCompleted: true to skip the onboarding process
    setUser({ 
      name: username || 'Anonymous', 
      uuid,
      onboardingCompleted: true
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export both the provider and the hook
export { AuthContext };