import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../shared/Button';
import { H2, P1 } from '../shared/Typography';
import Input from '../shared/Input';
import Label from '../shared/Label';
import {Card} from '../shared/Card';
import theme from '../../Theme';
import { useToast } from '../toaster/useToast';
import { useEffect } from 'react';

export default function AccountView() {
  const { user, setUser, signOut } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uuid) return;
  
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8010'}/persistent-memory/${user.uuid}`)  //check this
      .then(res => res.json())
      .then(data => {
        const storedName = data?.preferences?.display_name;
        if (storedName) setName(storedName);
      })
      .catch(() => console.warn('⚠️ Failed to load display name from memory'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    if (!user?.uuid) return;
  
    const payload = {
      uuid: user.uuid,
      preferences: {
        display_name: name
      }
    };
  
    await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8010'}/persistent-memory`, {  //check this
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  
    // ✅ Update the global user state
    setUser({ ...user, name });
  
    showToast('✅ Name saved!');
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading account settings...</p>
      </div>
    );
  }

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