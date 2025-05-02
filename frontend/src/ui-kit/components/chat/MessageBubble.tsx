import { Card } from '../shared/Card';
import { P2 } from '../shared/Typography';

type MessageBubbleProps = {
  text: string;
  timestamp: string;
  sender: 'user' | 'assistant';
};

export default function MessageBubble({ text, timestamp, sender }: MessageBubbleProps) {
  const isUser = sender === 'user';

  return (
    <Card
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? '#e0f7fa' : '#f4f4f4',
        maxWidth: '85%',
        borderRadius: '12px',
        padding: '0.75rem',
        marginBottom: '0.25rem'
      }}
    >
      <P2 style={{ marginBottom: '0.25rem' }}>{text}</P2>
      <span style={{ fontSize: '0.75rem', color: '#888' }}>{timestamp}</span>
    </Card>
  );
}