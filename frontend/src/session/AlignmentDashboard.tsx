// frontend/session/AlignmentDashboard.tsx
import React, { useEffect, useState } from "react";

const AlignmentDashboard = ({ userId }: { userId: string }) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then(setProfile)
      .catch((err) => console.error("Failed to load user profile", err));
  }, [userId]);

  if (!profile) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Alignment Dashboard</h2>

      <div className="mb-4">
        <p><strong>AX:</strong> {profile.baseline_ax}</p>
        <p><strong>AQ:</strong> {profile.baseline_aq}</p>
        <p><strong>ASS:</strong> {profile.ass}</p>
        <p><strong>Quadrant:</strong> {profile.quadrant_history?.slice(-1)[0]}</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Active Tags:</p>
        <ul className="list-disc list-inside">
          {profile.alignment_tags?.map((tag: any) => (
            <li key={tag.tag_id}>
              <span className="font-medium">{tag.tag_id}</span> — {tag.category}, priority {tag.priority_level}
            </li>
          )) || <li>None</li>}
        </ul>
      </div>

      <div className="mb-4">
        <p className="font-semibold">Traits Used:</p>
        <p>{profile.dominant_traits?.join(", ") || "None"}</p>

        <p className="mt-2 font-semibold">Traits Suppressed:</p>
        <p>{profile.suppressed_traits?.join(", ") || "None"}</p>
      </div>
    </div>
  );
};

export default AlignmentDashboard;
