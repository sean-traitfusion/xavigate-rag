import { useEffect, useState } from 'react';

export default function MemoryPanel({ uuid, backendUrl }: { uuid: string, backendUrl: string }) {
  const [session, setSession] = useState(null);
  const [persistent, setPersistent] = useState(null);

  useEffect(() => {
    if (!uuid) return;
  
    fetch(`${backendUrl}/session-memory/${uuid}`)
      .then(res => res.json())
      .then(data => {
        console.log("🧠 Session memory:", data);
        setSession(data);
      });
  
    fetch(`${backendUrl}/persistent-memory/${uuid}`)
      .then(res => res.json())
      .then(data => {
        console.log("💾 Persistent memory:", data);
        setPersistent(data);
      });
  }, [uuid]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold text-gray-700 mb-2">Memory Snapshot</h2>
      <div className="mb-4">
        <h3 className="font-semibold text-sm text-gray-500">Persistent Memory</h3>
        <pre className="text-xs text-gray-800 whitespace-pre-wrap">{JSON.stringify(persistent, null, 2)}</pre>
      </div>
      <div>
        <h3 className="font-semibold text-sm text-gray-500">Session Memory</h3>
        <pre className="text-xs text-gray-800 whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  );
}