import React from 'react';
import theme from '../../theme';

export default function MetricCard({ metric }) {
  if (!metric || !metric.color) {
    return <div style={{ color: 'red' }}>⚠️ Invalid metric data</div>;
  }

  const arcLength = 283;
  const strokeOffset = arcLength - (arcLength * metric.value / 100);

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: `${metric.color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: metric.color
          }}></div>
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>{metric.title}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={metric.color}
              strokeWidth="10"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeOffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: metric.color
            }}>
              {metric.value}
            </div>
          </div>
        </div>

        <div style={{ marginLeft: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: theme.textMedium }}>Current status:</div>
          <div style={{ fontWeight: '500', color: metric.color }}>{metric.status}</div>
          <div style={{
            fontSize: '0.75rem',
            color: '#16a34a',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
              <path d="M18 15l-6-6-6 6" />
            </svg>
            {metric.change} {metric.period}
          </div>
        </div>
      </div>
    </div>
  );
}