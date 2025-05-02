import React, { useState } from 'react';

export default function InsightsView() {
  const [expanded, setExpanded] = useState(false);

  const insights = [
    {
      id: 1,
      text: "When you prioritize activities that align with your Visionary and Nurturing traits, your energy increases.",
      date: "April 29",
      source: "Alignment Pattern"
    },
    {
      id: 2,
      text: "You've mentioned 'creative freedom' in 7 reflections. This may be a core value worth naming.",
      date: "April 27",
      source: "Value Mapping"
    },
    {
      id: 3,
      text: "Your mood tends to lift after moments of creative expression. Track this over time.",
      date: "April 26",
      source: "Mood Tracker"
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>📊 Insights</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        These reflections and patterns have emerged from your recent activity.
      </p>

      {(expanded ? insights : insights.slice(0, 1)).map((insight) => (
        <div key={insight.id} style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '1rem',
        }}>
          <p style={{ fontStyle: 'italic' }}>{insight.text}</p>
          <small style={{ color: '#777' }}>
            {insight.date} · {insight.source}
          </small>
        </div>
      ))}

      {!expanded && insights.length > 1 && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Show more insights
        </button>
      )}
    </div>
  );
}
