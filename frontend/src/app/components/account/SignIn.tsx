import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Button,
  Input,
  Form,
  FormGroup,
  Text,
} from '@/design-system/components';
import { User, ArrowRight, Compass } from 'lucide-react';

const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) return;
    signIn(username.trim());
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch', 
        gap: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        <Compass size={28} color="#3b82f6" />
        <Text variant="h2">Welcome to Xavigate</Text>
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup label="Enter your name:" htmlFor="username">
          <div style={{ position: 'relative', width: '100%' }}>
            <User
              size={16}
              color="#9ca3af"
              style={{
                position: 'absolute',
                top: '50%',
                left: '12px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              style={{
                paddingLeft: '2.25rem',
                height: '40px',
                lineHeight: '1.5',
                width: '100%', 
                boxSizing: 'border-box', 
              }}
              required
            />
          </div>
        </FormGroup>

        <Button
          type="submit"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Begin Your Alignment Journey
          <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Form>

      <Text variant="caption" style={{ textAlign: 'center', color: '#666' }}>
        Discover your natural traits and find your alignment
      </Text>
    </div>
  );
};

export default SignIn;
