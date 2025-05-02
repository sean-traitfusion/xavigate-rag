import React, { useState } from 'react';
import './App.css';
import XaviChat from './XaviChat';
import OnboardingWizard from './onboarding/OnboardingWizard'; // adjust if path differs

function App() {
  const [onboarded, setOnboarded] = useState(false);

  return onboarded ? (
    <XaviChat />
  ) : (
    <OnboardingWizard onComplete={() => setOnboarded(true)} />
  );
}

export default App;