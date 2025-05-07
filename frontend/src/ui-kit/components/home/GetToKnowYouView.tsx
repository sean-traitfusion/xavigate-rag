import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8010";
const UUID_KEY = "xavigate_user_uuid";

function getUUID() {
  return localStorage.getItem(UUID_KEY) || "unknown";
}

interface GetToKnowYouProps {
  onNavigate?: (view: string) => void;
}

export default function GetToKnowYouView({ onNavigate }: GetToKnowYouProps) {
  const { user } = useAuth();
  const [traitThemes, setTraitThemes] = useState<Record<string, any>>({});
  const [isReturning, setIsReturning] = useState(false);

  const userId = getUUID();

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/${userId}`);
      const json = await res.json();
      setTraitThemes(json.trait_themes || {});
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    const last = localStorage.getItem('lastVisit');
    if (last) setIsReturning(true);
    localStorage.setItem('lastVisit', new Date().toISOString());
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {isReturning && user && (
        <div className="mb-6 p-4 bg-blue-50 rounded text-gray-800">
          <p>Hi {user.name}, welcome back!</p>
          <div className="mt-2 space-x-2">
            <button className="btn" onClick={() => onNavigate?.('reflect')}>
              💭 Reflect
            </button>
            <button className="btn" onClick={() => fetchProfile()}>
              🔄 Refresh
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
    </div>
  );
}