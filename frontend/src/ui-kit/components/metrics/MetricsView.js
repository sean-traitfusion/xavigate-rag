import React from 'react';
import theme from '../../ui-kit/Theme';
import MetricCard from './MetricCard';
import AlignmentChart from './AlignmentChart';
import TraitExpression from './TraitExpression';

export default function MetricsView() {
  const metrics = [
    {
      id: 'alignment',
      title: 'Alignment Score',
      value: 67,
      color: theme.colors.primary,
      status: 'Flow State',
      change: '+5.2%',
      period: 'this month'
    },
    {
      id: 'awareness',
      title: 'Awareness Quotient',
      value: 82,
      color: theme.colors.accent,
      status: 'Excellent',
      change: '+3.8%',
      period: 'this month'
    },
    {
      id: 'stability',
      title: 'Stability Index',
      value: 67,
      color: theme.colors.complimentary,
      status: 'Moderate',
      change: '+2.1%',
      period: 'this month'
    }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '500', marginBottom: '0.5rem' }}>📈 Metrics</h2>
      <p style={{ color: theme.colors.textMedium, marginBottom: '2rem' }}>
        Your alignment progress and trait expression
      </p>

      {/* Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* SVG Chart */}
      <AlignmentChart />

      {/* Trait Bars */}
      <TraitExpression />
    </div>
  );
}