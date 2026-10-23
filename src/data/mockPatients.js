// 74 Realistic Patients for FactWise Virus Quarantine & Treatment Facility
export const INITIAL_BED_COUNT = 74;
export const FEVER_THRESHOLD_F = 99.5;
export const BENCHMARK_MORTALITY_RATE = 15.0; // 15% expected mortality benchmark
export const BENCHMARK_RECOVERY_RATE = 85.0;  // 85% expected recovery benchmark

const FIRST_NAMES = [
  'Aarav', 'Diya', 'Vihaan', 'Ananya', 'Rohan', 'Isha', 'Reyansh', 'Saanvi', 
  'Kabir', 'Myra', 'Aditya', 'Tara', 'Arjun', 'Meera', 'Sai', 'Kavya', 
  'Krishna', 'Pooja', 'Ishaan', 'Rhea', 'Dhruv', 'Neha', 'Dev', 'Aditi',
  'Aryan', 'Sneha', 'Manish', 'Priya', 'Kunal', 'Tanvi', 'Rahul', 'Shreya',
  'Vikram', 'Anika', 'Sameer', 'Nisha', 'Gaurav', 'Divya', 'Siddharth', 'Simran'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Singh', 'Deshmukh', 'Mehta', 'Gupta', 'Joshi',
  'Iyer', 'Chopra', 'Reddy', 'Nair', 'Bhatia', 'Malhotra', 'Kapoor', 'Menon',
  'Saxena', 'Mukherjee', 'Rao', 'Pandey', 'Agarwal', 'Chatterjee', 'Kulkarni'
];

export function generateInitialPatients() {
  const patients = [];

  for (let room = 1; room <= INITIAL_BED_COUNT; room++) {
    const fn = FIRST_NAMES[(room * 3) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(room * 7) % LAST_NAMES.length];
    const age = 18 + ((room * 9) % 65);
    const gender = room % 2 === 0 ? 'Female' : 'Male';
    const admittedDaysAgo = 2 + (room % 10);

    // Varied states across the 74 beds:
    // Bed 1-12: Ready for discharge (3 days consecutive no fever, doctor can recommend or already recommended)
    // Bed 13-35: In active treatment, temperature taken today, awaiting doctor round
    // Bed 36-65: Temperature NOT yet taken today (nurse queue)
    // Bed 66-70: High fever / critical monitoring
    // Bed 71-74: Awaiting final administrative discharge approval

    let tempTakenToday = false;
    let todayTemperature = null;
    let todayTempTimestamp = null;
    let todayNurseName = null;
    let doctorVisitedToday = false;
    let doctorRecommendedDischarge = false;
    let feverFreeDays = 0;
    let isEmergency = false;
    let status = 'active'; // 'active' | 'ready_for_discharge' | 'discharged' | 'deceased'

    const history = [];

    if (room <= 12) {
      // 3 days no fever - Ready for doctor discharge recommendation or admin clearing
      feverFreeDays = 3;
      tempTakenToday = true;
      todayTemperature = +(98.0 + (room % 8) * 0.1).toFixed(1);
      todayTempTimestamp = '08:15 AM';
      todayNurseName = 'Nurse Anjali';
      
      if (room <= 6) {
        doctorVisitedToday = true;
        doctorRecommendedDischarge = true;
        status = 'ready_for_discharge';
      } else {
        doctorVisitedToday = false;
      }

      history.push(
        { day: -3, temp: 98.4, hasFever: false, date: '3 days ago' },
        { day: -2, temp: 98.1, hasFever: false, date: '2 days ago' },
        { day: -1, temp: 98.3, hasFever: false, date: 'Yesterday' }
      );
    } else if (room <= 35) {
      // Temperature taken today, awaiting doctor round
      feverFreeDays = room % 3;
      tempTakenToday = true;
      const isFever = room % 4 === 0;
      todayTemperature = isFever ? +(100.2 + (room % 15) * 0.1).toFixed(1) : +(98.2 + (room % 8) * 0.1).toFixed(1);
      todayTempTimestamp = `0${8 + (room % 3)}:${10 + (room % 45)} AM`;
      todayNurseName = room % 2 === 0 ? 'Nurse Anjali' : 'Nurse Rajesh';
      doctorVisitedToday = false;

      history.push(
        { day: -2, temp: +(99.8 - (room % 10) * 0.2).toFixed(1), hasFever: true, date: '2 days ago' },
        { day: -1, temp: +(98.8 + (room % 5) * 0.1).toFixed(1), hasFever: false, date: 'Yesterday' }
      );
    } else if (room <= 65) {
      // Temperature pending for today (Nurse queue priority)
      feverFreeDays = room % 2;
      tempTakenToday = false;
      doctorVisitedToday = false;

      history.push(
        { day: -2, temp: +(100.5 - (room % 8) * 0.2).toFixed(1), hasFever: true, date: '2 days ago' },
        { day: -1, temp: +(99.6 - (room % 5) * 0.1).toFixed(1), hasFever: true, date: 'Yesterday' }
      );
    } else if (room <= 70) {
      // High fever alert
      feverFreeDays = 0;
      tempTakenToday = true;
      todayTemperature = +(103.2 + (room % 6) * 0.2).toFixed(1);
      todayTempTimestamp = '07:45 AM';
      todayNurseName = 'Nurse Priya';
      doctorVisitedToday = false;
      isEmergency = true;

      history.push(
        { day: -2, temp: 102.8, hasFever: true, date: '2 days ago' },
        { day: -1, temp: 103.4, hasFever: true, date: 'Yesterday' }
      );
    } else {
      // Ready for discharge pending admin clearing
      feverFreeDays = 3;
      tempTakenToday = true;
      todayTemperature = 98.4;
      todayTempTimestamp = '08:30 AM';
      todayNurseName = 'Nurse Rajesh';
      doctorVisitedToday = true;
      doctorRecommendedDischarge = true;
      status = 'ready_for_discharge';

      history.push(
        { day: -3, temp: 98.3, hasFever: false, date: '3 days ago' },
        { day: -2, temp: 98.1, hasFever: false, date: '2 days ago' },
        { day: -1, temp: 98.2, hasFever: false, date: 'Yesterday' }
      );
    }

    patients.push({
      id: `P-${String(room).padStart(2, '0')}`,
      roomNumber: room,
      name: `${fn} ${ln}`,
      age,
      gender,
      admittedDaysAgo,
      status,
      tempTakenToday,
      todayTemperature,
      todayTempTimestamp,
      todayNurseName,
      doctorVisitedToday,
      todayDoctorNotes: doctorVisitedToday ? 'Patient responsive. Vitals checked, treatment continues.' : '',
      doctorRecommendedDischarge,
      feverFreeDays,
      temperatureHistory: history,
      isEmergency,
      medications: ['Antiviral Regimen B', 'Electrolyte Infusion', 'Paracetamol PRN']
    });
  }

  return patients;
}

// Initial closed cases for benchmark calculation
export const INITIAL_CLOSED_CASES = {
  dischargedCount: 51, // recovered patients
  deceasedCount: 9     // deceased patients
  // Mortality rate = 9 / (51 + 9) = 9/60 = 15.0% exactly matches benchmark!
};
