import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Base API URL for onboarding endpoints
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8010';

// Retrieves or creates a persistent UUID stored in localStorage
const getOrCreateUserUUID = (): string => {
  const KEY = 'xavigate_user_uuid';
  let uuid = localStorage.getItem(KEY);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(KEY, uuid);
  }
  return uuid;
};

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const { user, setUser } = useAuth();
  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>(user?.name || '');
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [thinking, setThinking] = useState<boolean>(false);
  const [traitThemes, setTraitThemes] = useState<Record<string, { confidence: number; notes?: string }>>({});
  const [choice, setChoice] = useState<string | null>(null);
  const [feedbackNote, setFeedbackNote] = useState<string>('');

  // Fetch the next onboarding question
  const fetchNextQuestion = async () => {
    setThinking(true);
    try {
      const res = await fetch(
        `${API_URL}/api/onboarding/next-question?user_id=${getOrCreateUserUUID()}`
      );
      const data = await res.json();
      setQuestion(data.question || '');
    } catch (err) {
      console.warn('Error fetching question', err);
    }
    setThinking(false);
  };

  // When entering the questions stage, immediately load the first question
  useEffect(() => {
    if (step === 1) {
      fetchNextQuestion();
    }
  }, [step]);

  // Submit the user's response and load the next question
  const handleAnswer = async () => {
    if (!response.trim()) return;
    setThinking(true);
    try {
      const res = await fetch(`${API_URL}/api/onboarding/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getOrCreateUserUUID(),
          response
        })
      });
  
      const data = await res.json();
  
      setTraitThemes(data.trait_themes || {});
      setResponse('');
  
      if (data.unlocked) {
        setStep(4); // skip straight to final step if already unlocked
      } else if (data.next_prompt_index + 1 >= data.total_prompts) {
        setStep(2); // go to summary
      } else {
        await fetchNextQuestion();
      }
    } catch (err) {
      console.warn('Error submitting response', err);
    } finally {
      setThinking(false);
    }
  };

  // Step 0: Ask for the user's name
  if (step === 0) {
    return (
      <div>
        <p>What should I call you?</p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name..."
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            setUser && setUser(u => ({ ...u!, name: name.trim() }));
            setStep(1);
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 1: Dynamic onboarding questions
  if (step === 1) {
    if (thinking) {
      return <p>Loading question…</p>;
    }
    if (!question) {
      // No more questions
      return (
        <div>
          <p>All onboarding prompts completed.</p>
          <button onClick={() => setStep(2)}>Continue to Summary</button>
        </div>
      );
    }
    return (
      <div>
        <p>{question}</p>
        <textarea
          rows={3}
          value={response}
          onChange={e => setResponse(e.target.value)}
          disabled={thinking}
        />
        <button
          onClick={handleAnswer}
          disabled={!response.trim() || thinking}
        >
          Submit
        </button>
      </div>
    );
  }

  // Step 2: Summary placeholder
  if (step === 2) {
    const buildSummary = () => {
      const keys = Object.keys(traitThemes);
      if (!keys.length) return "I couldn't discern your core strengths yet.";
      if (keys.length === 1) return `You seem to excel at ${keys[0]}.`;
      if (keys.length === 2) return `You seem to excel at ${keys[0]} and ${keys[1]}.`;
      const last = keys.pop();
      return `You seem to excel at ${keys.join(', ')}, and ${last}.`;
    };
  
    const buildConfidence = () => {
      const vals = Object.values(traitThemes).map(t => t.confidence);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length || 0;
      return Math.round(avg * 100);
    };
  
    return (
      <div className="space-y-4">
        <p className="italic text-gray-700">{buildSummary()}</p>
        <div>
          <label className="text-sm text-gray-600">My confidence:</label>
          <progress value={buildConfidence()} max={100} className="w-full" />
          <span className="text-sm text-gray-600"> {buildConfidence()}%</span>
        </div>
        <div className="flex gap-2">
          {['Don’t agree', 'Agree', 'Strongly agree'].map(opt => (
            <button
              key={opt}
              onClick={() => setChoice(opt)}
              className={choice === opt ? 'font-bold bg-indigo-500 text-white' : 'bg-gray-200'}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="btn mt-2"
          disabled={!choice}
          onClick={() => setStep(choice === 'Strongly agree' ? 4 : 3)}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 3: Feedback placeholder
  if (step === 3) {
    const promptText = choice === 'Don’t agree'
      ? "What is wrong with this description?"
      : "What would make this more accurate?";
  
    return (
      <div className="space-y-4">
        <p>{promptText}</p>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Your feedback..."
          value={feedbackNote}
          onChange={e => setFeedbackNote(e.target.value)}
        />
        <button
          className="btn mt-2"
          disabled={!feedbackNote.trim()}
          onClick={async () => {
            const res = await fetch(`${API_URL}/api/onboarding/feedback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: getOrCreateUserUUID(),
                feedback: feedbackNote,
                confirmation: choice
              })
            });
            const data = await res.json();
            setTraitThemes(data.trait_themes || {});
            setFeedbackNote('');
            setChoice(null);
            setStep(1);
            if (data.next_question) setQuestion(data.next_question);
          }}
        >
          Submit Feedback
        </button>
      </div>
    );
  }

  // Step 4: Finalize onboarding
  if (step === 4) {
    const buildSummary = () => {
      const keys = Object.keys(traitThemes);
      if (!keys.length) return "I couldn't discern your core strengths yet.";
      if (keys.length === 1) return `You seem to excel at ${keys[0]}.`;
      if (keys.length === 2) return `You seem to excel at ${keys[0]} and ${keys[1]}.`;
      const last = keys.pop();
      return `You seem to excel at ${keys.join(', ')}, and ${last}.`;
    };
  
    const buildConfidence = () => {
      const vals = Object.values(traitThemes).map(t => t.confidence);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length || 0;
      return Math.round(avg * 100);
    };
  
    const finalize = async () => {
      const summary = buildSummary();
      const confidence = buildConfidence();
      await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getOrCreateUserUUID(),
          summary,
          confidence,
          confirmation: 'Strongly agree'
        })
      });
      onComplete();
    };
  
    return (
      <div className="space-y-4">
        <h2>Thanks for confirming!</h2>
        <button className="btn" onClick={finalize}>
          Start Exploring
        </button>
      </div>
    );
  }
  return (
    <div>
      <p>Onboarding complete!</p>
      <button onClick={onComplete}>Start Exploring</button>
    </div>
  );
}