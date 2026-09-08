/* ============================================
   CITY AI — Main Entry Point
   App initialization, routing, global state & Scenario engine
   ============================================ */

import { registerRoute, initRouter, navigate } from './router.js';
import { renderAuth } from './screens/auth.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderMonitoring } from './screens/live-monitoring.js';
import { renderVehicleSearch } from './screens/vehicle-search.js';
import { renderTrajectory } from './screens/trajectory.js';
import { renderAnalytics } from './screens/analytics.js';
import { renderAlerts } from './screens/alerts.js';
import { renderCameraDetails } from './screens/camera-details.js';
import { showAlertToast } from './utils/notifications.js';
import { showEChallanModal } from './components/echallan-modal.js';
import { CARTO_LIGHT_TILES, CARTO_DARK_TILES } from './utils/map-utils.js';

// ---- Theme Manager ----
export function applyTheme(theme) {
  const targetTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', targetTheme);
  try {
    localStorage.setItem('cityai-theme', targetTheme);
  } catch (_) {}

  // Update theme toggle icon
  const icon = document.getElementById('theme-toggle-icon');
  if (icon) {
    icon.setAttribute('data-lucide', targetTheme === 'light' ? 'moon' : 'sun');
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Update active Leaflet base map layer if present and not in satellite mode
  if (window._cityaiActiveMap && window._cityaiActiveMap._cityaiBaseLayer) {
    const map = window._cityaiActiveMap;
    const isSatellite = map._cityaiLayers && map._cityaiLayers.satelliteLayer && map.hasLayer(map._cityaiLayers.satelliteLayer);
    if (!isSatellite) {
      const nextTiles = targetTheme === 'light' ? CARTO_LIGHT_TILES : CARTO_DARK_TILES;
      map._cityaiBaseLayer.setUrl(nextTiles);
    }
  }
}

// ---- App Init ----
function initApp() {
  // Apply saved theme immediately on init
  const savedTheme = localStorage.getItem('cityai-theme') || 'dark';
  applyTheme(savedTheme);

  const authScreen = document.getElementById('auth-screen');
  const app = document.getElementById('app');

  // Check if already logged in (session storage)
  const isLoggedIn = sessionStorage.getItem('cityai-auth');

  if (isLoggedIn) {
    showMainApp();
  } else {
    showAuth();
  }

  function showAuth() {
    authScreen.style.display = 'flex';
    app.style.display = 'none';
    renderAuth(authScreen, () => {
      sessionStorage.setItem('cityai-auth', 'true');
      showMainApp();
    });
  }

  function showMainApp() {
    authScreen.style.display = 'none';
    app.style.display = 'grid';

    // Register routes
    registerRoute('dashboard', renderDashboard);
    registerRoute('monitoring', renderMonitoring);
    registerRoute('vehicles', renderVehicleSearch);
    registerRoute('trajectory', renderTrajectory);
    registerRoute('analytics', renderAnalytics);
    registerRoute('alerts', renderAlerts);
    registerRoute('cameras', renderCameraDetails);
    registerRoute('settings', renderSettings);

    // Init sidebar navigation
    initSidebar();

    // Init topbar & demo scenarios
    initTopbar();
    applyTheme(localStorage.getItem('cityai-theme') || 'dark');

    // Start router
    initRouter();

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Schedule initial welcome threat scan toast after 3s
    setTimeout(() => {
      showAlertToast({
        title: 'Demo Watchlist Match Detected',
        plate: 'AP31AB1234',
        camera: 'VSKP-C07 (Airport Road)',
        message: 'Reported Stolen Goods Carrier identified via high-confidence ANPR scan.',
        severity: 'critical',
      });
    }, 3500);
  }
}

// ---- Sidebar ----
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const mobileMenuBtn = document.getElementById('btn-mobile-menu');

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
  };

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-open');
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  if (!sidebar) return;

  sidebar.querySelectorAll('.sidebar__item[data-route]').forEach(item => {
    item.addEventListener('click', () => {
      const route = item.dataset.route;
      navigate(route);
      closeSidebar();
    });
  });
}

// ---- Topbar & Scenario Engine ----
function initTopbar() {
  // Theme Toggle Handler
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  const notifBtn = document.getElementById('btn-notifications');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      navigate('alerts');
    });
  }

  const scenarioSelector = document.getElementById('scenario-selector');
  if (scenarioSelector) {
    scenarioSelector.addEventListener('change', (e) => {
      const val = e.target.value;
      if (!val) return;

      if (val === 'scenario-stolen') {
        showAlertToast({
          title: 'HOT PURSUIT: Watchlist Target Active',
          plate: 'AP31AB1234',
          camera: 'VSKP-C01 (NAD Junction)',
          message: 'Target vehicle passed Airport Road → NAD Junction. Intercept recommended.',
          severity: 'critical',
        });
        navigate('trajectory', { plate: 'AP31AB1234' });
      } else if (val === 'scenario-heat') {
        navigate('dashboard');
        setTimeout(() => {
          const heatBtn = document.querySelector('.map-controls__btn[data-layer="heatmap"]');
          if (heatBtn) heatBtn.click();
          showAlertToast({
            title: 'Corridor Traffic Surge',
            plate: null,
            camera: 'Beach Road & Jagadamba',
            message: 'Density gradient elevated to 92% volume on central commercial corridors.',
            severity: 'warning',
          });
        }, 300);
      } else if (val === 'scenario-deviation') {
        showAlertToast({
          title: 'ROUTE ANOMALY: Unauthorized Corridor Deviation',
          plate: 'MH12XY9876',
          camera: 'VSKP-C09 (Steel Plant Rd)',
          message: 'Vehicle deviated from registered NH-16 transit into industrial sector.',
          severity: 'warning',
        });
        navigate('trajectory', { plate: 'MH12XY9876' });
      } else if (val === 'scenario-echallan') {
        showEChallanModal({
          plate: 'MH12XY9876',
          violation: 'Over-speeding (52 km/h in 40 km/h Airport Corridor)',
          camera: 'VSKP-C07 (Airport Road Flyover)',
          speed: '52.4 km/h',
          limit: '40.0 km/h',
          fine: 1500,
        });
      }

      // Reset selector
      e.target.value = '';
    });
  }
}

// ---- Settings Screen ----
function renderSettings(container) {
  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">System Configuration & Telemetry</h1>
        <div class="screen-header__subtitle">Visakhapatnam Command & Control Center • Simulation Environment</div>
      </div>
    </div>

    <div class="content-grid content-grid--2">
      <div class="card">
        <div class="card__header">
          <div class="card__title">Deployment Metadata</div>
        </div>
        <div class="camera-info-grid">
          <div class="camera-info-item">
            <div class="camera-info-item__label">Location</div>
            <div class="camera-info-item__value">Visakhapatnam, AP</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">System Edition</div>
            <div class="camera-info-item__value">CITY AI • BEL Edition</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Environment</div>
            <div class="camera-info-item__value text-success">Simulation Mode Active</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Timezone</div>
            <div class="camera-info-item__value">IST (UTC +5:30)</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <div class="card__title">AI Architecture & Target Stack</div>
        </div>
        <div class="camera-info-grid">
          <div class="camera-info-item">
            <div class="camera-info-item__label">Vehicle Detection</div>
            <div class="camera-info-item__value">YOLOv8 Multi-Class</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">ANPR Plate Detection</div>
            <div class="camera-info-item__value">YOLOv8 LP (Indian Plates)</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">OCR Engine</div>
            <div class="camera-info-item__value">PaddleOCR / EasyOCR</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Spatial Backend</div>
            <div class="camera-info-item__value">PostgreSQL 16 + PostGIS</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <div class="card__title">Demo Watchlist Management</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div class="detection-list__item">
            <div>
              <div class="detection-list__plate" style="color: var(--critical);">AP31AB1234</div>
              <div class="text-caption text-muted">Stolen Goods Carrier • Visakhapatnam</div>
            </div>
            <span class="badge badge--critical">REPORTED STOLEN</span>
          </div>
          <div class="detection-list__item">
            <div>
              <div class="detection-list__plate" style="color: var(--warning);">TS09XY5678</div>
              <div class="text-caption text-muted">Toll Evasion • Telangana Transit</div>
            </div>
            <span class="badge badge--warning">WATCHLIST</span>
          </div>
          <div class="detection-list__item">
            <div>
              <div class="detection-list__plate" style="color: var(--critical);">MH14ZZ9999</div>
              <div class="text-caption text-muted">Vehicle Involved in Incident • Maharashtra</div>
            </div>
            <span class="badge badge--critical">CRITICAL ALERT</span>
          </div>
        </div>
        <button class="btn btn--secondary btn--sm" id="btn-add-watchlist" style="margin-top: 16px; width: 100%; justify-content: center;">
          <i data-lucide="plus"></i> Add Registration to Demo Watchlist
        </button>
      </div>

      <div class="card">
        <div class="card__header">
          <div class="card__title">Operator Session</div>
        </div>
        <div class="camera-info-grid">
          <div class="camera-info-item">
            <div class="camera-info-item__label">Operator</div>
            <div class="camera-info-item__value">Control Admin (VSKP)</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Authorization</div>
            <div class="camera-info-item__value">Level 3 Command</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Telemetry Sync</div>
            <div class="camera-info-item__value text-success">Synchronized</div>
          </div>
          <div class="camera-info-item">
            <div class="camera-info-item__label">Session Time</div>
            <div class="camera-info-item__value">${new Date().toLocaleTimeString()} IST</div>
          </div>
        </div>
        <button class="btn btn--danger btn--sm" style="margin-top: 16px; width: 100%; justify-content: center;" id="btn-logout">
          <i data-lucide="log-out"></i> Logout Command Center
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Add Watchlist
  const addWatchlistBtn = container.querySelector('#btn-add-watchlist');
  if (addWatchlistBtn) {
    addWatchlistBtn.addEventListener('click', () => {
      const plate = prompt('Enter Vehicle Registration for Watchlist (e.g. AP31XX9999):');
      if (plate && plate.trim()) {
        const clean = plate.trim().toUpperCase();
        showAlertToast({
          title: 'Watchlist Target Enrolled',
          plate: clean,
          camera: 'Command Central',
          message: `Vehicle registration ${clean} has been actively enrolled into the AI Watchlist.`,
          severity: 'warning',
        });
      }
    });
  }

  // Logout
  const logoutBtn = container.querySelector('#btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('cityai-auth');
      location.reload();
    });
  }
}

// ---- Initialize on DOM ready ----
document.addEventListener('DOMContentLoaded', initApp);
