// src/components/SessionInsightPanel.tsx
import { useEffect, useState } from 'react';

export default function SessionInsightPanel({ uuid, backendUrl }: { uuid: string, backendUrl: string }) {
  const [review, setReview] = useState<any>(null);

  useEffect(() => {
    if (!uuid) return;
    fetch(`${backendUrl}/review/${uuid}`)
      .then(res => res.json())
      .then(data => {
        console.log("🧠 Review response:", data); // ⬅️ Add this
        setReview(data);
      })
      .catch(err => console.error("Review fetch failed", err));
  }, [uuid]);

  if (!review) return <div className="p-4 text-sm text-gray-400">Loading insights...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
      <h2 className="text-lg font-semibold text-gray-800">Session Insight</h2>
      <p><strong>Goal:</strong> {review?.goal || '—'}</p>
      <p><strong>Tone:</strong> {review?.tone || '—'}</p>
      <p><strong>Plan Snapshot:</strong></p>
      <ul className="list-disc pl-6 text-sm text-gray-600">
        {(review.plan || []).map((step: string, i: number) => (
          <li key={i}>{step}</li>
        ))}
      </ul>
      {review?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map((tag: any, i: number) => (
            <span key={i} className={`px-2 py-1 rounded-full text-xs bg-${tag.color || 'gray'}-100 text-${tag.color || 'gray'}-700`}>
              {tag.name} ({tag.percentage}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}