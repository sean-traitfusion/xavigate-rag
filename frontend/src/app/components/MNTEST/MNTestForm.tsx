// src/ui-kit/components/MNTEST/MNTestForm.tsx
import React, { useEffect, useState } from "react";
import { QUESTIONS } from "./mnTestItems";
import { useAuth } from "../../../context/AuthContext";

interface MNTestFormProps {
  onComplete: (traitScores: Record<string, number>) => void;
}

const MNTestForm: React.FC<MNTestFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const uuid = user?.uuid;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const trait = currentQuestion.trait;
  const currentAnswer = answers[currentIndex] ?? null;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const traitBuckets: Record<string, number[]> = {};
      QUESTIONS.forEach((q, i) => {
        const score = answers[i];
        if (score === undefined) return;
        if (!traitBuckets[q.trait]) traitBuckets[q.trait] = [];
        traitBuckets[q.trait].push(score);
      });

      const traitScores: Record<string, number> = {};
      Object.entries(traitBuckets).forEach(([trait, values]) => {
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        traitScores[trait] = parseFloat((avg * 2).toFixed(2));
      });

      const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8010";

      if (!uuid) {
        console.error("❌ No user UUID found");
        onComplete(traitScores);
        return;
      }

      fetch(`${BACKEND_URL}/mntest/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, traitScores })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ MNTEST submitted:", data);
          onComplete(traitScores);
        })
        .catch((err) => {
          console.error("❌ Failed to submit MNTEST:", err);
          onComplete(traitScores);
        });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleClear = () => {
    const updated = { ...answers };
    delete updated[currentIndex];
    setAnswers(updated);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (["1", "2", "3", "4", "5"].includes(key)) {
        handleSelect(parseInt(key));
      } else if (key === "Enter" || key === "ArrowRight") {
        handleNext();
      } else if (key === "ArrowLeft") {
        handleBack();
      } else if (key === "Backspace" || key === "Delete") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentAnswer, currentIndex]);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '32px'
      }}>
        Question {currentIndex + 1} of {QUESTIONS.length}
      </h2>

      <div style={{
        minHeight: '120px',
        maxWidth: '640px',
        margin: '0 auto 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{
          fontSize: '20px',
          color: '#1F2937',
          lineHeight: '1.6',
          wordBreak: 'break-word'
        }}>
          {currentQuestion.text}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        paddingTop: '16px',
        marginBottom: '40px'
      }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(n)}
            style={{
              width: '64px',
              height: '64px',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: currentAnswer === n ? '#4F46E5' : '#D1D5DB',
              backgroundColor: currentAnswer === n ? '#4F46E5' : 'transparent',
              color: currentAnswer === n ? 'white' : '#1F2937',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '32px'
      }}>
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          style={{
            padding: '8px 24px',
            backgroundColor: '#E5E7EB',
            color: '#1F2937',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.5 : 1,
            border: 'none'
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          style={{
            padding: '8px 24px',
            backgroundColor: '#4F46E5',
            color: 'white',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: !currentAnswer ? 'not-allowed' : 'pointer',
            opacity: !currentAnswer ? 0.5 : 1,
            border: 'none'
          }}
        >
          {currentIndex === QUESTIONS.length - 1 ? "Submit" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default MNTestForm;
