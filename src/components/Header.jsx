import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Thermometer, 
  Building2, 
  LayoutGrid, 
  Calendar, 
  RotateCcw, 
  FileText,
  ShieldAlert
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
    <header className="glass-panel" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)', 
            borderRadius: '12px', 
            padding: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}>
            <Activity size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                QuarantineCare
              </h1>
              <span style={{ 
                fontSize: '0.7rem', 
                background: 'rgba(2, 132, 199, 0.2)', 
                color: '#38bdf8', 
                padding: '0.15rem 0.5rem', 
                borderRadius: '999px',
                fontWeight: 700,
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                FactWise Portal
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Virus Quarantine & Treatment Facility — 74-Bed Clinical Operations
            </p>
          </div>
        </div>

        {/* Persona Switcher Tabs */}
        <div style={{ 
          display: 'flex', 
          background: '#0b111e', 
          padding: '0.3rem', 
          borderRadius: '10px', 
          border: '1px solid #1f293d',
          gap: '0.25rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setActiveRole('overview')}
            className={`btn ${activeRole === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <LayoutGrid size={15} />
            74-Bed Grid
          </button>

          <button 
            onClick={() => setActiveRole('nurse')}
            className={`btn ${activeRole === 'nurse' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', position: 'relative' }}
          >
            <Thermometer size={15} />
            Nurse Station
            {pendingNurseCount > 0 && (
              <span style={{
                background: '#f59e0b',
                color: '#000',
                fontSize: '0.65rem',
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
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', position: 'relative' }}
          >
            <Stethoscope size={15} />
            Doctor Rounds
            {readyDoctorCount > 0 && (
              <span style={{
                background: '#6366f1',
                color: '#fff',
                fontSize: '0.65rem',
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
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', position: 'relative' }}
          >
            <Building2 size={15} />
            Admin & Discharges
            {pendingDischargesCount > 0 && (
              <span style={{
                background: '#10b981',
                color: '#000',
                fontSize: '0.65rem',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          
          {/* Day Counter badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid #334155',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#e2e8f0'
          }}>
            <Calendar size={14} color="#38bdf8" />
            <span>Facility Day: <strong>{currentDay}</strong></span>
          </div>

          <button 
            onClick={onSimulateNextDay}
            className="btn btn-secondary"
            title="Advance quarantine simulation by 1 day to test fever-free streak progression"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            <Calendar size={14} />
            Simulate Next Day (+1)
          </button>

          <button 
            onClick={onResetData}
            className="btn btn-secondary"
            title="Reset to default 74-bed occupancy scenario"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.7rem' }}
          >
            <RotateCcw size={14} />
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
              fontSize: '0.8rem', 
              padding: '0.45rem 0.95rem',
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.35)'
            }}
          >
            <FileText size={15} />
            TPM Answers (Q1 - Q4)
          </button>

        </div>

      </div>
    </header>
  );
}
