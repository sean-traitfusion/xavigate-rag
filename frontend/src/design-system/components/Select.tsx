import React from 'react';
import { COLORS } from '../theme/colors';
import { SPACING } from '../theme/spacing';
import { FONT_SIZES, FONT_FAMILIES } from '../theme/typography';
import { RADII } from '../theme/radii';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  name?: string;
  id?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  id,
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
  placeholder,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING['1'] }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: FONT_SIZES.sm,
            fontFamily: FONT_FAMILIES.body,
            color: COLORS.neutral[900],
            marginBottom: SPACING['0.5'],
          }}
        >
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: fullWidth ? '100%' : 'auto',
          padding: `${SPACING['2']} ${SPACING['3']}`,
          fontSize: FONT_SIZES.base,
          fontFamily: FONT_FAMILIES.body,
          borderRadius: RADII.sm,
          border: `1px solid ${COLORS.neutral[300]}`,
          backgroundColor: disabled ? COLORS.neutral[100] : COLORS.white,
          color: COLORS.neutral[900],
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
