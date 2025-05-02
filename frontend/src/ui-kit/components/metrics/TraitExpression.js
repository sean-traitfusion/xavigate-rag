import React from 'react';

export default function TraitExpression() {
  const traits = [
    { name: 'Visionary', percentage: 80, color: '#6366f1', context: 'Expressed during creative problem-solving' },
    { name: 'Nurturing', percentage: 65, color: '#14b8a6', context: 'High in team collaboration' },
    { name: 'Analytical', percentage: 55, color: '#f59e0b', context: 'Used in decision-making and planning' },
    { name: 'Builder', percentage: 35, color: '#9ca3af', context: 'Under-expressed, potential for growth' }
  ];

  return (
    <div style={{
      marginTop: '2rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      <h2 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '1rem' }}>
        Trait Expression
      </h2>

      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
        Your dominant traits and their current expression levels
      </p>

      {traits.map(trait => (
        <div key={trait.name} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
            <span>{trait.name}</span>
            <span style={{ color: trait.color }}>{trait.percentage}%</span>
          </div>
          <div style={{
            height: '8px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '0.5rem'
          }}>
            <div style={{
              height: '8px',
              backgroundColor: trait.color,
              width: `${trait.percentage}%`
            }}></div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
            {trait.context}
          </div>
        </div>
      ))}

      <div style={{
        backgroundColor: '#eef2ff',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '1.5rem'
      }}>
        <strong style={{ color: '#3730a3', display: 'block', marginBottom: '0.25rem' }}>
          Trait Insight
        </strong>
        <span style={{ fontSize: '0.8rem', color: '#4338ca' }}>
          You thrive when visionary and nurturing traits are combined — look for contexts that integrate both.
        </span>
      </div>
    </div>
  );
}