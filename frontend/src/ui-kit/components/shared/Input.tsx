import React from 'react';

export default function Input({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        padding: '0.5rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        ...props.style
      }}
    />
  );
}