import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Building2, 
  Sparkles, 
  UserPlus, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  ShieldAlert
} from 'lucide-react';
import { BENCHMARK_MORTALITY_RATE, BENCHMARK_RECOVERY_RATE, INITIAL_BED_COUNT } from '../data/mockPatients';

export default function AdminDesk({ 
  patients, 
  closedCases, 
  onDischargePatient, 
  onAdmitPatient,
  onSelectPatient 
}) {
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('32');
  const [newPatientGender, setNewPatientGender] = useState('Male');

  const activePatients = patients.filter(p => p.status !== 'discharged' && p.status !== 'deceased');
  const pendingDischarges = patients.filter(p => p.doctorRecommendedDischarge && p.status !== 'discharged');
  
  // Find vacant room numbers (1 to 74)
  const occupiedRooms = new Set(activePatients.map(p => p.roomNumber));
  const vacantRooms = [];
  for (let r = 1; r <= INITIAL_BED_COUNT; r++) {
    if (!occupiedRooms.has(r)) {
      vacantRooms.push(r);
    }
  }

  const isFullCapacity = activePatients.length >= INITIAL_BED_COUNT;

  // Quality metrics
  const totalResolved = closedCases.dischargedCount + closedCases.deceasedCount;
  const mortalityRate = totalResolved > 0 
    ? +((closedCases.deceasedCount / totalResolved) * 100).toFixed(1) 
    : 0;
  const recoveryRate = totalResolved > 0 
    ? +((closedCases.dischargedCount / totalResolved) * 100).toFixed(1) 
    : 0;
  const isMortalityExceeded = mortalityRate > BENCHMARK_MORTALITY_RATE;

  const handleAdmit = (e) => {
    e.preventDefault();
    if (vacantRooms.length === 0) return;
    const roomToAssign = vacantRooms[0];
    onAdmitPatient({
      name: newPatientName.trim() || 'New Patient',
      age: parseInt(newPatientAge, 10) || 30,
      gender: newPatientGender,
      roomNumber: roomToAssign
    });
    setNewPatientName('');
    setShowAdmitModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
      
      {/* Top Banner: Administrative Overview */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ background: 'rgba(2, 132, 199, 0.2)', padding: '0.35rem', borderRadius: '8px' }}>
                <Building2 size={16} color="#38bdf8" />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Administration & Bed Turnover Center
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Eliminating discharge communication latency and maintaining strict 74-bed capacity controls.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {isFullCapacity ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                background: 'rgba(239, 68, 68, 0.15)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#f87171'
              }}>
                <AlertOctagon size={14} />
                Facility Full (74/74 Beds)
              </div>
            ) : (
              <button 
                onClick={() => setShowAdmitModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
              >
                <UserPlus size={14} />
                Admit Patient ({vacantRooms.length} Vacant)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="two-column-split">
        
        {/* Left: Pending Discharge Approvals */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                Pending Discharge Queue ({pendingDischarges.length})
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Patients authorized by Doctor based on the 3-day no-fever criterion. Action required to free beds immediately.
              </p>
            </div>
            <span className="badge badge-discharge" style={{ fontSize: '0.72rem' }}>
              <Clock size={11} /> Real-time Alert
            </span>
          </div>

          {pendingDischarges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#0b111e', borderRadius: '12px' }}>
              <CheckCircle2 size={32} color="#64748b" style={{ margin: '0 auto 0.45rem auto' }} />
              <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>
                No Discharges Awaiting Administrative Action
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '360px', margin: '0.25rem auto 0 auto' }}>
                Zero latency! All doctor-cleared patients have been processed and their beds sanitized.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingDischarges.map(patient => (
                <div 
                  key={patient.id}
                  style={{
                    background: '#131b2c',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.65rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ background: '#1e293b', color: '#38bdf8', padding: '0.12rem 0.4rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        Room {patient.roomNumber}
                      </span>
                      <strong 
                        onClick={() => onSelectPatient(patient)}
                        style={{ fontSize: '0.9rem', color: '#f8fafc', cursor: 'pointer' }}
                      >
                        {patient.name}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      Cured: 3 full days fever-free ({patient.todayTemperature}°F today)
                    </p>
                  </div>

                  <button 
                    onClick={() => onDischargePatient(patient.id)}
                    className="btn btn-success"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
                  >
                    <Sparkles size={13} />
                    Discharge & Free Bed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quality & Mortality Benchmark Deep Dive */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Quality & Mortality Benchmark
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Mandated performance tracking against the 15% mortality / 85% success benchmark.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ background: '#0b111e', padding: '0.75rem', borderRadius: '10px', border: '1px solid #1a2333' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#94a3b8' }}>Total Closed/Resolved Cases:</span>
                <strong style={{ color: '#f8fafc' }}>{totalResolved} patients</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#94a3b8' }}>Successfully Cured:</span>
                <strong style={{ color: '#34d399' }}>{closedCases.dischargedCount} ({recoveryRate}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94a3b8' }}>Clinical Mortalities:</span>
                <strong style={{ color: isMortalityExceeded ? '#f87171' : '#fbbf24' }}>
                  {closedCases.deceasedCount} ({mortalityRate}%)
                </strong>
              </div>
            </div>

            {/* Benchmark Comparison Card */}
            <div style={{ 
              background: isMortalityExceeded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
              padding: '0.85rem', 
              borderRadius: '10px',
              border: `1px solid ${isMortalityExceeded ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                {isMortalityExceeded ? (
                  <ShieldAlert size={16} color="#f87171" />
                ) : (
                  <CheckCircle2 size={16} color="#34d399" />
                )}
                <strong style={{ fontSize: '0.82rem', color: isMortalityExceeded ? '#f87171' : '#34d399' }}>
                  {isMortalityExceeded ? 'Mortality Exceeds Expected Benchmark' : 'Mortality Within Benchmark'}
                </strong>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Current mortality is <strong>{mortalityRate}%</strong> vs <strong>15.0%</strong> benchmark. 
                {isMortalityExceeded 
                  ? ' Clinical review advised.' 
                  : ' Center is meeting the 85% success benchmark.'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Admit New Patient */}
      {showAdmitModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowAdmitModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
              Admit New Patient to Quarantine Facility
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Assigning sanitized room (Room {vacantRooms[0] || 'N/A'}).
            </p>

            <form onSubmit={handleAdmit}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                  Full Patient Name:
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    background: '#0b111e',
                    border: '1px solid #1f293d',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    Age:
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="110" 
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      background: '#0b111e',
                      border: '1px solid #1f293d',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    Gender:
                  </label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      background: '#0b111e',
                      border: '1px solid #1f293d',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button 
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem' }}
                >
                  Confirm Admission (Room {vacantRooms[0]})
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
