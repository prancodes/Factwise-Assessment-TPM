import React from 'react';
import { 
  Bed, 
  Thermometer, 
  Stethoscope, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2
} from 'lucide-react';
import { BENCHMARK_MORTALITY_RATE, BENCHMARK_RECOVERY_RATE } from '../data/mockPatients';

export default function KPIStats({ 
  totalBeds, 
  activePatientsCount, 
  nurseCheckedCount, 
  doctorVisitedCount, 
  pendingDischargesCount,
  closedCases 
}) {
  const totalResolved = closedCases.dischargedCount + closedCases.deceasedCount;
  const mortalityRate = totalResolved > 0 
    ? +((closedCases.deceasedCount / totalResolved) * 100).toFixed(1) 
    : 0;
  const recoveryRate = totalResolved > 0 
    ? +((closedCases.dischargedCount / totalResolved) * 100).toFixed(1) 
    : 0;

  const isMortalityExceeded = mortalityRate > BENCHMARK_MORTALITY_RATE;
  const nursePercent = activePatientsCount > 0 ? Math.round((nurseCheckedCount / activePatientsCount) * 100) : 0;
  const doctorPercent = activePatientsCount > 0 ? Math.round((doctorVisitedCount / activePatientsCount) * 100) : 0;

  return (
    <div className="kpi-grid">
      
      {/* 1. Bed Occupancy */}
      <div className="glass-panel" style={{ padding: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Bed Occupancy
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                {activePatientsCount}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
                / {totalBeds} Beds
              </span>
            </div>
          </div>
          <div style={{ 
            background: activePatientsCount >= totalBeds ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 132, 199, 0.15)', 
            padding: '0.55rem', 
            borderRadius: '10px',
            border: `1px solid ${activePatientsCount >= totalBeds ? 'rgba(239, 68, 68, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`
          }}>
            <Bed size={20} color={activePatientsCount >= totalBeds ? '#f87171' : '#38bdf8'} />
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.35rem', color: '#94a3b8' }}>
            <span>Capacity</span>
            <span style={{ fontWeight: 700, color: activePatientsCount >= totalBeds ? '#f87171' : '#38bdf8' }}>
              {Math.round((activePatientsCount / totalBeds) * 100)}% {activePatientsCount >= totalBeds ? '(FULL)' : ''}
            </span>
          </div>
          <div style={{ height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${Math.min(100, (activePatientsCount / totalBeds) * 100)}%`, 
              height: '100%', 
              background: activePatientsCount >= totalBeds ? '#ef4444' : '#0284c7',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>

      {/* 2. Nurse Temp Checks */}
      <div className="glass-panel" style={{ padding: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Nurse Daily Checks
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                {nurseCheckedCount}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
                / {activePatientsCount} Done
              </span>
            </div>
          </div>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.15)', 
            padding: '0.55rem', 
            borderRadius: '10px',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <Thermometer size={20} color="#fbbf24" />
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.35rem', color: '#94a3b8' }}>
            <span>Morning Round</span>
            <span style={{ fontWeight: 700, color: '#fbbf24' }}>
              {nursePercent}% ({activePatientsCount - nurseCheckedCount} left)
            </span>
          </div>
          <div style={{ height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${nursePercent}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>

      {/* 3. Doctor Rounds */}
      <div className="glass-panel" style={{ padding: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              Doctor Rounds
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
                {doctorVisitedCount}
              </span>
              <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>
                / {activePatientsCount} Visited
              </span>
            </div>
          </div>
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.15)', 
            padding: '0.55rem', 
            borderRadius: '10px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <Stethoscope size={20} color="#a5b4fc" />
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.35rem', color: '#94a3b8' }}>
            <span>Compliance</span>
            <span style={{ fontWeight: 700, color: '#a5b4fc' }}>
              {doctorPercent}% ({activePatientsCount - doctorVisitedCount} left)
            </span>
          </div>
          <div style={{ height: '6px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${doctorPercent}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #6366f1, #818cf8)',
              borderRadius: '4px'
            }} />
          </div>
        </div>
      </div>

      {/* 4. Quality Benchmark */}
      <div className="glass-panel" style={{ 
        padding: '1.15rem',
        border: isMortalityExceeded ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #1f293d'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                Mortality Benchmark
              </p>
              {isMortalityExceeded ? (
                <span className="badge badge-fever alert-pulse" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                  Alert &gt; 15%
                </span>
              ) : (
                <span className="badge badge-normal" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                  Target Met
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.2rem' }}>
              <span style={{ 
                fontSize: '1.75rem', 
                fontWeight: 800, 
                color: isMortalityExceeded ? '#f87171' : '#34d399' 
              }}>
                {mortalityRate}%
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                vs {BENCHMARK_MORTALITY_RATE}% Target
              </span>
            </div>
          </div>

          <div style={{ 
            background: isMortalityExceeded ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
            padding: '0.55rem', 
            borderRadius: '10px',
            border: `1px solid ${isMortalityExceeded ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
          }}>
            {isMortalityExceeded ? (
              <AlertTriangle size={20} color="#f87171" />
            ) : (
              <CheckCircle2 size={20} color="#34d399" />
            )}
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', flexWrap: 'wrap', gap: '4px' }}>
          <span>Recovery: <strong style={{ color: '#34d399' }}>{recoveryRate}%</strong></span>
          <span>{closedCases.deceasedCount} Deaths / {totalResolved} Resolved</span>
        </div>
      </div>

    </div>
  );
}
