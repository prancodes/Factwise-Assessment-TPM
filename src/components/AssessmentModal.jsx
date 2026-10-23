import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  ShieldCheck, 
  Sliders, 
  Copy, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function AssessmentModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('q1'); // 'q1' | 'q2' | 'q3' | 'q4' | 'export'
  const [copied, setCopied] = useState(false);

  // Q4 interactive state
  const ALL_FEATURES = [
    { id: 'A', priority: 'High', effort: 1.0, value: 6, desc: 'Critical Temperature Sync API' },
    { id: 'B', priority: 'High', effort: 3.0, value: 6, desc: 'Doctor Round Prioritization Engine' },
    { id: 'C', priority: 'High', effort: 5.0, value: 6, desc: 'Legacy Paper Journal OCR Importer' },
    { id: 'D', priority: 'Medium', effort: 2.0, value: 3, desc: 'Automated Bed Turnover Alert' },
    { id: 'E', priority: 'Medium', effort: 3.0, value: 3, desc: 'Custom Nurse Shift Handover Notes' },
    { id: 'F', priority: 'Medium', effort: 1.0, value: 3, desc: 'Fever-Free Streak Milestone Badge' },
    { id: 'G', priority: 'Low', effort: 0.4, value: 1, desc: 'Dark / High-Contrast Mode Toggle' },
    { id: 'H', priority: 'Low', effort: 0.5, value: 1, desc: 'Patient CSV Export for Ministry' },
    { id: 'I', priority: 'Low', effort: 0.3, value: 1, desc: 'Sound Alert on Emergency Fever' },
    { id: 'J', priority: 'Low', effort: 0.1, value: 1, desc: 'Keyboard Shortcut for Quick-Log' },
  ];

  const OPTIMAL_IDS = ['A', 'B', 'D', 'F', 'G', 'H', 'I', 'J'];
  const NAIVE_IDS = ['A', 'B', 'C', 'F'];

  const [selectedFeatures, setSelectedFeatures] = useState(OPTIMAL_IDS);

  const toggleFeature = (id) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const currentEffort = +(selectedFeatures.reduce((acc, id) => {
    const f = ALL_FEATURES.find(x => x.id === id);
    return acc + (f ? f.effort : 0);
  }, 0)).toFixed(1);

  const currentValue = selectedFeatures.reduce((acc, id) => {
    const f = ALL_FEATURES.find(x => x.id === id);
    return acc + (f ? f.value : 0);
  }, 0);

  const isOverCapacity = currentEffort > 10.0;

  const handleCopy = () => {
    const fullText = document.getElementById('assessment-markdown-text')?.innerText || '';
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '94vh' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid #1f293d', paddingBottom: '0.85rem', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: '#7c3aed', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                FactWise TPM Assessment
              </span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                Technical Product Manager Solutions (Q1 – Q4)
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Candidate: <strong>Pranjal Jaykumar Singh</strong> • Roll No: <strong>23-ITC27-27</strong>
            </p>
          </div>

          <button 
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.55rem', borderRadius: '50%', flexShrink: 0 }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="assessment-tabs-scrollable">
          <button 
            onClick={() => setActiveTab('q1')}
            className={`btn ${activeTab === 'q1' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            Q1: User Types & Roles
          </button>

          <button 
            onClick={() => setActiveTab('q2')}
            className={`btn ${activeTab === 'q2' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            Q2: Prototype & Workflow
          </button>

          <button 
            onClick={() => setActiveTab('q3')}
            className={`btn ${activeTab === 'q3' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            Q3: Logical Constraints
          </button>

          <button 
            onClick={() => setActiveTab('q4')}
            className={`btn ${activeTab === 'q4' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Calculator size={14} />
            Q4: Knapsack Solution
          </button>

          <button 
            onClick={() => setActiveTab('export')}
            className={`btn ${activeTab === 'export' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
          >
            <Copy size={14} />
            Submission Export
          </button>
        </div>

        {/* TAB 1: Q1 */}
        {activeTab === 'q1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#0b111e', padding: '1rem', borderRadius: '10px', border: '1px solid #1f293d' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>
                Question 1: In your app’s first version, what are the different kinds of users, and which features and actions are relevant for which user types?
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                To solve the facility’s severe coordination breakdown, the v1.0 architecture defines three operational user roles, each with strict action permissions and purpose-built queues.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {/* Nurse Card */}
              <div style={{ background: '#131b2c', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    1. Nurse
                  </span>
                  <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>Daily Diagnostic Logger</strong>
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>Pending Morning Triage Queue:</strong> Filter of patients whose daily temperature has not yet been recorded.</li>
                  <li><strong>Single-Tap Temperature Logger:</strong> Quick input with °F/°C toggle and human range validation (93.0°F – 108.0°F).</li>
                  <li><strong>Duplicate Guard:</strong> Intercepts duplicate daily logs to prevent double-measuring.</li>
                  <li><strong>High Fever Alert Flag:</strong> Immediate flag for temperatures &ge; 103.0°F to escalate care.</li>
                </ul>
              </div>

              {/* Doctor Card */}
              <div style={{ background: '#131b2c', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    2. Doctor
                  </span>
                  <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>Evaluator & Prescriber</strong>
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>Sequential "Ready for Round" Queue:</strong> Strictly displays patients whose morning temperature has already been logged, eliminating wasted visits.</li>
                  <li><strong>3-Day Fever-Free Streak Tracker:</strong> Real-time audit of the 3-day no-fever discharge criterion.</li>
                  <li><strong>Discharge Recommendation:</strong> Enabled exclusively when 3 consecutive fever-free days are verified.</li>
                  <li><strong>Treatment & Outcome Logging:</strong> Record clinical notes and log mortality outcomes.</li>
                </ul>
              </div>

              {/* Admin Card */}
              <div style={{ background: '#131b2c', border: '1px solid #1e293b', borderRadius: '10px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                  <span style={{ background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    3. Admin / Facility Lead
                  </span>
                  <strong style={{ fontSize: '0.9rem', color: '#f8fafc' }}>Bed & Metric Controller</strong>
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>Pending Discharge Queue:</strong> Instant notification when doctor recommends discharge to eliminate the "1-2 extra days" stay latency.</li>
                  <li><strong>Formal Discharge Execution:</strong> Frees room and marks bed for sanitization.</li>
                  <li><strong>74-Bed Capacity Guard:</strong> Strict block on admissions when total occupancy reaches 74.</li>
                  <li><strong>Mortality & Quality Benchmark:</strong> Real-time tracking against the 15% mortality and 85% success benchmark.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Q2 */}
        {activeTab === 'q2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#0b111e', padding: '1rem', borderRadius: '10px', border: '1px solid #1f293d' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>
                Question 2: Functional Prototype & Working Workflows
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Built as a high-performance React web application with complete interactive simulation, live data state, and deployment-ready architecture for Vercel.
              </p>
            </div>

            <div className="responsive-two-col">
              <div style={{ background: '#131b2c', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                  Demonstrated Core Workflows:
                </h4>
                <ol style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>Nurse Daily Log:</strong> Nurse logs a patient's temperature with 1 click or custom slider. Streak updates automatically.</li>
                  <li><strong>Doctor Sequential Rounds:</strong> Doctor checks patients only after nurse log. Evaluates 3-day fever-free streak.</li>
                  <li><strong>Automated Discharge Recommendation:</strong> Doctor clicks "Recommend for Discharge" when 3/3 days fever-free is met.</li>
                  <li><strong>Administrative Bed Turnover:</strong> Admin executes formal discharge, freeing bed for new intake.</li>
                  <li><strong>Multi-Day Quarantine Simulation:</strong> "Simulate Next Day" button allows evaluators to simulate successive days and verify streak advancement.</li>
                </ol>
              </div>

              <div style={{ background: '#131b2c', padding: '1rem', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                  Screen & UI Architecture:
                </h4>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>74-Bed Interactive Matrix:</strong> Bird’s-eye visual view of all 74 rooms with status filters.</li>
                  <li><strong>Nurse Morning Station:</strong> Rapid triage queue with 1-click presets and duplicate guard.</li>
                  <li><strong>Doctor Rounds Station:</strong> Queue partitioned by clinical readiness with locked states.</li>
                  <li><strong>Admin Turnover Desk:</strong> Immediate discharge processing and 74-bed capacity guard.</li>
                  <li><strong>Patient Clinical Dossier:</strong> Full temperature sparklines and medication charts.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Q3 */}
        {activeTab === 'q3' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#0b111e', padding: '1rem', borderRadius: '10px', border: '1px solid #1f293d' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.4rem' }}>
                Question 3: Additional Logical Constraints & Developer Specifications
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Critical backend rules, state machine transitions, and UI guards that cannot be inferred from screen mockups alone.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
              <div style={{ background: '#131b2c', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>1. Sequential Workflow Dependency (Nurse &rarr; Doctor):</strong>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  A patient's card in the Doctor's queue is locked until a Nurse records the calendar day's morning temperature. Doctor visits before temperature logging trigger a confirmation warning to prevent wasted rounds.
                </p>
              </div>

              <div style={{ background: '#131b2c', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>2. 3-Day Fever-Free Reset State Machine:</strong>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Fever threshold is strictly defined as &ge; 99.5°F (37.5°C). If a temperature &ge; 99.5°F is recorded on Day 1, 2, or 3, the consecutive fever-free counter immediately drops to 0. The "Recommend Discharge" button is disabled unless streak == 3.
                </p>
              </div>

              <div style={{ background: '#131b2c', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <strong style={{ color: '#fbbf24', fontSize: '0.85rem' }}>3. Duplicate Measurement Prevention:</strong>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  If a nurse attempts to log a temperature for a patient who already has an entry on that calendar date, the UI presents an explicit warning modal: <em>"Temperature already recorded today (XX.X°F at HH:MM). Acknowledge re-check or typo correction to proceed."</em>
                </p>
              </div>

              <div style={{ background: '#131b2c', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <strong style={{ color: '#ef4444', fontSize: '0.85rem' }}>4. Hard 74-Bed Capacity Guard:</strong>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Facility room capacity is capped at 74. When active occupancy reaches 74/74, the "New Admission" button is disabled. Discharged beds enter a temporary "Sanitizing" state before being re-allocated.
                </p>
              </div>

              <div style={{ background: '#131b2c', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                <strong style={{ color: '#a78bfa', fontSize: '0.85rem' }}>5. Quality Metric Calculation Rule:</strong>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Mortality rate must be calculated exclusively over <strong>closed/resolved cases</strong>: Mortality Rate = [Deceased / (Discharged + Deceased)] * 100%. Active patients cannot be in the denominator. Automated alerts fire if mortality exceeds 15.0%.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Q4 Interactive Knapsack */}
        {activeTab === 'q4' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#0b111e', padding: '1rem', borderRadius: '10px', border: '1px solid #1f293d' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.35rem' }}>
                    Question 4: Sprint Capacity & Knapsack Optimization
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                    Velocity = 25 pts | Committed = 15 pts (3 stories × 5 pts) | <strong>Remaining Capacity = 10 pts</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setSelectedFeatures(OPTIMAL_IDS)}
                    className="btn btn-success"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    Set Optimal {`{A, B, D, F, G, H, I, J}`}
                  </button>
                  <button 
                    onClick={() => setSelectedFeatures(NAIVE_IDS)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                  >
                    Set Naive {`{A, B, C, F}`}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Interactive Knapsack Status Bar */}
            <div style={{ 
              background: isOverCapacity ? 'rgba(239, 68, 68, 0.15)' : '#131b2c',
              border: `1px solid ${isOverCapacity ? '#ef4444' : '#1e293b'}`,
              borderRadius: '10px',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Effort:</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <strong style={{ fontSize: '1.6rem', color: isOverCapacity ? '#f87171' : '#38bdf8' }}>
                    {currentEffort}
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 10.0 Story Points</span>
                  {isOverCapacity && (
                    <span className="badge badge-fever" style={{ marginLeft: '0.5rem' }}>Over Capacity!</span>
                  )}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Delivered Value:</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                  <strong style={{ fontSize: '1.6rem', color: '#34d399' }}>
                    {currentValue} Value Points
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {currentValue === 22 && currentEffort === 8.3 ? '(Max Theoretical Optimum!)' : ''}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', maxWidth: '300px' }}>
                High = 6 pts (2× Med) • Med = 3 pts (3× Low) • Low = 1 pt
              </div>
            </div>

            {/* Feature Selection Table */}
            <div className="table-responsive" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              <table style={{ width: '100%', minWidth: '540px', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f293d', color: '#94a3b8' }}>
                    <th style={{ padding: '0.5rem' }}>Include</th>
                    <th style={{ padding: '0.5rem' }}>Feature</th>
                    <th style={{ padding: '0.5rem' }}>Priority</th>
                    <th style={{ padding: '0.5rem' }}>Effort</th>
                    <th style={{ padding: '0.5rem' }}>Value</th>
                    <th style={{ padding: '0.5rem' }}>ROI (Value/Effort)</th>
                  </tr>
                </thead>
                <tbody>
                  {ALL_FEATURES.map(f => {
                    const isSelected = selectedFeatures.includes(f.id);
                    const roi = (f.value / f.effort).toFixed(2);
                    return (
                      <tr 
                        key={f.id}
                        onClick={() => toggleFeature(f.id)}
                        style={{ 
                          borderBottom: '1px solid #162032', 
                          background: isSelected ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                          cursor: 'pointer' 
                        }}
                      >
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => {}} 
                          />
                        </td>
                        <td style={{ padding: '0.5rem', fontWeight: 700, color: '#f8fafc' }}>
                          Feature {f.id} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.75rem' }}>({f.desc})</span>
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <span className={`badge ${f.priority === 'High' ? 'badge-fever' : f.priority === 'Medium' ? 'badge-pending' : 'badge-normal'}`}>
                            {f.priority}
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>{f.effort} pts</td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399' }}>{f.value}</td>
                        <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{roi}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mathematical Conclusion Box */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '0.85rem' }}>
              <strong style={{ color: '#34d399', fontSize: '0.85rem' }}>
                Mathematical Proof & Recommendation:
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                Select <strong>{'{ A, B, D, F, G, H, I, J }'}</strong>. This combination yields <strong>Value = 22</strong> (the global theoretical maximum) with only <strong>8.3 points of effort</strong>, leaving a 1.7-point safety buffer. Naively picking High feature C (effort 5, value 6, ROI 1.2) caps value at 21 for 10.0 effort.
              </p>
            </div>
          </div>
        )}

        {/* TAB 5: Full Markdown Export */}
        {activeTab === 'export' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  Full Assessment Submission Text
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Copy this complete text to generate your final submission document (Pranjal TPM.pdf).
                </p>
              </div>

              <button 
                onClick={handleCopy}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem' }}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? 'Copied to Clipboard!' : 'Copy All Text'}
              </button>
            </div>

            <pre 
              id="assessment-markdown-text"
              style={{
                background: '#0b111e',
                border: '1px solid #1f293d',
                borderRadius: '10px',
                padding: '1.25rem',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#cbd5e1',
                maxHeight: '440px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5'
              }}
            >
{`FACTWISE ASSESSMENT: TECHNICAL PRODUCT MANAGER
Candidate Submission: Pranjal TPM

================================================================================
Q1) IN YOUR APP'S FIRST VERSION, WHAT ARE THE DIFFERENT KINDS OF USERS, 
AND WHICH FEATURES AND ACTIONS ARE RELEVANT FOR WHICH USER TYPES?
================================================================================

1. NURSE (Daily Diagnostic Triage)
- "Pending Temperature" Queue: Auto-populating filter showing only patients needing morning check.
- Single-Tap Temperature Logging: Rapid entry with °F/°C toggle and validation (93.0°F - 108.0°F).
- Duplicate Entry Guard: Warning dialog to confirm if user is intentionally re-logging a vital.
- Emergency Flag: Immediate escalation of hyperpyrexia (>= 103.0°F) to Doctor's top priority.

2. DOCTOR (Clinical Evaluation & Discharge Recommendation)
- Sequential "Ready for Round" Queue: Strictly displays patients whose temperature has ALREADY been taken today by a nurse, preventing wasted doctor rounds.
- 3-Day Fever-Free Streak Visualizer: Real-time tracking of consecutive days without fever (< 99.5°F).
- Treatment Plan & Daily Notes: Record medication adjustments and clinical progress.
- 1-Click Discharge Recommendation: Enabled ONLY when 3 consecutive fever-free days are verified. Automatically notifies Admin.
- Clinical Mortality Recording: Log deceased outcomes to maintain benchmark tracking.

3. ADMIN / FACILITY MANAGER (Turnover, Admissions & Quality Control)
- Real-time 74-Bed Facility Grid: Bird's-eye view of rooms 1-74 by status.
- Immediate Administrative Discharge: 1-click execution once doctor recommends discharge, eliminating the 1-2 day bed vacancy delay.
- 74-Bed Capacity Guard: Strict block on new admissions when capacity reaches 74/74.
- Quality Benchmark KPI Tracker: Computes mortality rate = Deceased / (Discharged + Deceased) * 100% against the 15% mortality / 85% success benchmark.

================================================================================
Q2) FUNCTIONAL PROTOTYPE OF THE APP (VERCEL DEPLOYMENT & UI FLOW)
================================================================================
Deployable React Web Application featuring:
- Full 74-bed interactive ward matrix with status filters.
- Sequential workflow: Nurse Logs Temp -> Doctor Evaluates -> Doctor Recommends -> Admin Discharges.
- Multi-day quarantine simulator ("Simulate Next Day" button) to test 3-day fever-free streak progression.
- Live mortality vs 15.0% benchmark calculator.

================================================================================
Q3) ADDITIONAL LOGICAL CONSTRAINTS FOR DEVELOPERS
================================================================================
1. Sequential Dependency: Doctor round action is locked until morning temperature is logged by a nurse.
2. 3-Day Fever-Free Rule: Fever threshold is >= 99.5°F (37.5°C). Any temperature >= 99.5°F resets feverFreeDays to 0.
3. Duplicate Prevention: Attempting to log a second temperature on the same date triggers a mandatory confirmation modal.
4. Capacity Constraint: Active patients cannot exceed 74. Admitting a 75th patient throws a validation error.
5. Quality Metric Rule: Mortality rate denominator must only include resolved cases (Discharged + Deceased). Active patients undergoing care are excluded from the denominator.

================================================================================
Q4) SPRINT PLANNING & KNAPSACK OPTIMIZATION
================================================================================
Parameters:
- Velocity: 25 points | Committed: 15 points (3 stories × 5 pts) | Remaining: 10 points
- Value Weight: Low = 1 | Medium = 3 (3x Low) | High = 6 (2x Medium)

Feature Table:
Feature A (High, Effort 1.0, Value 6, ROI 6.00)
Feature B (High, Effort 3.0, Value 6, ROI 2.00)
Feature C (High, Effort 5.0, Value 6, ROI 1.20)
Feature D (Medium, Effort 2.0, Value 3, ROI 1.50)
Feature E (Medium, Effort 3.0, Value 3, ROI 1.00)
Feature F (Medium, Effort 1.0, Value 3, ROI 3.00)
Feature G (Low, Effort 0.4, Value 1, ROI 2.50)
Feature H (Low, Effort 0.5, Value 1, ROI 2.00)
Feature I (Low, Effort 0.3, Value 1, ROI 3.33)
Feature J (Low, Effort 0.1, Value 1, ROI 10.00)

Optimal Solution:
Select { A, B, D, F, G, H, I, J }
- Total Effort: 1.0 + 3.0 + 2.0 + 1.0 + 0.4 + 0.5 + 0.3 + 0.1 = 8.3 story points
- Total Value: 6 + 6 + 3 + 3 + 1 + 1 + 1 + 1 = 22 value points
- Buffer: 1.7 story points remaining for sprint safety

Why this dominates:
The naive selection of High features {A, B, C, F} consumes all 10.0 points but yields only 21 value.
Replacing low-ROI Feature C (effort 5, value 6) with high-density Medium & Low features delivers MORE value (22 pts) with LESS effort (8.3 pts).`}
            </pre>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
