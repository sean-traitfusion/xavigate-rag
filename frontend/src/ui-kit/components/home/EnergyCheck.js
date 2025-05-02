import React from 'react';
import { Moon, Wind, Sun } from 'lucide-react';

export default function EnergyCheck({ energyLevel, setEnergyLevel }) {
  return (
    <div className="card">
      <div className="energy-header">
        <h2>How's your energy today?</h2>
        <div>{energyLevel < 40 ? 'Low' : energyLevel < 70 ? 'Flow' : 'High'}</div>
      </div>

      <div className="energy-slider">
        <div className="energy-icons">
          <Moon size={18} />
          <Wind size={18} />
          <Sun size={18} />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
}
