import React from 'react';
import { COLORS, SPACING, RADII } from '../theme/tokens';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({
  type = 'text',
  disabled = false,
  style = {},
  onFocus,
  onBlur,
  ...rest
}) => {
  return (
    <input
      type={type}
      disabled={disabled}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = COLORS.primary.DEFAULT;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = COLORS.neutral[300];
        onBlur?.(e);
      }}
      style={{
        width: '100%',
        padding: `${SPACING.sm} ${SPACING.md}`,
        fontSize: '14px',
        borderRadius: RADII.md,
        border: `1px solid ${COLORS.neutral[300]}`,
        backgroundColor: disabled ? COLORS.neutral[100] : COLORS.white,
        color: COLORS.dark,
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out',
        ...style,
      }}
      {...rest}
    />
  );
};

export default Input;
