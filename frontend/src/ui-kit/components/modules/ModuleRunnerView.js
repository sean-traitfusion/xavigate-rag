import React, { useState } from 'react';
import { Button } from '../shared/Button';

const moduleData = {
  burnout: {
    name: 'Burnout Recovery',
    description: 'A 5-step experience to help you recover energy and rebuild momentum.',
    steps: [
      'What are your current signs of burnout or exhaustion?',
      'Which habits or situations are draining your energy the most?',
      'What helps you reset mentally or physically?',
      'What boundaries or adjustments do you need to make?',
      'How can you rebuild in a more aligned and sustainable way?'
    ]
  },
  career: {
    name: 'Career Transition',
    description: 'Navigate job change and explore aligned opportunities.',
    steps: [
      'What’s making you question your current work?',
      'What kind of work would feel more aligned to you?',
      'What skills or experiences could support that shift?',
      'Who can you talk to for perspective or support?',
      'What is one small step you could take right now?'
    ]
  }
};

export default function ModuleRunnerView({ selectedModuleId, onExit }) {
  const module = moduleData[selectedModuleId];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(module.steps.length).fill(''));

  const handleChange = (e) => {
    const updated = [...answers];
    updated[step] = e.target.value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (step < module.steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers(Array(module.steps.length).fill(''));
  };

  if (!module) return <div>Module not found.</div>;

  const isComplete = step === module.steps.length - 1 && answers[step].trim();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>{module.name}</h2>
      <p style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>{module.description}</p>

      <div style={{ marginBottom: '1rem', fontWeight: 600 }}>
        Step {step + 1} of {module.steps.length}
      </div>

      <div style={{
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          {module.steps[step]}
        </p>
        <textarea
          value={answers[step]}
          onChange={handleChange}
          placeholder="Write your thoughts here..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '0.95rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {step > 0 && (
          <Button onClick={handleBack} variant="secondary">← Back</Button>
        )}
        {!isComplete && (
          <Button onClick={handleNext} disabled={!answers[step].trim()}>
            Next →
          </Button>
        )}
        {isComplete && (
          <Button onClick={handleRestart} variant="outline">
            Restart Module
          </Button>
        )}
        <Button onClick={onExit} variant="ghost">
          Exit
        </Button>
      </div>

      {/* Optional: Display saved answers below (MVP style) */}
      <div style={{ marginTop: '3rem' }}>
        <h4>📝 Your Reflections</h4>
        <ol style={{ paddingLeft: '1.25rem', marginTop: '1rem' }}>
          {answers.map((ans, i) => (
            ans.trim() && (
              <li key={i} style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <strong>{module.steps[i]}</strong>
                <p style={{ margin: 0 }}>{ans}</p>
              </li>
            )
          ))}
        </ol>
      </div>
    </div>
  );
}