import React, { useState, useEffect } from 'react';
import { Button } from '../../ui-kit';
import { H2, P1 } from '../../ui-kit';
import Tag from '../../ui-kit/Tag';
import theme from '../../ui-kit/Theme';
import ModuleRunnerView from './ModuleRunnerView';

const allModules = [
  {
    id: 'burnout',
    name: 'Burnout Recovery',
    description: 'Recover energy and regain focus after prolonged burnout.',
    tag: 'Energy',
    category: 'Health',
    icon: '🔥'
  },
  {
    id: 'career',
    name: 'Career Transition',
    description: 'Navigate job changes and explore aligned opportunities.',
    tag: 'Work',
    category: 'Professional',
    icon: '💼'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Basics',
    description: 'Practice simple daily presence techniques to build mental resilience.',
    tag: 'Wellbeing',
    category: 'Health',
    icon: '🧘'
  },
  {
    id: 'productivity',
    name: 'Productivity Booster',
    description: 'Overcome procrastination and build momentum toward your goals.',
    tag: 'Focus',
    category: 'Professional',
    icon: '🚀'
  },
  {
    id: 'relationships',
    name: 'Relationship Alignment',
    description: 'Understand and shift dynamics in key personal/professional relationships.',
    tag: 'Connection',
    category: 'Personal',
    icon: '🤝'
  }
];

export default function ModulesView() {
  const [installed, setInstalled] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('installedModules');
    if (saved) {
      setInstalled(JSON.parse(saved));
    }
  }, []);

  const toggleModule = (id) => {
    let updated;
    if (installed.includes(id)) {
      updated = installed.filter((m) => m !== id);
      if (activeModuleId === id) setActiveModuleId(null);
    } else {
      updated = [...installed, id];
    }
    setInstalled(updated);
    localStorage.setItem('installedModules', JSON.stringify(updated));
  };

  if (activeModuleId) {
    return (
      <ModuleRunnerView
        selectedModuleId={activeModuleId}
        onExit={() => setActiveModuleId(null)}
      />
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <H2>Modules</H2>
      <P1>Activate add-on experiences to expand your alignment journey.</P1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {allModules.map((mod) => {
          const isInstalled = installed.includes(mod.id);
          return (
            <div key={mod.id} style={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: theme.radius.lg,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontFamily: theme.fonts.heading
                }}>
                  {mod.icon} {mod.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Tag color="accent">{mod.tag}</Tag>
                  {mod.category && <Tag color="complimentary">{mod.category}</Tag>}
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  color: theme.colors.textMedium,
                  fontFamily: theme.fonts.body,
                  marginTop: '0.75rem'
                }}>
                  {mod.description}
                </p>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                {isInstalled ? (
                  <>
                    <Button onClick={() => setActiveModuleId(mod.id)}>Start</Button>
                    <Button onClick={() => toggleModule(mod.id)} variant="secondary">Remove</Button>
                  </>
                ) : (
                  <Button onClick={() => toggleModule(mod.id)}>Install</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}