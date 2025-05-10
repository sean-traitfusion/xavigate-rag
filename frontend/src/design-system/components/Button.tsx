import React from 'react';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { RADII } from '../theme/radii';
import { FONT_FAMILIES, FONT_SIZES } from '../theme/typography';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  style = {},
  className,
}) => {
  const baseStyle: React.CSSProperties = {
    padding: `${SPACING['2']} ${SPACING['4']}`,
    fontSize: FONT_SIZES.base,
    fontFamily: FONT_FAMILIES.body,
    fontWeight: 600,
    borderRadius: RADII.md,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease-in-out',
  };

  const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
    primary: {
      backgroundColor: COLORS.primary[500],
      color: COLORS.white,
    },
    secondary: {
      backgroundColor: COLORS.neutral[200],
      color: COLORS.neutral[900],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: COLORS.primary[500],
      border: `1px solid ${COLORS.primary[500]}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
};

export default Button;
