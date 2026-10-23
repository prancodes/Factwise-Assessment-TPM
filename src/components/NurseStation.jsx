import React from 'react';
import { 
  Thermometer, 
  CheckCircle2, 
  Zap, 
  ShieldCheck
} from 'lucide-react';
import { FEVER_THRESHOLD_F } from '../data/mockPatients';

export default function NurseStation({ 
  patients, 
  onLogTemperature, 
  onOpenLogModal,
  onSelectPatient 
}) {
  const pendingPatients = patients.filter(p => !p.tempTakenToday);
  const completedPatients = patients.filter(p => p.tempTakenToday);

  const handleQuickLog = (patient, temp) => {
    onLogTemperature(patient.id, temp, 'Nurse Station Triage');
  };

  return (
    <div className="two-column-split">
      
      {/* Left: Pending Temperature Queue */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.35rem', borderRadius: '8px' }}>
                <Thermometer size={16} color="#fbbf24" />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Nurse Morning Triage Queue
              </h2>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Patients requiring daily morning temperature measurement before doctor rounds.
            </p>
          </div>

          <span className="badge badge-pending" style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}>
            {pendingPatients.length} Pending
          </span>
        </div>

        {pendingPatients.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2.5rem 1rem', 
            background: 'rgba(16, 185, 129, 0.05)', 
            borderRadius: '12px',
            border: '1px dashed rgba(16, 185, 129, 0.3)'
          }}>
            <ShieldCheck size={38} color="#34d399" style={{ margin: '0 auto 0.6rem auto' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399' }}>
              All Daily Temperatures Recorded!
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '380px', margin: '0.3rem auto 0 auto' }}>
              Great job! All patients have their temperature recorded for today. Doctors can now perform rounds with accurate data.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '680px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {pendingPatients.map(patient => (
              <div 
                key={patient.id}
                style={{
                  background: '#131b2c',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Patient Room & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '170px' }}>
                  <div style={{ 
                    background: '#1e293b', 
                    borderRadius: '8px', 
                    padding: '0.4rem 0.55rem', 
                    textAlign: 'center',
                    border: '1px solid #334155' 
                  }}>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Room</span>
                    <strong style={{ fontSize: '1rem', color: '#38bdf8' }}>{patient.roomNumber}</strong>
                  </div>

                  <div>
                    <h4 
                      onClick={() => onSelectPatient(patient)}
                      style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                    >
                      {patient.name}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {patient.age}y • {patient.gender} • Streak: {patient.feverFreeDays}/3d
                    </span>
                  </div>
                </div>

                {/* Quick 1-Click Temperature Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', marginRight: '0.15rem' }}>
                    <Zap size={10} style={{ display: 'inline' }} /> Quick:
                  </span>
                  
                  <button 
                    onClick={() => handleQuickLog(patient, 98.4)}
                    className="btn btn-secondary"
                    title="Log Normal 98.4°F"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399', minHeight: '32px' }}
                  >
                    98.4°
                  </button>

                  <button 
                    onClick={() => handleQuickLog(patient, 98.6)}
                    className="btn btn-secondary"
                    title="Log Normal 98.6°F"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderColor: 'rgba(52, 211, 153, 0.4)', color: '#34d399', minHeight: '32px' }}
                  >
                    98.6°
                  </button>

                  <button 
                    onClick={() => handleQuickLog(patient, 99.8)}
                    className="btn btn-secondary"
                    title="Log Low Fever 99.8°F"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', minHeight: '32px' }}
                  >
                    99.8°
                  </button>

                  <button 
                    onClick={() => handleQuickLog(patient, 101.5)}
                    className="btn btn-secondary"
                    title="Log High Fever 101.5°F"
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', minHeight: '32px' }}
                  >
                    101.5°
                  </button>

                  <button 
                    onClick={() => onOpenLogModal(patient)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', minHeight: '32px' }}
                  >
                    Custom Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Completed Today Log */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Recorded Today ({completedPatients.length})
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Logged vitals for current calendar day.
            </p>
          </div>
          <span className="badge badge-normal" style={{ fontSize: '0.72rem' }}>
            <CheckCircle2 size={11} /> Logged
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxHeight: '680px', overflowY: 'auto' }}>
          {completedPatients.map(patient => {
            const hasFever = patient.todayTemperature >= FEVER_THRESHOLD_F;
            return (
              <div 
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                style={{
                  background: '#0b111e',
                  border: '1px solid #1a2333',
                  borderRadius: '8px',
                  padding: '0.65rem 0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                      R-{String(patient.roomNumber).padStart(2, '0')}
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#f8fafc' }}>{patient.name}</strong>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {patient.todayTempTimestamp || 'Recorded Today'} • {patient.todayNurseName || 'Nurse'}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 800, 
                    color: hasFever ? '#f87171' : '#34d399' 
                  }}>
                    {patient.todayTemperature}°F
                  </span>
                  <span style={{ display: 'block', fontSize: '0.62rem', color: hasFever ? '#f87171' : '#34d399' }}>
                    {hasFever ? 'Fever' : 'Normal'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
