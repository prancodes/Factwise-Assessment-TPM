import React, { useState } from 'react';
import { 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Flame, 
  Sparkles,
  Info
} from 'lucide-react';
import { FEVER_THRESHOLD_F } from '../data/mockPatients';

export default function LogTemperatureModal({ 
  patient, 
  onClose, 
  onSubmit 
}) {
  const [unit, setUnit] = useState('F'); // 'F' | 'C'
  const [tempValue, setTempValue] = useState(patient.todayTemperature ? patient.todayTemperature.toString() : '98.6');
  const [nurseNotes, setNurseNotes] = useState('');
  const [isDuplicateAcknowledged, setIsDuplicateAcknowledged] = useState(false);

  if (!patient) return null;

  // Convert for calculations
  const numericVal = parseFloat(tempValue);
  const tempInF = isNaN(numericVal) 
    ? 98.6 
    : unit === 'F' ? numericVal : +(numericVal * 9/5 + 32).toFixed(1);

  // Validation
  const isValidNumber = !isNaN(numericVal);
  const isOutOfRange = unit === 'F' 
    ? (numericVal < 93.0 || numericVal > 108.0) 
    : (numericVal < 33.9 || numericVal > 42.2);

  const hasFever = tempInF >= FEVER_THRESHOLD_F;
  const isHighFever = tempInF >= 102.0;

  // Predicted fever-free days
  const predictedStreak = hasFever ? 0 : patient.feverFreeDays + (patient.tempTakenToday ? 0 : 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOutOfRange || !isValidNumber) return;

    // Check duplicate
    if (patient.tempTakenToday && !isDuplicateAcknowledged) {
      alert("Please acknowledge that you are updating an already recorded daily temperature.");
      return;
    }

    onSubmit(patient.id, tempInF, nurseNotes);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: '#1e293b', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                Room {patient.roomNumber}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                Log Patient Temperature
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {patient.name} • {patient.age}y • {patient.gender} • Day {patient.admittedDaysAgo} in Quarantine
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.5rem', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Duplicate warning banner if already logged today */}
        {patient.tempTakenToday && (
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.15)', 
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
              <AlertTriangle size={16} />
              Warning: Temperature Already Recorded Today
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
              Today's temperature was logged as <strong>{patient.todayTemperature}°F</strong> at {patient.todayTempTimestamp}.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#f8fafc', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isDuplicateAcknowledged} 
                onChange={(e) => setIsDuplicateAcknowledged(e.target.checked)} 
              />
              Confirming this is a clinical re-check or vital sign correction
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Temperature Input & Unit Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                Measured Body Temperature:
              </label>

              {/* Unit Toggle */}
              <div style={{ display: 'flex', background: '#0b111e', borderRadius: '6px', padding: '0.2rem', border: '1px solid #1f293d' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (unit === 'C') {
                      setUnit('F');
                      setTempValue(tempInF.toString());
                    }
                  }}
                  style={{
                    background: unit === 'F' ? '#0284c7' : 'transparent',
                    color: unit === 'F' ? '#fff' : '#94a3b8',
                    border: 'none',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  °F
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (unit === 'F') {
                      setUnit('C');
                      setTempValue(((numericVal - 32) * 5/9).toFixed(1));
                    }
                  }}
                  style={{
                    background: unit === 'C' ? '#0284c7' : 'transparent',
                    color: unit === 'C' ? '#fff' : '#94a3b8',
                    border: 'none',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  °C
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="number"
                step="0.1"
                required
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  background: '#0b111e',
                  border: isOutOfRange ? '1px solid #ef4444' : hasFever ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #1f293d',
                  borderRadius: '10px',
                  color: hasFever ? '#f87171' : '#34d399',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#94a3b8' }}>
                °{unit}
              </span>
            </div>

            {isOutOfRange && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                Value outside physiological range ({unit === 'F' ? '93.0°F – 108.0°F' : '33.9°C – 42.2°C'}). Please re-check thermometer.
              </p>
            )}
          </div>

          {/* Clinical Classification Preview */}
          <div style={{ 
            background: hasFever ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
            border: `1px solid ${hasFever ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {hasFever ? <Flame size={18} color="#f87171" /> : <CheckCircle2 size={18} color="#34d399" />}
                <strong style={{ fontSize: '0.9rem', color: hasFever ? '#f87171' : '#34d399' }}>
                  {hasFever ? 'Fever Detected (≥ 99.5°F / 37.5°C)' : 'Normal Body Temperature (< 99.5°F)'}
                </strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {unit === 'C' ? `${tempInF}°F equivalent` : ''}
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.4rem' }}>
              {hasFever ? (
                <>⚠️ <strong>Streak Reset:</strong> Active fever resets consecutive fever-free counter to <strong>0 days</strong>.</>
              ) : (
                <>✅ <strong>Streak Advance:</strong> Fever-free reading increments consecutive streak to <strong>{predictedStreak} of 3 days</strong>.</>
              )}
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Standard clinical presets:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[98.2, 98.6, 99.1, 99.8, 100.8, 102.4].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    if (unit === 'F') {
                      setTempValue(preset.toString());
                    } else {
                      setTempValue(((preset - 32) * 5/9).toFixed(1));
                    }
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  {preset}°F {preset >= FEVER_THRESHOLD_F ? '🔥' : '🌱'}
                </button>
              ))}
            </div>
          </div>

          {/* Nurse Observation Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Nurse Observations & Symptoms:
            </label>
            <input 
              type="text"
              placeholder="e.g. Mild cough, hydrated, alert, oral thermometer used."
              value={nurseNotes}
              onChange={(e) => setNurseNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0b111e',
                border: '1px solid #1f293d',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isOutOfRange || !isValidNumber}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              <CheckCircle2 size={15} />
              Save Temperature & Notify Doctor
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
