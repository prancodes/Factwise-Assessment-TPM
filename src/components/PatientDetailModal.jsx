import React from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Thermometer, 
  Stethoscope, 
  Pill, 
  CheckCircle, 
  Clock, 
  Flame, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { FEVER_THRESHOLD_F } from '../data/mockPatients';

export default function PatientDetailModal({ 
  patient, 
  onClose, 
  onLogTempClick, 
  onDoctorVisitClick, 
  onRecommendDischarge,
  onDischargeClick 
}) {
  if (!patient) return null;

  const hasFever = patient.todayTemperature !== null && patient.todayTemperature >= FEVER_THRESHOLD_F;
  const is3DayFeverFree = patient.feverFreeDays >= 3;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ 
                background: '#1e293b', 
                color: '#38bdf8', 
                padding: '0.25rem 0.65rem', 
                borderRadius: '8px', 
                fontSize: '0.9rem', 
                fontWeight: 800,
                border: '1px solid #334155'
              }}>
                Room {String(patient.roomNumber).padStart(2, '0')}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                {patient.name}
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.35rem' }}>
              Patient ID: <strong>{patient.id}</strong> • {patient.age} yrs • {patient.gender} • Admitted {patient.admittedDaysAgo} days ago
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.55rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Day Fever-Free Discharge Milestone Tracker */}
        <div style={{ 
          background: is3DayFeverFree ? 'rgba(16, 185, 129, 0.12)' : '#0b111e',
          border: is3DayFeverFree ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #1f293d',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color={is3DayFeverFree ? '#34d399' : '#fbbf24'} />
              <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>
                3-Day No-Fever Clinical Discharge Criterion
              </strong>
            </div>
            
            <span style={{ 
              fontWeight: 800, 
              color: is3DayFeverFree ? '#34d399' : '#fbbf24',
              fontSize: '0.95rem'
            }}>
              {patient.feverFreeDays} / 3 Days Completed {is3DayFeverFree ? '✅ (CURED)' : ''}
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            Sole clinical requirement for discharge: The patient must maintain 3 full consecutive calendar days with no temperature reading &ge; 99.5°F.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
            {[1, 2, 3].map(day => {
              const isAchieved = patient.feverFreeDays >= day;
              return (
                <div 
                  key={day}
                  style={{
                    background: isAchieved ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                    border: isAchieved ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.65rem',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.75rem', color: isAchieved ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
                    Day {day} Fever-Free
                  </span>
                  <span style={{ fontSize: '0.7rem', color: isAchieved ? '#a7f3d0' : '#64748b' }}>
                    {isAchieved ? 'Verified Normal' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Clinical Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          
          {/* Temperature History Chart / List */}
          <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1.25rem', border: '1px solid #1f293d' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Thermometer size={16} color="#38bdf8" />
              Daily Temperature Records
            </h4>

            {/* Today's Reading */}
            <div style={{ 
              background: '#131b2c', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              marginBottom: '0.75rem',
              border: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  Today (Facility Day)
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {patient.todayTempTimestamp ? `Logged at ${patient.todayTempTimestamp} by ${patient.todayNurseName}` : 'Awaiting nurse check'}
                </span>
              </div>
              <div>
                {patient.tempTakenToday ? (
                  <span style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 800, 
                    color: hasFever ? '#f87171' : '#34d399' 
                  }}>
                    {patient.todayTemperature}°F
                  </span>
                ) : (
                  <span className="badge badge-pending">Pending</span>
                )}
              </div>
            </div>

            {/* Past History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
              {patient.temperatureHistory.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    padding: '0.45rem 0.65rem',
                    background: '#111827',
                    borderRadius: '6px'
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>{item.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 700, color: item.hasFever ? '#f87171' : '#34d399' }}>
                      {item.temp}°F
                    </span>
                    <span style={{ fontSize: '0.65rem', color: item.hasFever ? '#f87171' : '#34d399' }}>
                      {item.hasFever ? '(Fever)' : '(Normal)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Regimen & Doctor Notes */}
          <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1.25rem', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Stethoscope size={16} color="#818cf8" />
                Doctor Notes & Treatment Plan
              </h4>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Current Regimen:
                </span>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {patient.medications.map((m, i) => (
                    <span key={i} style={{ background: '#1e293b', color: '#cbd5e1', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      <Pill size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  Latest Physician Entry:
                </span>
                <p style={{ fontSize: '0.8rem', color: '#e2e8f0', background: '#131b2c', padding: '0.65rem', borderRadius: '6px', fontStyle: 'italic', border: '1px solid #1e293b' }}>
                  "{patient.todayDoctorNotes || 'No notes entered for today yet.'}"
                </p>
              </div>
            </div>

            {patient.doctorRecommendedDischarge && (
              <div style={{ 
                marginTop: '1rem', 
                background: 'rgba(139, 92, 246, 0.15)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.65rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#c4b5fd'
              }}>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Doctor recommended discharge. Waiting for Admin bed clearance.
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #1f293d' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => {
                onClose();
                onLogTempClick(patient);
              }}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem' }}
            >
              <Thermometer size={14} />
              {patient.tempTakenToday ? 'Re-Log Temp' : 'Log Temperature'}
            </button>

            <button 
              onClick={() => {
                onClose();
                onDoctorVisitClick(patient);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              <Stethoscope size={14} />
              Doctor Round
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {is3DayFeverFree && !patient.doctorRecommendedDischarge && (
              <button 
                onClick={() => {
                  onRecommendDischarge(patient.id);
                  onClose();
                }}
                className="btn btn-success"
                style={{ fontSize: '0.8rem' }}
              >
                <Sparkles size={14} />
                Doctor: Authorize Discharge
              </button>
            )}

            {is3DayFeverFree && patient.doctorRecommendedDischarge && (
              <button 
                onClick={() => {
                  onDischargeClick(patient.id);
                  onClose();
                }}
                className="btn btn-success"
                style={{ fontSize: '0.8rem' }}
              >
                <Sparkles size={14} />
                Admin: Execute Discharge & Free Bed
              </button>
            )}

            <button 
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
