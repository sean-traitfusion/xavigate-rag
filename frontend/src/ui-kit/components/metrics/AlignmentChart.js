import React from 'react';

export default function AlignmentChart() {
  const timePeriods = ['1D', '1W', '30D', '6M', 'YTD', '2Y', 'Max'];
  const activeTimePeriod = '30D';

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      marginTop: '2rem',
      padding: '1.5rem'
    }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '1rem' }}>
        Alignment Stability Score (ASS)
      </h2>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        <span style={{ color: '#555' }}>Stability Trend</span>
        <span style={{ fontWeight: '600', color: '#6366f1' }}>67/100</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
        {timePeriods.map(period => (
          <div
            key={period}
            style={{
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              backgroundColor: period === activeTimePeriod ? '#e0e7ff' : '#f3f4f6',
              color: period === activeTimePeriod ? '#4338ca' : '#555',
              cursor: 'pointer'
            }}
          >
            {period}
          </div>
        ))}
      </div>

      <div style={{
        height: '200px',
        position: 'relative',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M0,40 L5,45 L10,35 L15,50 L20,45 L25,60 L30,40 L35,50 L40,55 L45,45 L50,50 L55,40 L60,35 L65,45 L70,30 L75,35 L80,25 L85,30 L90,20 L95,25 L100,15"
            stroke="rgba(79, 70, 229, 0.6)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,40 L5,45 L10,35 L15,50 L20,45 L25,60 L30,40 L35,50 L40,55 L45,45 L50,50 L55,40 L60,35 L65,45 L70,30 L75,35 L80,25 L85,30 L90,20 L95,25 L100,15 V100 H0 Z"
            fill="rgba(79, 70, 229, 0.1)"
          />
        </svg>
      </div>

      <div style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', color: '#999' }}>
        <span>Mar 31</span>
        <span>Apr 30</span>
      </div>

      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#555'
      }}>
        <span>30-day trend: <strong style={{ color: '#16a34a' }}>+5.2%</strong></span>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%', marginRight: '0.5rem' }} />
          Current: 67
        </span>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <strong style={{ fontSize: '0.9rem', color: '#444' }}>Tag Correlations</strong>
        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#555' }}>
          <div style={{ marginBottom: '0.25rem' }}>🟢 transition + 🔵 growth → <strong style={{ color: '#4338ca' }}>89%</strong></div>
          <div>🔷 creativity + 🟠 uncertainty → <strong style={{ color: '#4338ca' }}>76%</strong></div>
        </div>
      </div>
    </div>
  );
}