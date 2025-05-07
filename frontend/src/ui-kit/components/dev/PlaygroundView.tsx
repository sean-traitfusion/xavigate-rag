import React from "react";
import { Flame, Wand2, Sparkles } from "lucide-react";

export default function PlaygroundView() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🧪 Developer Playground</h1>

      <div className="bg-green-100 text-green-800 p-4 rounded shadow">
        ✅ Tailwind is active, Lucide icons below are rendering.
      </div>

      <div className="flex space-x-4 items-center">
        <Flame className="w-6 h-6 text-red-500" />
        <Wand2 className="w-6 h-6 text-indigo-500" />
        <Sparkles className="w-6 h-6 text-amber-500" />
      </div>

      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        🚀 Test Button
      </button>
    </div>
  );
}