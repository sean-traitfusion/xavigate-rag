import React, { CSSProperties, ButtonHTMLAttributes } from 'react';
import theme from '../../Theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: CSSProperties;
  children: React.ReactNode;
}

export function Button({ children, variant = 'primary', style = {}, ...props }: ButtonProps) {
  const base: CSSProperties = {
    padding: '0.6rem 1.2rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    border: 'none',
    fontFamily: theme.fonts.heading
  };

  const variants: Record<string, CSSProperties> = {
    primary: {
      backgroundColor: theme.colors.accent,
      color: theme.colors.textLight
    },
    secondary: {
      backgroundColor: '#eee',
      color: theme.colors.textDark,
      border: '1px solid #ccc'
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.accent,
      border: `1px solid ${theme.colors.accent}`
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.accent,
      border: 'none'
    }
  };

  return (
    <button style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}