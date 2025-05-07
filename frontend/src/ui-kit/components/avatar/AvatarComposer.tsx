import React from 'react';

interface AvatarComposerProps {
  uuid: string;
  backendUrl: string;
  onSave: (profile: any) => void;
}

export default function AvatarComposer({ uuid, backendUrl, onSave }: AvatarComposerProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎭 Avatar Composer</h2>
      <p>This is where you’ll build your avatar. (UUID: {uuid})</p>
    </div>
  );
}