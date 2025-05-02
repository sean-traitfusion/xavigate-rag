import React from 'react';

export function H2({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111', marginBottom: '0.5rem', ...style }}>
      {children}
    </h2>
  );
}

export function P1({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: '1rem', color: '#333', marginBottom: '1rem', ...style }}>
      {children}
    </p>
  );
}

export function P2({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: '0.875rem', color: '#333', margin: 0, ...style }}>
      {children}
    </p>
  );
}