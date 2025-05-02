import { useEffect, useState } from "react";

type Review = {
  conversation_log: {
    exchanges: { user_prompt: string; assistant_response: string; tags: string[] }[];
    plan_snapshot: {
      avatar_name: string;
      avatar_tone: string;
      target_goal: string;
      emphasize_tags: string[];
      comment_on: string;
      handoff_to_agent?: string | null;
    };
  };
  persistent_memory: any;
};

export default function ReviewPanel({ uuid, backendUrl }: { uuid: string; backendUrl: string }) {
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/review/${uuid}`)
      .then((res) => res.json())
      .then(setReview)
      .catch(() => setReview(null));
  }, [uuid]);

  if (!review) return null;

  const { conversation_log, persistent_memory } = review;
  const plan = conversation_log?.plan_snapshot || {};

  return (
    <div className="mt-6 p-4 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">🧠 Session Review</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-500">🎯 Goal: {plan.target_goal}</p>
        <p className="text-sm text-gray-500">🗣️ Tone: {plan.avatar_tone}</p>
        <p className="text-sm text-gray-500">🏷️ Tags: {plan.emphasize_tags?.join(", ")}</p>
        <p className="text-sm text-gray-500">💬 Comment: {plan.comment_on}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-600">🗂️ Conversation</h3>
        {conversation_log.exchanges?.map((e, i) => (
          <div key={i} className="border border-gray-200 p-3 my-2 rounded text-sm bg-gray-50">
            <p><strong>You:</strong> {e.user_prompt}</p>
            <p><strong>Assistant:</strong> {e.assistant_response}</p>
            <p className="text-xs text-gray-400">Tags: {e.tags.join(", ")}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium text-gray-600">🧾 Persistent Memory</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
          {JSON.stringify(persistent_memory, null, 2)}
        </pre>
      </div>
    </div>
  );
}