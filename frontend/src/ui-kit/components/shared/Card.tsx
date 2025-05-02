export function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          padding: '1rem',
          ...style
        }}
      >
        {children}
      </div>
    );
  }