import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Sparkles, 
  Thermometer, 
  Stethoscope, 
  Pill
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

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ 
                background: '#1e293b', 
                color: '#38bdf8', 
                padding: '0.2rem 0.55rem', 
                borderRadius: '8px', 
                fontSize: '0.82rem', 
                fontWeight: 800,
                border: '1px solid #334155'
              }}>
                Room {String(patient.roomNumber).padStart(2, '0')}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                {patient.name}
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              ID: <strong>{patient.id}</strong> • {patient.age}y • {patient.gender} • Day {patient.admittedDaysAgo} in Care
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.5rem', borderRadius: '50%', minHeight: 'auto' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* 3-Day Fever-Free Discharge Milestone Tracker */}
        <div style={{ 
          background: is3DayFeverFree ? 'rgba(16, 185, 129, 0.12)' : '#0b111e',
          border: is3DayFeverFree ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #1f293d',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Sparkles size={18} color={is3DayFeverFree ? '#34d399' : '#fbbf24'} />
              <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>
                3-Day No-Fever Discharge Criterion
              </strong>
            </div>
            
            <span style={{ 
              fontWeight: 800, 
              color: is3DayFeverFree ? '#34d399' : '#fbbf24',
              fontSize: '0.88rem'
            }}>
              {patient.feverFreeDays}/3 Days {is3DayFeverFree ? '✅ (CURED)' : ''}
            </span>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.65rem' }}>
            Sole clinical requirement: 3 full consecutive calendar days with no reading &ge; 99.5°F.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[1, 2, 3].map(day => {
              const isAchieved = patient.feverFreeDays >= day;
              return (
                <div 
                  key={day}
                  style={{
                    background: isAchieved ? 'rgba(16, 185, 129, 0.2)' : '#1e293b',
                    border: isAchieved ? '1px solid rgba(52, 211, 153, 0.5)' : '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.55rem 0.35rem',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ display: 'block', fontSize: '0.72rem', color: isAchieved ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
                    Day {day}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: isAchieved ? '#a7f3d0' : '#64748b' }}>
                    {isAchieved ? 'Normal' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Clinical Overview (Responsive) */}
        <div className="modal-split-grid">
          
          {/* Temperature History Chart / List */}
          <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1rem', border: '1px solid #1f293d' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Thermometer size={15} color="#38bdf8" />
              Daily Temperature Records
            </h4>

            {/* Today's Reading */}
            <div style={{ 
              background: '#131b2c', 
              padding: '0.65rem', 
              borderRadius: '8px', 
              marginBottom: '0.65rem',
              border: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                  Today
                </span>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  {patient.todayTempTimestamp ? `${patient.todayTempTimestamp} (${patient.todayNurseName})` : 'Awaiting nurse'}
                </span>
              </div>
              <div>
                {patient.tempTakenToday ? (
                  <span style={{ 
                    fontSize: '1rem', 
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto' }}>
              {patient.temperatureHistory.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.72rem',
                    padding: '0.4rem 0.55rem',
                    background: '#111827',
                    borderRadius: '6px'
                  }}
                >
                  <span style={{ color: '#94a3b8' }}>{item.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: item.hasFever ? '#f87171' : '#34d399' }}>
                      {item.temp}°F
                    </span>
                    <span style={{ fontSize: '0.62rem', color: item.hasFever ? '#f87171' : '#34d399' }}>
                      {item.hasFever ? '(Fever)' : '(Normal)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Regimen & Doctor Notes */}
          <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1rem', border: '1px solid #1f293d', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Stethoscope size={15} color="#818cf8" />
                Doctor Notes & Treatment Plan
              </h4>

              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                  Current Regimen:
                </span>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {patient.medications.map((m, i) => (
                    <span key={i} style={{ background: '#1e293b', color: '#cbd5e1', fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      <Pill size={10} style={{ display: 'inline', marginRight: '3px' }} />
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                  Physician Entry:
                </span>
                <p style={{ fontSize: '0.78rem', color: '#e2e8f0', background: '#131b2c', padding: '0.55rem', borderRadius: '6px', fontStyle: 'italic', border: '1px solid #1e293b' }}>
                  "{patient.todayDoctorNotes || 'No notes entered for today yet.'}"
                </p>
              </div>
            </div>

            {patient.doctorRecommendedDischarge && (
              <div style={{ 
                marginTop: '0.85rem', 
                background: 'rgba(139, 92, 246, 0.15)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.55rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                color: '#c4b5fd'
              }}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Doctor recommended discharge. Waiting for Admin bed clearance.
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions (Responsive wrap) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', paddingTop: '0.85rem', borderTop: '1px solid #1f293d' }}>
          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                onClose();
                onLogTempClick(patient);
              }}
              className="btn btn-primary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              <Thermometer size={13} />
              {patient.tempTakenToday ? 'Re-Log Temp' : 'Log Temp'}
            </button>

            <button 
              onClick={() => {
                onClose();
                onDoctorVisitClick(patient);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              <Stethoscope size={13} />
              Doctor Round
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
            {is3DayFeverFree && !patient.doctorRecommendedDischarge && (
              <button 
                onClick={() => {
                  onRecommendDischarge(patient.id);
                  onClose();
                }}
                className="btn btn-success"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                <Sparkles size={13} />
                Authorize Discharge
              </button>
            )}

            {is3DayFeverFree && patient.doctorRecommendedDischarge && (
              <button 
                onClick={() => {
                  onDischargeClick(patient.id);
                  onClose();
                }}
                className="btn btn-success"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                <Sparkles size={13} />
                Execute Discharge
              </button>
            )}

            <button 
              onClick={onClose}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
