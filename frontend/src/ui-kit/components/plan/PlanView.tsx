import React, { useEffect, useState } from 'react';
import { H2, P1 } from '../../../ui-kit/components/shared/Typography';
import theme from '../../../../src/ui-kit/Theme';
import { useAuth } from '../../../context/AuthContext';
import { UserPlan } from '../../../../src/types/Plan';
import { Button } from '../../components/shared/Button';

const fallbackPlan: UserPlan = {
  module: 'Reflect: Creative Freedom',
  focus: 'Clarity on direction',
  tags: ['transition', 'growth', 'uncertainty']
};

export default function PlanView() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);

  useEffect(() => {
    if (!user?.uuid) return;

    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8010'}/persistent-memory/${user.uuid}`)  //check this
      .then(res => res.json())
      .then(data => {
        const snapshot = data?.preferences?.plan_snapshot;
        setPlan(snapshot || fallbackPlan);
      })
      .catch(() => setPlan(fallbackPlan));
  }, [user]);

  if (!plan) return <div>Loading plan...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <H2>Current Plan</H2>
      <P1>You're currently working on the following focus area.</P1>

      <form
  onSubmit={async (e) => {
    e.preventDefault();
    if (!user?.uuid || !plan) return;

    const payload = {
      uuid: user.uuid,
      preferences: {
        plan_snapshot: plan
      }
    };

    await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/persistent-memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert('✅ Plan updated!');
  }}
>
  <div style={{ marginBottom: '1rem' }}>
    <label><strong>Module:</strong></label><br />
    <input
      type="text"
      value={plan.module}
      onChange={(e) => setPlan({ ...plan, module: e.target.value })}
      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
    />
  </div>

  <div style={{ marginBottom: '1rem' }}>
    <label><strong>Focus:</strong></label><br />
    <input
      type="text"
      value={plan.focus}
      onChange={(e) => setPlan({ ...plan, focus: e.target.value })}
      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
    />
  </div>

  <div style={{ marginBottom: '1rem' }}>
    <label><strong>Tags (comma-separated):</strong></label><br />
    <input
      type="text"
      value={plan.tags.join(', ')}
      onChange={(e) =>
        setPlan({
          ...plan,
          tags: e.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
        })
      }
      style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
    />
  </div>

  <Button type="submit">Save Plan</Button>
</form>
    </div>
  );
}