import { useAuth } from '../../../context/AuthContext';

type ChatHeaderProps = {
  avatar: string | null;
  tone?: string;
};

export default function ChatHeader({ avatar, tone }: ChatHeaderProps) {
  return (
    <div
      style={{
        padding: '1rem',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fafafa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
          🤖 Xavigate Assistant
        </h2>
        {avatar && (
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
            Chatting with: <strong>{avatar}</strong>
          </p>
        )}
        {tone && (
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>
            Speaking as: <em>{tone}</em>
          </p>
        )}
      </div>

      <button
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#4F46E5',
          fontSize: '0.75rem',
          fontWeight: 500,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Change
      </button>
    </div>
  );
}
