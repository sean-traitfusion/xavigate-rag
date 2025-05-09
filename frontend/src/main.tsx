import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import XavigateApp from './XavigateApp';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <XavigateApp />
    </AuthProvider>
  </React.StrictMode>
);