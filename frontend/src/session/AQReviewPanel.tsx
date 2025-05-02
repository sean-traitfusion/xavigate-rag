// frontend/session/AqReviewPanel.tsx
import React, { useState } from "react";

const dimensions = [
  "reflection_depth",
  "action_responsiveness",
  "recalibration_speed",
  "alignment_literacy",
  "self_initiated_behavior",
  "feedback_integration",
  "emotional_regulation",
];

const labels: Record<string, string> = {
  reflection_depth: "How deeply do you reflect?",
  action_responsiveness: "How often do you act on insight?",
  recalibration_speed: "How quickly do you adjust when off?",
  alignment_literacy: "How well do you understand your alignment?",
  self_initiated_behavior: "How often do you align without being prompted?",
  feedback_integration: "How well do you apply feedback?",
  emotional_regulation: "How steady are you in emotional turbulence?",
};

const AqReviewPanel = ({ userId }: { userId: string }) => {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(dimensions.map((d) => [d, 5]))
  );
  const [result, setResult] = useState<{ aq: number; tier: string; message?: string } | null>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/session/aq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, ...scores }),
    });
    const json = await res.json();
    setResult(json);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Alignment Quotient Review</h2>

      {dimensions.map((d) => (
        <div key={d} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {labels[d]}
          </label>
          <input
            type="range"
            min={0}
            max={10}
            value={scores[d]}
            onChange={(e) => setScores({ ...scores, [d]: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-right text-xs text-gray-500">{scores[d]}</div>
        </div>
      ))}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit AQ Self-Assessment
      </button>

      {result && (
        <div className="mt-6 border-t pt-4">
          <p><strong>Your AQ Score:</strong> {result.aq}</p>
          <p><strong>Tier:</strong> {result.tier}</p>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default AqReviewPanel;
