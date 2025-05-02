import React from 'react';
import { ThumbsUp } from 'lucide-react';

export default function InsightCard({ insight }) {
  return (
    <div className="insight-item">
      <div className="insight-indicator"></div>
      <div className="insight-content">
        <p>{insight.text}</p>
        <div className="insight-meta">
          <div>{insight.date} · {insight.source}</div>
          <button><ThumbsUp size={14} /></button>
        </div>
      </div>
    </div>
  );
}
