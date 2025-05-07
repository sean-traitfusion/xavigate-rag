import React, { useState } from 'react';

export default function LanguageSelector() {
  const [language, setLanguage] = useState('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'km', label: 'ភាសាខ្មែរ' }
  ];

  const handleChange = (e) => {
    setLanguage(e.target.value);
    console.log(`🌐 Language changed to: ${e.target.value}`);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label htmlFor="language" style={{ fontSize: '0.85rem', color: '#555' }}>Lang:</label>
      <select
        id="language"
        value={language}
        onChange={handleChange}
        style={{
          fontSize: '0.85rem',
          padding: '0.3rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          color: '#333',
          minWidth: '100px'
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}