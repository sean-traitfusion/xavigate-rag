// frontend/session/ReflectionPanel.tsx
import React, { useEffect, useState } from "react";

const getOrCreateUserUUID = () => {
  const key = "xavigate_user_uuid";
  let uuid = localStorage.getItem(key);
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem(key, uuid);
  }
  return uuid;
};


const ReflectionPanel = ({ userId }: { userId: string }) => {
  console.log("🧠 Using userId:", userId);
  const [prompt, setPrompt] = useState("What’s present for you today?");
  const [response, setResponse] = useState("");
  const [sessionSummary, setSessionSummary] = useState<string | null>(null);
  const [ax, setAx] = useState<number | null>(null);
  const [quadrant, setQuadrant] = useState<string | null>(null);

  const submitReflection = async () => {
    try {
      const res = await fetch("/api/session/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, reflection: response })
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Reflection submission failed: ${errorText}`);
        return;
      }
      const json = await res.json();
      setAx(json.new_ax);
      setQuadrant(json.new_quadrant);
      setPrompt(json.next_prompt);
      setSessionSummary(json.summary);
      setResponse("");
    } catch (err: any) {
      console.error("Error submitting reflection:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Reflection Session</h2>

      <p className="mb-4 italic">{prompt}</p>

      <textarea
        className="border p-2 w-full h-24"
        placeholder="Write your thoughts here..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />

      <button
        className="mt-4 btn"
        disabled={!response.trim()}
        onClick={submitReflection}
      >
        Submit Reflection
      </button>

      {sessionSummary && (
        <div className="mt-6 border-t pt-4">
          <p><strong>Session Summary:</strong> {sessionSummary}</p>
          <p><strong>Updated AX:</strong> {ax}</p>
          <p><strong>Quadrant:</strong> {quadrant}</p>
        </div>
      )}
    </div>
  );
};

export default ReflectionPanel;
