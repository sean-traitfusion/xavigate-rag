import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../ui-kit/Button';
import { H2, P1 } from '../../ui-kit/Typography';
import Input from '../../ui-kit/Input';
import Label from '../../ui-kit/Label';
import Card from '../../ui-kit/Card';
import theme from '../../ui-kit/Theme';

function AccountView() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('✅ Saved name:', name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <H2>My Account</H2>
      <P1>Manage your name, avatar, preferences, and settings.</P1>

      <Card>
        <div style={{ marginBottom: '1.5rem' }}>
          <Label>Display Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} style={{ marginBottom: '1.5rem' }}>
          Save Name
        </Button>

        {saved && (
          <div style={{ fontSize: '0.85rem', color: theme.colors.accent, marginBottom: '1.5rem' }}>
            ✅ Saved!
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <strong>Avatar Tone:</strong><br />
          <span style={{ fontSize: '0.95rem', color: theme.colors.textDark }}>
            (Coming from Avatar Composer)
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <strong>Language:</strong> English<br />
          <strong>Theme:</strong> Light
        </div>

        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </Card>
    </div>
  );
}

export default AccountView;