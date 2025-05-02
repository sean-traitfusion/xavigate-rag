import React from 'react';

export default function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      style={{
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        ...props.style
      }}
    >
      {children}
    </label>
  );
}