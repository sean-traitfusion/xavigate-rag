import React, { useState } from 'react';

const AccountView: React.FC = () => {
  const [firstName, setFirstName] = useState('Steven');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('steven');
  const [email, setEmail] = useState('steven@example.com');
  const [language, setLanguage] = useState('English');

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleUsernameChange = (val: string) => {
    setUsername(val.toLowerCase().replace(/\s/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('✅ Profile saved:', { firstName, lastName, username, email, language });
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 24px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
        My Account
      </h2>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
        Manage your personal details and preferences.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => handleUsernameChange(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          style={{ ...inputStyle, paddingRight: '12px' }}
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Japanese">Japanese</option>
          <option value="Spanish">Spanish</option>
        </select>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#4F46E5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password Section */}
      <div style={{ borderTop: '1px solid #eee', marginTop: '32px', paddingTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
          Security
        </h3>

        {!showPasswordForm ? (
          <button
            style={{
              backgroundColor: '#f3f4f6',
              color: '#111827',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </button>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPasswordError('');
              setPasswordSuccess('');

              if (newPassword !== confirmPassword) {
                setPasswordError("New passwords do not match.");
                return;
              }

              try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/change-password`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ currentPassword, newPassword })
                });

                const result = await res.json();

                if (!res.ok) throw new Error(result.message || "Password update failed");

                setPasswordSuccess("✅ Password updated successfully.");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowPasswordForm(false);
              } catch (err: any) {
                setPasswordError(err.message || "An error occurred.");
              }
            }}
          >
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />

            {passwordError && <p style={{ color: '#b91c1c', fontSize: '13px', marginTop: '8px' }}>{passwordError}</p>}
            {passwordSuccess && <p style={{ color: '#047857', fontSize: '13px', marginTop: '8px' }}>{passwordSuccess}</p>}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#4F46E5',
                  color: 'white',
                  padding: '10px 20px',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                style={{
                  backgroundColor: '#f9fafb',
                  color: '#374151',
                  padding: '10px 20px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '16px',
  marginBottom: '6px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  boxSizing: 'border-box'
};

export default AccountView;
