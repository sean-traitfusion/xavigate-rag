import { useEffect, useState } from "react";
import { QUESTIONS } from "./mnTestItems";

interface MNTestFormProps {
  userName: string;
  onComplete: (traitScores: Record<string, number>) => void;
}

export default function MNTestForm({ userName, onComplete }: MNTestFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = answers[currentIndex] ?? null;

  const handleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Group by clean trait name (strip "Nature"/"Intelligence")
      const traitBuckets: Record<string, number[]> = {};
      QUESTIONS.forEach((q, i) => {
        const score = answers[i];
        if (score === undefined) return;

        const cleanTrait = q.trait
          .replace(" Nature", "")
          .replace(" Intelligence", "");

        if (!traitBuckets[cleanTrait]) traitBuckets[cleanTrait] = [];
        traitBuckets[cleanTrait].push(score);
      });

      // Average + normalize (×2)
      const traitScores: Record<string, number> = {};
      Object.entries(traitBuckets).forEach(([trait, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        traitScores[trait] = parseFloat((avg * 2).toFixed(2));
      });

      // POST to backend
      fetch(`http://localhost:8010/api/user/${userName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userName,
          testCompleted: true,
          traitScores
        })
      })
        .then((res) => res.json())
        .then(() => onComplete(traitScores))
        .catch(() => onComplete(traitScores));
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
      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        handleSelect(parseInt(e.key));
      } else if (e.key === "Enter" || e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handleBack();
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentAnswer]);

  return (
    <div className="max-w-3xl mx-auto p-10 bg-white shadow-xl rounded text-center space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Question {currentIndex + 1} of {QUESTIONS.length}
      </h2>

      <div className="min-h-[120px] flex items-center justify-center">
        <p className="text-2xl text-gray-800 leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      <div className="flex justify-center gap-6 pt-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(n)}
            className={`w-16 h-16 text-xl font-semibold rounded-full border-2 transition ${
              currentAnswer === n
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 text-gray-800 hover:bg-gray-100"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-8 text-lg">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="px-6 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          {currentIndex === QUESTIONS.length - 1 ? "Submit" : "→ Next"}
        </button>
      </div>
    </div>
  );
}
