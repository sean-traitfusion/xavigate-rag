// src/design-system/components/Card.tsx

import React from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';

type CardVariant = 'outlined' | 'filled';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof SPACING;
  borderRadius?: keyof typeof RADII;
  variant?: CardVariant;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  borderRadius = 'md',
  variant = 'outlined',
  onClick,
}) => {
  const baseStyles: React.CSSProperties = {
    padding: SPACING[padding],
    borderRadius: RADII[borderRadius],
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 150ms ease',
  };

  const variants: Record<CardVariant, React.CSSProperties> = {
    outlined: {
      backgroundColor: '#FFFFFF',
      boxShadow: 'none',
      border: `1px solid ${COLORS.neutral[200]}`,
    },
    filled: {
      backgroundColor: COLORS.neutral[100],
      boxShadow: 'none',
      border: 'none',
    },
  };

  return (
    <div style={{ ...baseStyles, ...variants[variant] }} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
