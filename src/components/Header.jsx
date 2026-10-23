import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Thermometer, 
  Building2, 
  LayoutGrid, 
  Calendar, 
  RotateCcw, 
  FileText
} from 'lucide-react';

export default function Header({ 
  activeRole, 
  setActiveRole, 
  currentDay, 
  onSimulateNextDay, 
  onResetData, 
  onOpenAssessment,
  pendingDischargesCount,
  pendingNurseCount,
  readyDoctorCount
}) {
  return (
    <header className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
      <div className="header-wrapper">
        
        {/* Brand */}
        <div className="header-brand">
          <div style={{ 
            background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)', 
            borderRadius: '12px', 
            padding: '0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            flexShrink: 0
          }}>
            <Activity size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                QuarantineCare
              </h1>
              <span style={{ 
                fontSize: '0.68rem', 
                background: 'rgba(2, 132, 199, 0.2)', 
                color: '#38bdf8', 
                padding: '0.12rem 0.45rem', 
                borderRadius: '999px',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                FactWise Portal
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Virus Quarantine & Treatment Facility — 74 Beds
            </p>
          </div>
        </div>

        {/* Persona Switcher Tabs (Scrollable on small mobile) */}
        <div className="header-tabs-container">
          <button 
            onClick={() => setActiveRole('overview')}
            className={`btn ${activeRole === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', flexShrink: 0 }}
          >
            <LayoutGrid size={14} />
            74-Bed Grid
          </button>

          <button 
            onClick={() => setActiveRole('nurse')}
            className={`btn ${activeRole === 'nurse' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', position: 'relative', flexShrink: 0 }}
          >
            <Thermometer size={14} />
            Nurse Station
            {pendingNurseCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#000',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                marginLeft: '0.2rem'
              }}>
                {pendingNurseCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveRole('doctor')}
            className={`btn ${activeRole === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', position: 'relative', flexShrink: 0 }}
          >
            <Stethoscope size={14} />
            Doctor Rounds
            {readyDoctorCount > 0 && (
              <span style={{
                background: '#6366f1',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                marginLeft: '0.2rem'
              }}>
                {readyDoctorCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveRole('admin')}
            className={`btn ${activeRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', position: 'relative', flexShrink: 0 }}
          >
            <Building2 size={14} />
            Admin & Beds
            {pendingDischargesCount > 0 && (
              <span style={{
                background: '#10b981',
                color: '#000',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '0.1rem 0.35rem',
                borderRadius: '999px',
                marginLeft: '0.2rem'
              }}>
                {pendingDischargesCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Controls: Simulation & Assessment */}
        <div className="header-actions">
          
          {/* Day Counter badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid #334155',
            padding: '0.4rem 0.7rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: '#e2e8f0',
            whiteSpace: 'nowrap'
          }}>
            <Calendar size={13} color="#38bdf8" />
            <span>Day: <strong>{currentDay}</strong></span>
          </div>

          <button 
            onClick={onSimulateNextDay}
            className="btn btn-secondary"
            title="Advance quarantine simulation by 1 day to test fever-free streak progression"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Calendar size={13} />
            Next Day (+1)
          </button>

          <button 
            onClick={onResetData}
            className="btn btn-secondary"
            title="Reset to default 74-bed occupancy scenario"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem' }}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          {/* Assessment Answers Button */}
          <button 
            onClick={onOpenAssessment}
            className="btn"
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
              color: '#ffffff',
              border: '1px solid #a78bfa',
              fontSize: '0.78rem', 
              padding: '0.4rem 0.85rem',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.35)'
            }}
          >
            <FileText size={14} />
            TPM Answers
          </button>

        </div>

      </div>
    </header>
  );
}
