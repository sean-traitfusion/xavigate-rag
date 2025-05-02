import { Button } from '../shared/Button';

type ChatHeaderProps = {
  avatar: string | null;
  setAvatarPromptVisible: (value: boolean) => void;
};

export default function ChatHeader({ avatar, setAvatarPromptVisible }: ChatHeaderProps) {
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
      </div>

      <Button
        variant="ghost"
        style={{ fontSize: '0.75rem' }}
        onClick={() => setAvatarPromptVisible(true)}
      >
        Change
      </Button>
    </div>
  );
}