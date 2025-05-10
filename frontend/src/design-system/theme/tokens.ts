export const COLORS = {
    primary: {
      DEFAULT: '#3b82f6',
      light: '#60a5fa',
      softer: '#bae6fd',
    },
    magenta: {
      DEFAULT: '#ec4899',
      light: '#f472b6',
      softer: '#fce7f3',
    },
    purple: {
      DEFAULT: '#8b5cf6',
      light: '#a78bfa',
      softer: '#e9d5ff',
    },
    neutral: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
    },
    dark: '#0f172a',
    gray: '#9ca3af',
    light: '#f9fafb',
    white: '#ffffff',
  } as const;
  
  export const SPACING = {
    sm: '8px',
    md: '16px',
    lg: '24px',
  } as const;
  
  export const RADII = {
    sm: '4px',
    md: '8px',
    full: '9999px',
  } as const;
  
  // ✅ This ensures TypeScript treats this as a module (required under --isolatedModules)
  export {};
  