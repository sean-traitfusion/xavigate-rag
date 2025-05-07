// frontend/src/ui-kit/components/home/GetToKnowYouView.tsx
import React, { useEffect, useState } from 'react';
import OnboardingWizard from '../../../onboarding/OnboardingWizard';
import { useAuth } from '../../../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8010";
const UUID_KEY = "xavigate_user_uuid";

function getUUID() {
  return localStorage.getItem(UUID_KEY) || "unknown";
}

interface GetToKnowYouProps {
  onNavigate?: (view: string) => void;
}

export default function GetToKnowYouView({ onNavigate }: GetToKnowYouProps) {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [traitThemes, setTraitThemes] = useState<Record<string, any>>({});
  const [isReturning, setIsReturning] = useState(false);

  const userId = getUUID();

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/api/onboarding/status?user_id=${userId}`);
    const json = await res.json();
    setIsUnlocked(json.unlocked);
    setTraitThemes(json.trait_themes || {});
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // Track and greet returning users
  useEffect(() => {
    if (isUnlocked) {
      const last = localStorage.getItem('lastVisit');
      if (last) setIsReturning(true);
      localStorage.setItem('lastVisit', new Date().toISOString());
    }
  }, [isUnlocked]);

  if (isUnlocked === false) {
    return <OnboardingWizard onComplete={() => fetchProfile()} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {isReturning && user && (
        <div className="mb-6 p-4 bg-blue-50 rounded text-gray-800">
          <p>Hi {user.name}, welcome back!</p>
          <div className="mt-2 space-x-2">
            <button
              className="btn"
              onClick={() => onNavigate?.('reflect')}
            >
              💭 Reflect
            </button>
            <button
              className="btn"
              onClick={async () => {
                // reset onboarding on backend then reopen wizard
                await fetch(
                  `${API_URL}/api/onboarding/reset?user_id=${userId}`,
                  { method: 'POST' }
                );
                setIsUnlocked(false);
              }}
            >
              🔄 Update Traits
            </button>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">🧭 Your Self-Map</h1>
      <p className="mb-6 text-gray-700">
        Here’s what we’ve picked up so far. You can explore further anytime — the more we learn about you, the more aligned our support will be.
      </p>

      <div className="space-y-3">
        {Object.entries(traitThemes).map(([trait, data]: any) => (
          <div key={trait} className="border p-4 rounded shadow-sm bg-white">
            <h3 className="font-semibold">{trait}</h3>
            <p className="text-sm text-gray-500">
              Confidence: {Math.round(data.confidence * 100)}%<br />
              Notes: {data.notes}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="btn"
          onClick={async () => {
            // reset onboarding on backend then reopen wizard
            await fetch(
              `${API_URL}/api/onboarding/reset?user_id=${userId}`,
              { method: 'POST' }
            );
            setIsUnlocked(false);
          }}
        >
          ✍️ Want to add more?
        </button>
      </div>
    </div>
  );
}