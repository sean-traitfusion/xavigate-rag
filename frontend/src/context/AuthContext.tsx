import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type AvatarProfile = {
  avatar_id: string;
  prompt_framing: string;
};

type User = {
  name: string;
  uuid: string;
  avatarProfile?: AvatarProfile;
  onboardingCompleted?: boolean;
};

interface AuthContextType {
  user: User | null;
  signIn: (username: string) => void;
  signOut: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signOut = () => {
    localStorage.removeItem('xavigate_user_uuid');
    setUser(null);
  };

  const signIn = async (username: string) => {
    const uuidKey = 'xavigate_user_uuid';
    const storedUUID = localStorage.getItem(uuidKey);
    const uuid = storedUUID || crypto.randomUUID();

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

    if (!storedUUID) {
      localStorage.setItem(uuidKey, uuid);
      try {
        const res = await fetch(`${API_URL}/persistent-memory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid, preferences: {} }),
        });

        if (!res.ok) {
          console.warn(`⚠️ Backend responded with ${res.status}:`, await res.text());
        }
      } catch (err) {
        console.error('❌ Failed to contact backend:', err);
      }
    }

    setUser({
      name: username || 'Anonymous',
      uuid,
      onboardingCompleted: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
