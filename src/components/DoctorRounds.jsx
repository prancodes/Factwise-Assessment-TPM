import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  UserCheck,
  HeartCrack
} from 'lucide-react';
import { FEVER_THRESHOLD_F } from '../data/mockPatients';

export default function DoctorRounds({ 
  patients, 
  onCompleteDoctorVisit, 
  onRecommendDischarge,
  onMarkDeceased,
  onSelectPatient 
}) {
  const [activeTab, setActiveTab] = useState('ready'); // 'ready' | 'pending_nurse' | 'completed'
  const [selectedForRound, setSelectedForRound] = useState(null);
  const [roundNotes, setRoundNotes] = useState('');

  // Segregate by sequential clinical workflow
  const readyPatients = patients.filter(p => p.tempTakenToday && !p.doctorVisitedToday);
  const waitingNursePatients = patients.filter(p => !p.tempTakenToday);
  const completedPatients = patients.filter(p => p.doctorVisitedToday);

  const handleOpenRound = (patient) => {
    setSelectedForRound(patient);
    setRoundNotes(patient.todayDoctorNotes || 'Patient evaluated. Respiratory status checked. Treatment continued.');
  };

  const handleSaveRound = () => {
    if (!selectedForRound) return;
    onCompleteDoctorVisit(selectedForRound.id, roundNotes);
    setSelectedForRound(null);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.35rem', borderRadius: '8px' }}>
              <Stethoscope size={16} color="#a5b4fc" />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
              Doctor Clinical Rounds Desk
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
            Enforces sequential workflow: Only patients with recorded morning temperatures appear in the ready queue.
          </p>
        </div>

        {/* Tab switchers (Scrollable on small mobile) */}
        <div className="filter-bar-scrollable" style={{ background: '#0b111e', padding: '0.25rem', borderRadius: '8px', border: '1px solid #1f293d', width: 'auto' }}>
          <button 
            onClick={() => setActiveTab('ready')}
            className={`btn ${activeTab === 'ready' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', flexShrink: 0 }}
          >
            Ready for Round ({readyPatients.length})
          </button>

          <button 
            onClick={() => setActiveTab('pending_nurse')}
            className={`btn ${activeTab === 'pending_nurse' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', flexShrink: 0 }}
          >
            <Lock size={12} />
            Waiting for Nurse ({waitingNursePatients.length})
          </button>

          <button 
            onClick={() => setActiveTab('completed')}
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem', flexShrink: 0 }}
          >
            <CheckCircle size={12} />
            Completed Today ({completedPatients.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'ready' && (
        <div>
          {readyPatients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#0b111e', borderRadius: '12px' }}>
              <UserCheck size={36} color="#64748b" style={{ margin: '0 auto 0.6rem auto' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                No Patients Awaiting Doctor Round
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '380px', margin: '0.3rem auto 0 auto' }}>
                All patients whose temperature was recorded today have been evaluated, or remaining patients are still awaiting nurse temperature checks.
              </p>
            </div>
          ) : (
            <div className="doctor-rounds-grid">
              {readyPatients.map(patient => {
                const hasFever = patient.todayTemperature >= FEVER_THRESHOLD_F;
                const is3DayFeverFree = patient.feverFreeDays >= 3;

                return (
                  <div 
                    key={patient.id}
                    style={{
                      background: '#131b2c',
                      border: is3DayFeverFree ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div>
                      {/* Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <span style={{ background: '#1e293b', color: '#38bdf8', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                          Room {patient.roomNumber}
                        </span>

                        {is3DayFeverFree ? (
                          <span className="badge badge-discharge">
                            <Sparkles size={11} /> 3d Cured
                          </span>
                        ) : hasFever ? (
                          <span className="badge badge-fever">
                            Fever ({patient.todayTemperature}°F)
                          </span>
                        ) : (
                          <span className="badge badge-normal">
                            Normal ({patient.todayTemperature}°F)
                          </span>
                        )}
                      </div>

                      {/* Patient Name */}
                      <h3 
                        onClick={() => onSelectPatient(patient)}
                        style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                      >
                        {patient.name}
                      </h3>
                      <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {patient.age}y • {patient.gender} • Day {patient.admittedDaysAgo} in Care
                      </p>

                      {/* Vital status */}
                      <div style={{ 
                        background: '#0b111e', 
                        padding: '0.5rem 0.65rem', 
                        borderRadius: '8px', 
                        margin: '0.65rem 0',
                        fontSize: '0.72rem',
                        border: '1px solid #1a2333'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Nurse Vitals:</span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                            {patient.todayTemperature}°F ({patient.todayTempTimestamp})
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                          <span style={{ color: '#94a3b8' }}>Fever-Free Streak:</span>
                          <span style={{ 
                            fontWeight: 700, 
                            color: is3DayFeverFree ? '#34d399' : '#fbbf24' 
                          }}>
                            {patient.feverFreeDays} of 3 Days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.45rem' }}>
                      <button 
                        onClick={() => handleOpenRound(patient)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                      >
                        <Stethoscope size={13} />
                        Conduct Round & Prescribe
                      </button>

                      {is3DayFeverFree ? (
                        <button 
                          onClick={() => onRecommendDischarge(patient.id)}
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                          title="Authorize discharge solely based on 3-day no-fever criterion"
                        >
                          <Sparkles size={13} />
                          Recommend for Discharge
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="btn btn-secondary btn-disabled"
                          style={{ fontSize: '0.72rem', padding: '0.4rem' }}
                          title="Disabled: Requires 3 consecutive days without fever"
                        >
                          Discharge Locked ({patient.feverFreeDays}/3d Fever-Free)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Blocked / Waiting for Nurse Tab */}
      {activeTab === 'pending_nurse' && (
        <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1rem', border: '1px solid #1f293d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem', color: '#fbbf24' }}>
            <AlertTriangle size={16} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              Sequential Clinical Constraint Enforced
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.85rem' }}>
            To prevent doctors from wasting valuable clinical minutes, patients below cannot be evaluated until their daily morning temperature is recorded by the nursing team.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.6rem' }}>
            {waitingNursePatients.map(p => (
              <div 
                key={p.id}
                onClick={() => onSelectPatient(p)}
                style={{
                  background: '#131b2c',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>Room {p.roomNumber}</span>
                  <span className="badge badge-pending" style={{ fontSize: '0.6rem' }}>Awaiting Nurse</span>
                </div>
                <strong style={{ display: 'block', fontSize: '0.82rem', color: '#f8fafc', marginTop: '0.2rem' }}>
                  {p.name}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Today Tab */}
      {activeTab === 'completed' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {completedPatients.map(patient => (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              style={{
                background: '#131b2c',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>Room {patient.roomNumber}</span>
                <span className="badge badge-doctor" style={{ fontSize: '0.68rem' }}>
                  <CheckCircle size={10} /> Round Complete
                </span>
              </div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{patient.name}</h4>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem', fontStyle: 'italic' }}>
                "{patient.todayDoctorNotes || 'Notes recorded.'}"
              </p>
              {patient.doctorRecommendedDischarge && (
                <div style={{ marginTop: '0.45rem', color: '#34d399', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={11} /> Recommended for Admin Discharge
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Conduct Round & Prescribe (Mounted via Portal to document.body so it centers in active viewport without scrolling) */}
      {selectedForRound && createPortal(
        <div className="modal-overlay" onClick={() => setSelectedForRound(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Doctor Round: Room {selectedForRound.roomNumber} — {selectedForRound.name}
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Today's recorded temperature: <strong>{selectedForRound.todayTemperature}°F</strong> (Streak: {selectedForRound.feverFreeDays}/3 days fever-free).
            </p>

            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
              Clinical Evaluation & Treatment Notes:
            </label>
            <textarea 
              rows={4}
              value={roundNotes}
              onChange={(e) => setRoundNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem',
                background: '#0b111e',
                border: '1px solid #1f293d',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.82rem',
                marginBottom: '1rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
              <button 
                onClick={() => {
                  if (confirm(`Record clinical mortality for Room ${selectedForRound.roomNumber} (${selectedForRound.name})? This updates facility mortality metrics.`)) {
                    onMarkDeceased(selectedForRound.id);
                    setSelectedForRound(null);
                  }
                }}
                className="btn btn-danger"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
              >
                <HeartCrack size={12} />
                Record Mortality
              </button>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setSelectedForRound(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveRound}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem' }}
                >
                  <CheckCircle size={13} />
                  Complete Round
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
