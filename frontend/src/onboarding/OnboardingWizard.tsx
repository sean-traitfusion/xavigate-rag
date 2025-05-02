// frontend/src/onboarding/OnboardingWizard.tsx
import React, { useState } from "react";

const getOrCreateUserUUID = () => {
  const key = "xavigate_user_uuid";
  let uuid = localStorage.getItem(key);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(key, uuid);
  }
  return uuid;
};

// Base URL for API: in development, use backend port; in production, use same origin
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';
const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [traitsUsed, setTraitsUsed] = useState<string[]>([]);
  const [traitsSuppressed, setTraitsSuppressed] = useState<string[]>([]);
  const [support, setSupport] = useState("Sometimes");
  const [blockers, setBlockers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [userId] = useState(() => getOrCreateUserUUID()); 

  const allTraits = [
    "Creative", "Healing", "Entertaining", "Strategic", "Providing",
    "Leading", "Logical", "Organizing", "Discovery"
  ];

  const blockerOptions = [
    "rigid structure", "lack of safety", "unclear expectations",
    "financial pressure", "external control"
  ];

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          traits_used: traitsUsed,
          traits_suppressed: traitsSuppressed,
          environment_support: support,
          environment_blockers: blockers
        })
      });
  
      if (!res.ok) {
        const errorText = await res.text(); // capture actual error from backend
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }
  
      const json = await res.json();
      setResult(json);
      setStep(step + 1);
    } catch (err) {
      console.error("Onboarding failed:", err);
      alert("Something went wrong during onboarding.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xavigate Onboarding</h1>

      {step === 0 && (
        <div>
          <p className="mb-2">What’s your name?</p>
          <input
            className="border p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="mt-4 btn" onClick={() => setStep(1)} disabled={!name}>
            Next
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <p className="mb-2">Which of these traits describe you?</p>
          {allTraits.map((t) => (
            <label key={t} className="block">
              <input
                type="checkbox"
                checked={traitsUsed.includes(t)}
                onChange={() =>
                  setTraitsUsed((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
              /> {t}
            </label>
          ))}
          <button className="mt-4 btn" onClick={() => setStep(2)} disabled={traitsUsed.length === 0}>
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-2">Which feel underused or stifled?</p>
          {allTraits.map((t) => (
            <label key={t} className="block">
              <input
                type="checkbox"
                checked={traitsSuppressed.includes(t)}
                onChange={() =>
                  setTraitsSuppressed((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
              /> {t}
            </label>
          ))}
          <button className="mt-4 btn" onClick={() => setStep(3)}>
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-2">Does your environment support you being yourself?</p>
          {["Yes", "Sometimes", "No"].map((option) => (
            <label key={option} className="block">
              <input
                type="radio"
                checked={support === option}
                onChange={() => setSupport(option)}
              /> {option}
            </label>
          ))}

          <p className="mt-4 mb-2">What gets in the way?</p>
          {blockerOptions.map((b) => (
            <label key={b} className="block">
              <input
                type="checkbox"
                checked={blockers.includes(b)}
                onChange={() =>
                  setBlockers((prev) =>
                    prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
                  )
                }
              /> {b}
            </label>
          ))}

          <button className="mt-4 btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {step === 4 && result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Welcome, {name}!</h2>
          <p>Your baseline quadrant is <strong>{result.quadrant}</strong>.</p>
          <p>Your alignment index (AX) is <strong>{result.ax}</strong>.</p>
          <p className="mt-2">You’re most alive when using:</p>
          <ul className="list-disc ml-6">
            {(result.traits || []).map((t: string) => <li key={t}>{t}</li>)}
          </ul>
          <button
            className="mt-4 btn"
            onClick={onComplete}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard;
