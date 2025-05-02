import { useState } from 'react';
import { Button } from '../shared/Button';
import { useToast } from '../toaster/useToast';
import { useAuth } from '../../../context/AuthContext';

type AvatarComposerProps = {
  uuid: string;
  backendUrl: string;
  onSave?: (profile: { avatar_id: string; prompt_framing: string }) => void;
};

export default function AvatarComposer({ uuid, backendUrl, onSave }: AvatarComposerProps) {
  const [selectedTone, setSelectedTone] = useState('Wise Mentor');
  const { setUser, user } = useAuth();
  const [customDescription, setCustomDescription] = useState('');
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const generatePreview = () => {
    return `This avatar speaks in the tone of a ${selectedTone.toLowerCase()}${
      customDescription ? ` — ${customDescription}` : ''
    }. It reflects your desired guidance style.`;
  };

  const handleSave = async () => {
    const profile = {
      avatar_id: selectedTone,
      prompt_framing: customDescription
    };
  
    const payload = {
      uuid,
      preferences: {
        avatar_profile: profile
      }
    };
  
    try {
      await fetch(`${backendUrl}/persistent-memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      // ✅ Update global context
      if (user) {
        setUser({ ...user, avatarProfile: profile });
      }
  
      // ✅ Trigger any local UI updates
      onSave?.(profile);
  
      showToast('✅ Avatar saved!');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving avatar profile:', err);
      showToast('⚠️ Failed to save avatar');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Avatar Composer</h2>

      <label>Select a tone:</label>
      <select
        value={selectedTone}
        onChange={(e) => setSelectedTone(e.target.value)}
        style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
      >
        <option>Wise Mentor</option>
        <option>Playful Friend</option>
        <option>Stoic Guide</option>
        <option>Poetic Philosopher</option>
        <option>Soul Sister</option>
        <option>Consigliere</option>
      </select>

      <label>Describe your avatar’s voice:</label>
      <textarea
        value={customDescription}
        onChange={(e) => setCustomDescription(e.target.value)}
        style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem' }}
      />

      <div style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem' }}>
        {generatePreview()}
      </div>

      <Button onClick={handleSave}>Save Avatar</Button>

      {saved && <div style={{ marginTop: '1rem', color: 'green' }}>✅ Saved</div>}
    </div>
  );
}