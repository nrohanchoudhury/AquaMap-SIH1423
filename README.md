# AquaMap - GIS Water Supply Network Mapping & Complaint Management (SIH 1423)

AquaMap is an interactive web-based GIS municipal water supply network mapping and complaint management prototype developed for Smart India Hackathon (SIH 1423). It provides real-time spatial positioning of water pipelines, overhead reservoirs, booster pump stations, rule-based AI issue classification, automated nearest pipeline segment detection, and field officer dispatch management.

![AquaMap GIS Dashboard](public/favicon.svg)

---

## 🌟 Key Features

1. **Interactive GIS Map Dashboard (`react-leaflet`):**
   - Renders OpenStreetMap base layer with custom SVG markers for water tanks & booster pumps.
   - Plots municipal water supply polylines with pipe specs (diameter, material, operating pressure).
   - Auto-highlights defective/affected pipeline segments in **pulsing glowing red** when an active complaint is selected.
   - Interactive pin-dropper mode for setting exact latitude/longitude coordinates on the map.

2. **Citizen Complaint Reporting & Real-Time AI Rule Engine:**
   - Citizen reporting form with issue types (Leakage, No Water, Low Pressure, Contaminated Water, Other).
   - GPS Browser Geolocation & Map Pin Selector integration.
   - **Rule-Based AI Classifier Engine (`aiClassifier.js`):** Instantly analyzes problem descriptions to predict urgency priority (`Critical`, `High`, `Medium`, `Normal`), category, confidence score, target SLA, and operational recommendations.
   - **Geospatial Point-to-Segment Algorithm (`geoUtils.js`):** Computes exact perpendicular distance to identify which pipeline polyline is affected by the complaint coordinates.

3. **Complaint List & Defect Hotspot Analyzer:**
   - Filterable complaint table with search by ID, type, pipeline, or keyword.
   - **Hotspot Detection Engine:** Automatically calculates and alerts municipal teams to pipeline segments with the highest complaint concentration.
   - Full status lifecycle management (`New` -> `Assigned` -> `In Progress` -> `Resolved`).

4. **Field Engineering Officer Dashboard:**
   - Engineer profile cards with assigned zones, contact details, active queue count, and completion rates.
   - Workload-balanced task assignment and status updates.

5. **Analytics & Network Insights:**
   - Real-time KPI summary cards (Total Pipeline Span, Active Unresolved Issues, Resolution Rate %, Average SLA Time).
   - Visual CSS SVG bar charts for issue categories and priority breakdowns.
   - Pipeline Defect Risk Vulnerability Index.

---

## 🚀 Tech Stack

- **Frontend Core:** React 18, Vite
- **GIS Mapping:** Leaflet, `react-leaflet`, OpenStreetMap tiles
- **Styling:** Custom Vanilla CSS Design System (Civic Dark Aqua Glassmorphism theme, CSS animations)
- **Icons & Delight:** `lucide-react`, `canvas-confetti`
- **State & Storage:** React Context (`AquaContext`), HTML5 LocalStorage persistence

---

## 🛠️ Setup & Local Running Instructions

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 2. Installation
Open a terminal in the project root directory and run:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment Instructions (Netlify & Vercel)

### Option A: Continuous Deployment via GitHub & Netlify (Recommended)
1. Initialize Git repository and commit all source files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AquaMap GIS Prototype (SIH 1423)"
   ```
2. Create a new GitHub repository (e.g., `aquamap-sih1423`) and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/aquamap-sih1423.git
   git branch -M main
   git push -u origin main
   ```
3. Connect repository to Netlify:
   - Log in to [Netlify Dashboard](https://app.netlify.com).
   - Click **"Add new site"** -> **"Import an existing project"** -> **GitHub**.
   - Select `aquamap-sih1423`.
   - Set Build command: `npm run build`
   - Set Publish directory: `dist`
   - Click **Deploy Site**. Every push to `main` will automatically trigger continuous deployment!

### Option B: Netlify CLI Deployment
Run Netlify CLI directly in your project folder:
```bash
npm install -g netlify-cli
netlify init
```
Follow the interactive prompt to link your GitHub repository for continuous delivery.

### Option C: Vercel Deployment
```bash
npx vercel
```
Vercel will auto-detect Vite + React settings and deploy to a live HTTPS URL.

---

## 📁 Project Directory Structure

```text
aquamap/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AquaContext.jsx         # Global state & LocalStorage engine
    ├── data/
    │   ├── pipelines.json          # GIS water network polylines
    │   ├── tanks.json              # Reservoirs & booster pump stations
    │   ├── officers.json           # Municipal field engineers
    │   └── complaints.json         # Initial complaint dataset
    ├── utils/
    │   ├── geoUtils.js             # Point-to-segment distance & hotspot analyzer
    │   └── aiClassifier.js         # Rule-based NLP classifier & SLA engine
    └── components/
        ├── Navbar.jsx              # Header & tab navigation
        ├── MapView.jsx             # React-Leaflet GIS map dashboard
        ├── ComplaintForm.jsx       # Citizen issue report form with live AI preview
        ├── ComplaintList.jsx       # Filterable table & hotspot banner
        ├── OfficerDashboard.jsx    # Engineer workload & task queue
        ├── Analytics.jsx           # Statistical metrics & charts
        └── Toast.jsx               # Floating toast alert manager
```
