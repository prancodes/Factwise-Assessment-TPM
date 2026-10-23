# QuarantineCare — Virus Quarantine & Treatment Facility Portal
### Technical Product Manager Project
**Author:** Pranjal Singh (23-ITC27-27)  
**Target:** FactWise Technical Assessment  
**Live Platform:** Deployed on Vercel  

---

## 🏥 Project Overview

**QuarantineCare** is a clinical operations and workflow coordination platform built for a specialized virus quarantine and treatment centre operating at 100% capacity (**74 active rooms/beds**).

The virus has an expected **15% mortality rate** (target recovery rate: **85%**), and its primary clinical symptom is prolonged fever. A patient is considered cured solely when they achieve **3 full consecutive days without a fever** (< 99.5°F / 37.5°C).

### Operational Challenges Solved:
1. **Eliminating Paper Journal Blindness:** Centralizes temperature tracking into a single source of truth, removing paper journal desynchronization.
2. **Preventing Duplicate or Missed Temperature Checks:** Provides real-time daily queue tracking so every patient is measured exactly once per day with duplicate entry warnings.
3. **Sequential Workflow Enforcement:** Solves the doctor time-waste problem by ensuring doctors only conduct rounds on patients whose morning temperatures have already been taken by nurses.
4. **Zero-Latency Bed Turnover:** When a doctor authorizes discharge (based on 3 fever-free days), an instant notification is routed to administration to avoid patients staying an extra 1–2 days unnecessarily.
5. **Real-time Benchmark Monitoring:** Dynamically calculates closed-case mortality and recovery rates against the 15% mortality / 85% success benchmark.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 (Functional Components, Custom Hooks)
* **Build Tool & Bundler:** Vite 6 (Lightning-fast HMR and optimized production bundles)
* **Iconography:** Lucide React (Clinical and operational iconography)
* **Styling System:** Modern Vanilla CSS Design System (Custom Glassmorphism, Responsive CSS Grid, High-Contrast Accessible Palette)
* **State & Simulation:** Client-side reactive state engine with multi-day quarantine simulation

---

## ✨ Key Modules & Features

### 1. Executive Facility Dashboard
* **Bed Occupancy Dial:** Real-time visualization of bed capacity (X / 74 Beds).
* **Daily Compliance Gauges:** Real-time completion progress for Morning Nurse Checks and Doctor Rounds.
* **Treatment Quality Tracker:** Closed-case mortality rate vs the 15.0% facility benchmark and recovery rate vs 85.0% target.

### 2. 74-Bed Interactive Ward Matrix
* Interactive visual directory of all **74 rooms**.
* Real-time search by Room # or Patient Name.
* Clinical filter chips: *All Rooms*, *Awaiting Nurse*, *Ready for Doctor*, *3-Day Cured / Ready for Discharge*, and *High Fever Alert*.

### 3. Nurse Morning Triage Station
* Auto-populating queue of patients needing morning vitals.
* Single-click temperature presets (`98.4°F`, `98.6°F`, `99.8°F`, `101.5°F`) and custom temperature logger.
* Duplicate protection dialog and automatic fever classification ($\ge 99.5^\circ\text{F}$).

### 4. Doctor Clinical Rounds Station
* Enforces clinical sequencing: Displays patients whose morning temperature has been logged.
* Real-time **3-day fever-free streak tracker** ($0/3$, $1/3$, $2/3$, $3/3$).
* Locked discharge recommendation button: enabled strictly when 3-day no-fever criterion is satisfied.
* Clinical notes, prescriptions, and outcome logging.

### 5. Administration & Bed Turnover Desk
* Immediate queue of doctor-recommended discharges.
* One-click formal discharge: frees bed and marks it for sanitization.
* Patient intake desk: validates maximum 74-bed capacity guard.

### 6. Simulation Engine
* **"Simulate Next Day"** button: advances facility day by +1, archives yesterday's vitals, and tests multi-day fever-free streak progression.
* **"Reset Simulation"** button: restores default 74-bed scenario.

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18+ or v20+)
* npm (v9+)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/prancodes/Factwise-Assessment-TPM.git

# 2. Navigate to project root
cd Factwise-Assessment-TPM

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
```
Generates production-ready static assets in the `/dist` directory.

---

## 🌐 Deployment to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete FactWise TPM assessment app"
   git branch -M main
   git push -u origin main
   ```
2. Navigate to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select the `Factwise-Assessment-TPM` repository.
4. Vercel will automatically detect the **Vite** preset:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Click **Deploy**. Your app will be live with a global HTTPS URL!
