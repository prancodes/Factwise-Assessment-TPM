import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Thermometer, 
  Stethoscope, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import { FEVER_THRESHOLD_F } from '../data/mockPatients';

export default function BedGrid({ 
  patients, 
  onSelectPatient, 
  onLogTempClick,
  onDoctorVisitClick,
  onDischargeClick
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPatients = patients.filter(patient => {
    // Search query match
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.roomNumber.toString().includes(searchQuery) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter type match
    if (filterType === 'awaiting_nurse') {
      return !patient.tempTakenToday;
    }
    if (filterType === 'ready_for_doctor') {
      return patient.tempTakenToday && !patient.doctorVisitedToday;
    }
    if (filterType === 'ready_for_discharge') {
      return patient.feverFreeDays >= 3;
    }
    if (filterType === 'high_fever') {
      return patient.todayTemperature && patient.todayTemperature >= 100.4;
    }
    return true;
  });

  const awaitingNurseCount = patients.filter(p => !p.tempTakenToday).length;
  const readyForDoctorCount = patients.filter(p => p.tempTakenToday && !p.doctorVisitedToday).length;
  const readyForDischargeCount = patients.filter(p => p.feverFreeDays >= 3).length;
  const highFeverCount = patients.filter(p => p.todayTemperature && p.todayTemperature >= 100.4).length;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
      
      {/* Top Filter & Search Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        marginBottom: '1.25rem' 
      }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
            Quarantine Facility Bed Matrix (Rooms 1 - 74)
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Interactive ward directory showing real-time temperature, doctor round, and 3-day fever-free discharge status.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search Room # or Patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              background: '#0b111e',
              border: '1px solid #1f293d',
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setFilterType('all')}
          className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          All Rooms ({patients.length})
        </button>

        <button 
          onClick={() => setFilterType('awaiting_nurse')}
          className={`btn ${filterType === 'awaiting_nurse' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <Thermometer size={14} color="#fbbf24" />
          Awaiting Nurse ({awaitingNurseCount})
        </button>

        <button 
          onClick={() => setFilterType('ready_for_doctor')}
          className={`btn ${filterType === 'ready_for_doctor' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <Stethoscope size={14} color="#818cf8" />
          Ready for Doctor ({readyForDoctorCount})
        </button>

        <button 
          onClick={() => setFilterType('ready_for_discharge')}
          className={`btn ${filterType === 'ready_for_discharge' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <Sparkles size={14} color="#34d399" />
          3-Day Cured / Discharge Ready ({readyForDischargeCount})
        </button>

        <button 
          onClick={() => setFilterType('high_fever')}
          className={`btn ${filterType === 'high_fever' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          <AlertCircle size={14} color="#f87171" />
          High Fever &ge; 100.4°F ({highFeverCount})
        </button>
      </div>

      {/* Grid of 74 Beds */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
        gap: '0.85rem' 
      }}>
        {filteredPatients.map((patient) => {
          const hasFever = patient.todayTemperature !== null && patient.todayTemperature >= FEVER_THRESHOLD_F;
          const is3DayFeverFree = patient.feverFreeDays >= 3;

          return (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              style={{
                background: '#131b2c',
                border: is3DayFeverFree 
                  ? '1px solid rgba(16, 185, 129, 0.4)' 
                  : hasFever 
                    ? '1px solid rgba(239, 68, 68, 0.35)' 
                    : '1px solid #1e293b',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = is3DayFeverFree 
                  ? 'rgba(16, 185, 129, 0.4)' 
                  : hasFever 
                    ? 'rgba(239, 68, 68, 0.35)' 
                    : '#1e293b';
              }}
            >
              {/* Top Row: Room Number & Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ 
                  background: '#1e293b', 
                  color: '#38bdf8', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700 
                }}>
                  Room {String(patient.roomNumber).padStart(2, '0')}
                </span>

                {is3DayFeverFree ? (
                  <span className="badge badge-discharge">
                    <Sparkles size={11} /> Cured (3d)
                  </span>
                ) : patient.tempTakenToday ? (
                  hasFever ? (
                    <span className="badge badge-fever">
                      Fever
                    </span>
                  ) : (
                    <span className="badge badge-normal">
                      Normal
                    </span>
                  )
                ) : (
                  <span className="badge badge-pending">
                    Needs Temp
                  </span>
                )}
              </div>

              {/* Patient Name & Details */}
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {patient.name}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {patient.age} yrs • {patient.gender} • Day {patient.admittedDaysAgo} in Care
                </p>
              </div>

              {/* Vital Stat Box */}
              <div style={{ 
                background: '#0b111e', 
                padding: '0.55rem 0.75rem', 
                borderRadius: '8px', 
                marginBottom: '0.75rem',
                border: '1px solid #1a2333'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>Today's Temp:</span>
                  {patient.tempTakenToday ? (
                    <span style={{ 
                      fontWeight: 700, 
                      color: hasFever ? '#f87171' : '#34d399',
                      fontSize: '0.85rem'
                    }}>
                      {patient.todayTemperature}°F
                    </span>
                  ) : (
                    <span style={{ color: '#fbbf24', fontStyle: 'italic', fontSize: '0.75rem' }}>
                      Not recorded
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  <span style={{ color: '#94a3b8' }}>Doctor Round:</span>
                  {patient.doctorVisitedToday ? (
                    <span style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <CheckCircle size={12} /> Visited
                    </span>
                  ) : (
                    <span style={{ color: '#64748b' }}>Pending</span>
                  )}
                </div>
              </div>

              {/* 3-Day Fever-Free Streak Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>Fever-Free Streak:</span>
                <div className="streak-container">
                  <div className={`streak-dot ${patient.feverFreeDays >= 1 ? 'active' : ''}`} title="Day 1 Fever Free" />
                  <div className={`streak-dot ${patient.feverFreeDays >= 2 ? 'active' : ''}`} title="Day 2 Fever Free" />
                  <div className={`streak-dot ${patient.feverFreeDays >= 3 ? 'active' : ''}`} title="Day 3 Fever Free (Cured!)" />
                  <span style={{ marginLeft: '4px', fontWeight: 700, color: patient.feverFreeDays >= 3 ? '#34d399' : '#cbd5e1' }}>
                    {patient.feverFreeDays}/3d
                  </span>
                </div>
              </div>

              {/* Action Strip */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid #1e293b', display: 'flex', gap: '0.4rem' }}>
                {!patient.tempTakenToday ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogTempClick(patient);
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem' }}
                  >
                    <Thermometer size={13} />
                    Log Temp
                  </button>
                ) : !patient.doctorVisitedToday ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDoctorVisitClick(patient);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem', borderColor: '#6366f1', color: '#a5b4fc' }}
                  >
                    <Stethoscope size={13} />
                    Doctor Visit
                  </button>
                ) : is3DayFeverFree && patient.doctorRecommendedDischarge ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDischargeClick(patient);
                    }}
                    className="btn btn-success"
                    style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem' }}
                  >
                    <Sparkles size={13} />
                    Discharge
                  </button>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPatient(patient);
                    }}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.72rem', padding: '0.35rem' }}
                  >
                    Dossier <ArrowRight size={12} />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
