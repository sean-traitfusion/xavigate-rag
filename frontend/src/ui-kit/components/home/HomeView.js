import React, { useState } from 'react';

export default function HomeView() {
  const [energyLevel, setEnergyLevel] = useState(65);
  const [insightExpanded, setInsightExpanded] = useState(false);

  const recentInsights = [
    {
      id: 1,
      text: "When you prioritize activities that align with your Visionary and Nurturing traits, your energy increases.",
      date: "April 29",
      source: "Alignment Pattern"
    },
    {
      id: 2,
      text: "You've mentioned 'creative freedom' 7 times. Seems important.",
      date: "April 27",
      source: "Value Mapping"
    }
  ];

  return (
    <div>
      <h1>🏠 Home View</h1>

      {/* Energy Slider */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>How's your energy today?</h3>
        <div>
          {energyLevel < 40 ? '😴 Low' : energyLevel < 70 ? '🌊 Flow' : '⚡ High'}
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Recent Insights */}
      <div>
        <h3>Recent Insights</h3>
        {(insightExpanded ? recentInsights : recentInsights.slice(0, 1)).map(insight => (
          <div key={insight.id} style={{
            background: '#f1f1f1',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}>
            <p>{insight.text}</p>
            <small>{insight.date} · {insight.source}</small>
          </div>
        ))}

        {!insightExpanded && recentInsights.length > 1 && (
          <button onClick={() => setInsightExpanded(true)}>
            Show more insights
          </button>
        )}
      </div>
    </div>
  );
}
