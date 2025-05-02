import { useState, useRef } from 'react';
import { Button } from '../shared/Button';
import theme from '../../theme';

type Reflection = {
  id: number;
  type: 'text' | 'audio';
  content: string;
  emotion?: string;
  timestamp: string;
  editing?: boolean;
};

export default function ReflectView() {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [written, setWritten] = useState('');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const emotions = ['😊', '😐', '😕', '😢', '😡'];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setRecording(true);
    timerRef.current = setInterval(() => {}, 1000);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSubmitText = () => {
    if (!written.trim()) return;
    const reflection: Reflection = {
      id: Date.now(),
      type: 'text',
      content: written.trim(),
      emotion: emotion || undefined,
      timestamp: new Date().toISOString(),
      editing: false
    };
    setReflections(prev => [reflection, ...prev]);
    setWritten('');
  };

  const handleSubmitAudio = () => {
    if (!audioURL) return;
    const reflection: Reflection = {
      id: Date.now(),
      type: 'audio',
      content: audioURL,
      emotion: emotion || undefined,
      timestamp: new Date().toISOString()
    };
    setReflections(prev => [reflection, ...prev]);
    setAudioURL(null);
  };

  const toggleEdit = (id: number) => {
    setReflections(prev =>
      prev.map(r => r.id === id ? { ...r, editing: !r.editing } : r)
    );
  };

  const updateContent = (id: number, newContent: string) => {
    setReflections(prev =>
      prev.map(r => r.id === id ? { ...r, content: newContent } : r)
    );
  };

  const deleteReflection = (id: number) => {
    setReflections(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: theme.fonts.heading, marginBottom: '1rem' }}>Reflect</h2>

      {/* Emotion Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: 'bold' }}>How do you feel?</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          {emotions.map((emo) => (
            <span
              key={emo}
              onClick={() => setEmotion(emo)}
              style={{
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                backgroundColor: emotion === emo ? '#d0ebff' : 'transparent'
              }}
            >
              {emo}
            </span>
          ))}
        </div>
      </div>

      {/* Written Reflection */}
      <section style={{ marginBottom: '3rem' }}>
        <h3>✍️ Written Reflection</h3>
        <textarea
          value={written}
          onChange={(e) => setWritten(e.target.value)}
          placeholder="Write your thoughts here..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        />
        <Button onClick={handleSubmitText}>Submit Written Reflection</Button>
      </section>

      {/* Voice Reflection */}
      <section style={{ marginBottom: '3rem' }}>
        <h3>🎙️ Voice Reflection</h3>
        <div style={{ marginBottom: '1rem' }}>
          {!recording ? (
            <Button onClick={startRecording}>Start Recording</Button>
          ) : (
            <Button onClick={stopRecording} variant="secondary">Stop</Button>
          )}
        </div>

        {audioURL && !recording && (
          <>
            <audio controls src={audioURL} style={{ marginBottom: '1rem' }} />
            <br />
            <Button onClick={handleSubmitAudio}>Submit Voice Reflection</Button>
          </>
        )}
      </section>

      {/* Reflections List */}
      {reflections.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📋 Your Reflections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {reflections.map((r) => (
              <div
                key={r.id}
                style={{
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  position: 'relative'
                }}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  display: hovered === r.id ? 'flex' : 'none',
                  gap: '0.5rem'
                }}>
                  {r.type === 'text' && !r.editing && (
                    <button onClick={() => toggleEdit(r.id)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                  )}
                  <button onClick={() => deleteReflection(r.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  {formatDate(r.timestamp)}
                </div>

                <div><strong>Emotion:</strong> {r.emotion || 'Not selected'}</div>

                {r.type === 'text' && r.editing ? (
                  <>
                    <textarea
                      value={r.content}
                      onChange={(e) => updateContent(r.id, e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '0.5rem',
                        fontSize: '0.9rem',
                        marginTop: '0.5rem'
                      }}
                    />
                    <Button onClick={() => toggleEdit(r.id)} variant="ghost" style={{ marginTop: '0.5rem' }}>Save</Button>
                  </>
                ) : r.type === 'text' ? (
                  <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{r.content}</p>
                ) : (
                  <audio controls src={r.content} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}