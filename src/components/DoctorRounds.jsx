import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Lock, 
  FileText,
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
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.4rem', borderRadius: '8px' }}>
              <Stethoscope size={18} color="#a5b4fc" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
              Doctor Clinical Rounds Desk
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Enforces sequential workflow: Only patients with recorded morning temperatures appear in the ready queue.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0b111e', padding: '0.3rem', borderRadius: '8px', border: '1px solid #1f293d' }}>
          <button 
            onClick={() => setActiveTab('ready')}
            className={`btn ${activeTab === 'ready' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            Ready for Round ({readyPatients.length})
          </button>

          <button 
            onClick={() => setActiveTab('pending_nurse')}
            className={`btn ${activeTab === 'pending_nurse' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Lock size={12} />
            Waiting for Nurse ({waitingNursePatients.length})
          </button>

          <button 
            onClick={() => setActiveTab('completed')}
            className={`btn ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
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
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#0b111e', borderRadius: '12px' }}>
              <UserCheck size={40} color="#64748b" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                No Patients Awaiting Doctor Round
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px', margin: '0.35rem auto 0 auto' }}>
                All patients whose temperature was recorded today have been evaluated, or remaining patients are still awaiting nurse temperature checks.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
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
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div>
                      {/* Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ background: '#1e293b', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Room {patient.roomNumber}
                        </span>

                        {is3DayFeverFree ? (
                          <span className="badge badge-discharge">
                            <Sparkles size={11} /> 3d Fever-Free (Cured)
                          </span>
                        ) : hasFever ? (
                          <span className="badge badge-fever">
                            Fever Active ({patient.todayTemperature}°F)
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
                        style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                      >
                        {patient.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {patient.age}y • {patient.gender} • Admitted {patient.admittedDaysAgo}d ago
                      </p>

                      {/* Vital status */}
                      <div style={{ 
                        background: '#0b111e', 
                        padding: '0.6rem 0.75rem', 
                        borderRadius: '8px', 
                        margin: '0.75rem 0',
                        fontSize: '0.75rem',
                        border: '1px solid #1a2333'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#94a3b8' }}>Nurse Check:</span>
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                            {patient.todayTemperature}°F at {patient.todayTempTimestamp}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => handleOpenRound(patient)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.45rem' }}
                      >
                        <Stethoscope size={14} />
                        Conduct Round & Prescribe
                      </button>

                      {is3DayFeverFree ? (
                        <button 
                          onClick={() => onRecommendDischarge(patient.id)}
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.45rem' }}
                          title="Authorize discharge solely based on 3-day no-fever criterion"
                        >
                          <Sparkles size={14} />
                          Recommend for Discharge (3d Cured)
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="btn btn-secondary btn-disabled"
                          style={{ fontSize: '0.75rem', padding: '0.45rem' }}
                          title="Disabled: Requires 3 consecutive days without fever"
                        >
                          Discharge Locked ({patient.feverFreeDays}/3d No Fever)
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
        <div style={{ background: '#0b111e', borderRadius: '12px', padding: '1.25rem', border: '1px solid #1f293d' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: '#fbbf24' }}>
            <AlertTriangle size={18} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Sequential Clinical Constraint Enforced
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
            To prevent doctors from wasting valuable clinical minutes, patients below cannot be evaluated until their daily morning temperature is recorded by the nursing team.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem' }}>
            {waitingNursePatients.map(p => (
              <div 
                key={p.id}
                onClick={() => onSelectPatient(p)}
                style={{
                  background: '#131b2c',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                  <span>Room {p.roomNumber}</span>
                  <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>Awaiting Nurse</span>
                </div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#f8fafc', marginTop: '0.25rem' }}>
                  {p.name}
                </strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Today Tab */}
      {activeTab === 'completed' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
          {completedPatients.map(patient => (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              style={{
                background: '#131b2c',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>Room {patient.roomNumber}</span>
                <span className="badge badge-doctor" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle size={11} /> Round Complete
                </span>
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{patient.name}</h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem', fontStyle: 'italic' }}>
                "{patient.todayDoctorNotes || 'Notes recorded.'}"
              </p>
              {patient.doctorRecommendedDischarge && (
                <div style={{ marginTop: '0.5rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Recommended for Admin Discharge
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Conduct Round & Prescribe */}
      {selectedForRound && (
        <div className="modal-overlay" onClick={() => setSelectedForRound(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Doctor Round: Room {selectedForRound.roomNumber} — {selectedForRound.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Today's recorded temperature: <strong>{selectedForRound.todayTemperature}°F</strong> (Streak: {selectedForRound.feverFreeDays}/3 days fever-free).
            </p>

            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              Clinical Evaluation & Treatment Notes:
            </label>
            <textarea 
              rows={4}
              value={roundNotes}
              onChange={(e) => setRoundNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0b111e',
                border: '1px solid #1f293d',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  if (confirm(`Record clinical mortality for Room ${selectedForRound.roomNumber} (${selectedForRound.name})? This updates facility mortality metrics.`)) {
                    onMarkDeceased(selectedForRound.id);
                    setSelectedForRound(null);
                  }
                }}
                className="btn btn-danger"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                <HeartCrack size={13} />
                Record Mortality
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setSelectedForRound(null)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveRound}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  <CheckCircle size={14} />
                  Complete Round
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
