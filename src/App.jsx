import React, { useState } from 'react';
import Header from './components/Header';
import KPIStats from './components/KPIStats';
import BedGrid from './components/BedGrid';
import NurseStation from './components/NurseStation';
import DoctorRounds from './components/DoctorRounds';
import AdminDesk from './components/AdminDesk';
import PatientDetailModal from './components/PatientDetailModal';
import LogTemperatureModal from './components/LogTemperatureModal';
import AssessmentModal from './components/AssessmentModal';
import { 
  generateInitialPatients, 
  INITIAL_CLOSED_CASES, 
  INITIAL_BED_COUNT, 
  FEVER_THRESHOLD_F 
} from './data/mockPatients';

export default function App() {
  const [patients, setPatients] = useState(() => generateInitialPatients());
  const [closedCases, setClosedCases] = useState(() => ({ ...INITIAL_CLOSED_CASES }));
  const [currentDay, setCurrentDay] = useState(1);
  const [activeRole, setActiveRole] = useState('overview'); // 'overview' | 'nurse' | 'doctor' | 'admin'

  // Modals
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loggingTempPatient, setLoggingTempPatient] = useState(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // Active patients (not discharged or deceased)
  const activePatients = patients.filter(p => p.status !== 'discharged' && p.status !== 'deceased');
  const nurseCheckedCount = activePatients.filter(p => p.tempTakenToday).length;
  const doctorVisitedCount = activePatients.filter(p => p.doctorVisitedToday).length;
  const pendingDischargesCount = activePatients.filter(p => p.doctorRecommendedDischarge).length;
  const pendingNurseCount = activePatients.filter(p => !p.tempTakenToday).length;
  const readyDoctorCount = activePatients.filter(p => p.tempTakenToday && !p.doctorVisitedToday).length;

  // Actions
  const handleLogTemperature = (patientId, tempInF, notes = '') => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;

      const hasFever = tempInF >= FEVER_THRESHOLD_F;
      // If patient already had temp today, don't increment streak twice
      let newStreak = p.feverFreeDays;
      if (hasFever) {
        newStreak = 0;
      } else if (!p.tempTakenToday) {
        newStreak = Math.min(3, p.feverFreeDays + 1);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedHistory = p.tempTakenToday 
        ? p.temperatureHistory 
        : [{ day: currentDay, temp: tempInF, hasFever, date: `Day ${currentDay}` }, ...p.temperatureHistory];

      return {
        ...p,
        tempTakenToday: true,
        todayTemperature: tempInF,
        todayTempTimestamp: timeStr,
        todayNurseName: 'Nurse Ward Staff',
        feverFreeDays: newStreak,
        temperatureHistory: updatedHistory,
        isEmergency: tempInF >= 103.0
      };
    }));

    // Update selected patient if open
    setSelectedPatient(prev => prev && prev.id === patientId ? {
      ...prev,
      tempTakenToday: true,
      todayTemperature: tempInF,
      feverFreeDays: tempInF >= FEVER_THRESHOLD_F ? 0 : Math.min(3, prev.feverFreeDays + 1)
    } : prev);
  };

  const handleCompleteDoctorVisit = (patientId, doctorNotes) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      return {
        ...p,
        doctorVisitedToday: true,
        todayDoctorNotes: doctorNotes
      };
    }));

    setSelectedPatient(prev => prev && prev.id === patientId ? {
      ...prev,
      doctorVisitedToday: true,
      todayDoctorNotes: doctorNotes
    } : prev);
  };

  const handleRecommendDischarge = (patientId) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      return {
        ...p,
        doctorRecommendedDischarge: true,
        status: 'ready_for_discharge'
      };
    }));

    setSelectedPatient(prev => prev && prev.id === patientId ? {
      ...prev,
      doctorRecommendedDischarge: true,
      status: 'ready_for_discharge'
    } : prev);

    alert("Doctor authorization confirmed: Patient recommended for immediate administrative discharge!");
  };

  const handleDischargePatient = (patientId) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    setClosedCases(prev => ({
      ...prev,
      dischargedCount: prev.dischargedCount + 1
    }));
    alert("Administrative discharge complete: Patient safely discharged. Bed is now marked sanitized and available for intake.");
  };

  const handleMarkDeceased = (patientId) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    setClosedCases(prev => ({
      ...prev,
      deceasedCount: prev.deceasedCount + 1
    }));
    alert("Clinical outcome recorded. Facility mortality rate has been updated.");
  };

  const handleAdmitPatient = ({ name, age, gender, roomNumber }) => {
    if (activePatients.length >= INITIAL_BED_COUNT) {
      alert("Facility is at maximum capacity (74 beds). Cannot admit new patients.");
      return;
    }

    const newPatient = {
      id: `P-${Date.now().toString().slice(-4)}`,
      roomNumber,
      name,
      age,
      gender,
      admittedDaysAgo: 1,
      status: 'active',
      tempTakenToday: false,
      todayTemperature: null,
      todayTempTimestamp: null,
      todayNurseName: null,
      doctorVisitedToday: false,
      todayDoctorNotes: '',
      doctorRecommendedDischarge: false,
      feverFreeDays: 0,
      temperatureHistory: [],
      isEmergency: false,
      medications: ['Antiviral Protocol Alpha', 'Hydration Therapy']
    };

    setPatients(prev => [...prev, newPatient]);
    alert(`Patient ${name} successfully admitted into Room ${roomNumber}.`);
  };

  const handleSimulateNextDay = () => {
    const nextDay = currentDay + 1;
    setCurrentDay(nextDay);

    // Roll day over: reset daily check flags for active patients
    setPatients(prev => prev.map(p => {
      if (p.status === 'discharged' || p.status === 'deceased') return p;
      return {
        ...p,
        admittedDaysAgo: p.admittedDaysAgo + 1,
        tempTakenToday: false,
        todayTemperature: null,
        todayTempTimestamp: null,
        doctorVisitedToday: false,
        todayDoctorNotes: ''
      };
    }));

    alert(`Simulation Advanced: Welcome to Facility Day ${nextDay}! Morning nurse triage rounds have begun for all active beds.`);
  };

  const handleResetData = () => {
    if (confirm("Reset simulation to default 74-bed scenario?")) {
      setPatients(generateInitialPatients());
      setClosedCases({ ...INITIAL_CLOSED_CASES });
      setCurrentDay(1);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header 
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentDay={currentDay}
        onSimulateNextDay={handleSimulateNextDay}
        onResetData={handleResetData}
        onOpenAssessment={() => setShowAssessmentModal(true)}
        pendingDischargesCount={pendingDischargesCount}
        pendingNurseCount={pendingNurseCount}
        readyDoctorCount={readyDoctorCount}
      />

      {/* Top Facility KPI Cards */}
      <KPIStats 
        totalBeds={INITIAL_BED_COUNT}
        activePatientsCount={activePatients.length}
        nurseCheckedCount={nurseCheckedCount}
        doctorVisitedCount={doctorVisitedCount}
        pendingDischargesCount={pendingDischargesCount}
        closedCases={closedCases}
      />

      {/* Dynamic Role Views */}
      {activeRole === 'overview' && (
        <BedGrid 
          patients={activePatients}
          onSelectPatient={(p) => setSelectedPatient(p)}
          onLogTempClick={(p) => setLoggingTempPatient(p)}
          onDoctorVisitClick={(p) => {
            setActiveRole('doctor');
          }}
          onDischargeClick={(p) => handleDischargePatient(p.id)}
        />
      )}

      {activeRole === 'nurse' && (
        <NurseStation 
          patients={activePatients}
          onLogTemperature={handleLogTemperature}
          onOpenLogModal={(p) => setLoggingTempPatient(p)}
          onSelectPatient={(p) => setSelectedPatient(p)}
        />
      )}

      {activeRole === 'doctor' && (
        <DoctorRounds 
          patients={activePatients}
          onCompleteDoctorVisit={handleCompleteDoctorVisit}
          onRecommendDischarge={handleRecommendDischarge}
          onMarkDeceased={handleMarkDeceased}
          onSelectPatient={(p) => setSelectedPatient(p)}
        />
      )}

      {activeRole === 'admin' && (
        <AdminDesk 
          patients={activePatients}
          closedCases={closedCases}
          onDischargePatient={handleDischargePatient}
          onAdmitPatient={handleAdmitPatient}
          onSelectPatient={(p) => setSelectedPatient(p)}
        />
      )}

      {/* Patient Dossier Modal */}
      {selectedPatient && (
        <PatientDetailModal 
          patient={patients.find(p => p.id === selectedPatient.id) || selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onLogTempClick={(p) => setLoggingTempPatient(p)}
          onDoctorVisitClick={() => setActiveRole('doctor')}
          onRecommendDischarge={handleRecommendDischarge}
          onDischargeClick={handleDischargePatient}
        />
      )}

      {/* Log Temperature Modal */}
      {loggingTempPatient && (
        <LogTemperatureModal 
          patient={patients.find(p => p.id === loggingTempPatient.id) || loggingTempPatient}
          onClose={() => setLoggingTempPatient(null)}
          onSubmit={handleLogTemperature}
        />
      )}

      {/* TPM Assessment Answers Modal */}
      {showAssessmentModal && (
        <AssessmentModal 
          onClose={() => setShowAssessmentModal(false)}
        />
      )}
    </div>
  );
}
