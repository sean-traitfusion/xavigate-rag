import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../src/context/AuthContext';
import { UserPlan } from '../../../types/Plan';

export default function PlanPreview() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);

  useEffect(() => {
    if (!user?.uuid) return;

    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8010'}/persistent-memory/${user.uuid}`)  //check this
      .then(res => res.json())
      .then(data => {
        const snapshot = data?.preferences?.plan_snapshot;
        if (snapshot) setPlan(snapshot);
      });
  }, [user]);

  if (!plan) return null;

  return (
    <div style={{
      marginTop: '2rem',
      backgroundColor: '#f0f4ff',
      padding: '1rem',
      borderRadius: '8px'
    }}>
      <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
        🧭 Current Plan
      </h4>
      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        <strong>Module:</strong> {plan.module}
      </div>
      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        <strong>Focus:</strong> {plan.focus}
      </div>
      <div style={{ fontSize: '0.9rem' }}>
        <strong>Tags:</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
          {plan.tags.map(tag => (
            <span key={tag} style={{
              backgroundColor: '#6366f1',
              color: '#fff',
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}