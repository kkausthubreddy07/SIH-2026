# 🏙️ CITY AI — Visakhapatnam Traffic Intelligence Command Center

> **Smart India Hackathon (SIH)** Prototype — AI-Powered City-Wide ANPR, Trajectory Reconstruction & Real-Time Traffic Intelligence Platform.

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4.0-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Status](https://img.shields.io/badge/Status-Operational-brightgreen?style=for-the-badge)](#)

---

## 📌 Problem Statement

Traditional urban surveillance systems rely on fragmented CCTV feeds and manual review. Traffic police and city authorities encounter serious bottlenecks:
1. **Isolated Camera Feeds**: Standard ANPR setups log vehicle detections at single points without connecting cross-city movements.
2. **Slow Trajectory Reconstruction**: Reconstructing a wanted or stolen vehicle's route during an investigation requires hours of manual cross-referencing across separate junction servers.
3. **Delayed Violation & Hotlist Response**: Red-light jumping, overspeeding, and stolen vehicle hits often go unnoticed until hours after the event, allowing suspects to exit city limits.
4. **Lack of Correlated Density Analytics**: Traffic management centers lack unified real-time spatial heatmaps correlating corridor speeds with congestion choke points.

---

## 💡 Solution Overview

**CITY AI** is a unified traffic intelligence command center tailored for **Visakhapatnam (Andhra Pradesh)**. It simulates and visualizes edge AI cameras deployed across key corridors (NH-16, NAD Junction, Siripuram, Jagadamba, MVP Colony, Rushikonda Beach Road, etc.) to deliver real-time automated detection, vehicle tracking, anomaly detection, and law enforcement workflows.

---

## 🌟 Key Features

| Module | Description |
|---|---|
| 📊 **Command Dashboard** | Real-time KPIs (Active Cameras, Total Vehicles, Speed Averages, Hotlist Alerts), interactive Leaflet GIS map, and live ANPR ticker. |
| 📹 **Live Camera Monitoring** | Multi-junction CCTV grid simulation with real-time bounding boxes, plate extraction, confidence metrics, and speed tags. |
| 🚗 **Vehicle Registry & Search** | Query database by Plate Number, State (AP, TS, MH, DL, etc.), Vehicle Category, or Hotlist/Blacklist status. |
| 🗺️ **Spatio-Temporal Trajectory** | Stitches timestamped detections across multiple cameras into an animated, chronological path across the city. |
| 🚨 **Alerts & Incident Management**| Priority alerts for stolen vehicles, overspeeding, and route deviations with 1-click interceptor dispatch. |
| 🚔 **Instant E-Challan Generation** | Generates digital violation citations with captured photographic proof, location coordinates, and fine amounts. |
| 📈 **Traffic Density & Heatmaps** | Leaflet.heat density maps and hourly traffic volume charts via Chart.js. |
| ⚡ **Interactive Demo Scenarios** | 4 pre-built presentation scenarios for judges (Stolen Vehicle Pursuit, Rush Heatmap, Route Deviation, Instant E-Challan). |

---

## 🔬 Novelty & Technical Differentiators

- **Multi-Camera Trajectory Stitching**: Automatically reconstructs full vehicle paths across time and space rather than recording isolated plate hits.
- **Behavioral & Route Anomaly Detection**: Detects abnormal route deviations and out-of-corridor travel patterns in commercial/restricted vehicles.
- **Zero-Latency Hotlist Alerting**: Instant notification engine flagging high-risk vehicles the millisecond they cross any monitored node.
- **Integrated GIS-Centric Evidence Pipeline**: Every violation links directly to GIS coordinates, camera timestamp, and automatic citation dispatch.

---

## 📂 Project Structure

```
SIH/
├── camera-config.json       # Camera nodes GIS & metadata config (Visakhapatnam)
├── index.html               # Main application entry point & layout shell
├── package.json             # NPM dependencies and scripts
├── vite.config.js           # Vite development server configuration
├── .gitignore               # Git ignored directories and build artifacts
├── README.md                # Project documentation
└── src/
    ├── main.js              # Application bootstrapper and scenario coordinator
    ├── router.js            # Hash-based SPA client-side router
    ├── state.js             # Global reactive state management
    ├── components/          # Reusable UI & Map components
    │   ├── alert-card.js    # Incident alert card
    │   ├── camera-card.js   # Camera feed stream card
    │   ├── echallan-modal.js# E-Challan generation & print modal
    │   ├── kpi-card.js      # Executive metric KPI widgets
    │   ├── map.js           # Leaflet GIS map wrapper & heatmap layer
    │   └── vehicle-card.js  # Vehicle details & profile card
    ├── data/
    │   └── mock-data.js     # City corridors, camera nodes & vehicle synthetic dataset
    ├── screens/             # Application screen views
    │   ├── alerts.js        # Incident & violation alerts center
    │   ├── analytics.js     # Traffic volume & speed analytics screen
    │   ├── auth.js          # Command center authentication screen
    │   ├── camera-details.js# Individual camera feed deep-dive
    │   ├── dashboard.js     # Executive overview & city map screen
    │   ├── live-monitoring.js# Multi-feed camera surveillance grid
    │   ├── trajectory.js    # Spatio-temporal route reconstruction screen
    │   └── vehicle-search.js# Vehicle registry & plate lookup screen
    ├── styles/              # Design system & modular CSS
    │   ├── components.css   # Component-level styles
    │   ├── design-system.css# Color tokens, typography, glassmorphism utilities
    │   ├── layout.css       # Sidebar, topbar, grid layouts
    │   └── screens.css      # Screen-specific styles
    └── utils/               # Helper utilities
        ├── animations.js    # Canvas and UI micro-animations
        ├── formatters.js    # Date, time, currency and plate formatters
        ├── map-utils.js     # Leaflet helpers, markers, polylines & popups
        ├── notifications.js # Toast notifications system
        └── validators.js    # Plate regex & input validators
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- `npm` (bundled with Node.js)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kkausthubreddy07/SIH-2026.git
   cd SIH-2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser at `http://localhost:3000/`

---

## ⚡ Demo Scenarios for Presentations

Use the **Scenario Selector** dropdown in the top navigation bar to trigger live simulations:
1. **🚨 Stolen Vehicle Hot Pursuit (`AP31AB1234`)**: Automatically highlights blacklisted vehicle detection, focuses camera node on map, and triggers pursuit workflow.
2. **🔥 Peak Rush Density Heatmap**: Activates real-time congestion heatmap layer showing high-volume hotspots (Jagadamba Jn, RTC Complex).
3. **⚠️ Route Deviation Anomaly (`MH12XY9876`)**: Triggers an alert when a vehicle deviates from its expected transit corridor.
4. **🚔 Instant E-Challan Generation**: Opens pre-populated digital citation modal ready for dispatch.

---

## 👥 Contributors & Acknowledgements

Developed for **Smart India Hackathon (SIH)**. Built with high-performance Vanilla JavaScript, Leaflet GIS, and Vite.
