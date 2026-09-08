/* ============================================
   CITY AI — Dashboard Screen
   Main command center overview
   ============================================ */

import { cameras, kpiData, alerts } from '../data/mock-data.js';
import { createMapComponent, switchMapLayer, focusCorridor, createMapLegend, TRAFFIC_LEGEND } from '../components/map.js';
import { createKpiCard, animateKpi } from '../components/kpi-card.js';
import { createCompactAlertCard } from '../components/alert-card.js';
import { formatDate } from '../utils/formatters.js';
import { navigate } from '../router.js';
import { showAlertToast } from '../utils/notifications.js';

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Visakhapatnam City Overview</h1>
        <div class="screen-header__subtitle">
          <span>${formatDate()} • IST</span>
          <span style="margin: 0 8px;">•</span>
          <span class="pulse-dot pulse-dot--success"></span>
          <span style="margin-left: 4px;">Live AI traffic monitoring active</span>
          <span class="badge badge--success" style="margin-left: 8px; font-size: 10px;">SIMULATION</span>
        </div>
      </div>
      <div class="screen-header__actions">
        <button class="btn btn--secondary btn--sm" id="btn-export-telemetry">
          <i data-lucide="download"></i> Export Telemetry
        </button>
        <button class="btn btn--primary btn--sm" id="btn-refresh-dashboard">
          <i data-lucide="refresh-cw"></i> Refresh Data
        </button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid stagger-children">
      ${createKpiCard({ id: 'kpi-cameras', label: 'Monitored Camera Nodes', value: kpiData.totalCameras, icon: 'cctv', color: 'blue', change: `+${kpiData.camerasNew} nodes online today`, changeDir: 'up' })}
      ${createKpiCard({ id: 'kpi-vehicles', label: 'Vehicles Detected (Today)', value: kpiData.totalDetections, icon: 'car', color: 'green', change: `+${kpiData.vehiclesChange}% vs yesterday`, changeDir: 'up' })}
      ${createKpiCard({ id: 'kpi-alerts', label: 'Active Alerts', value: kpiData.activeAlerts, icon: 'shield-alert', color: 'red', change: `${kpiData.criticalAlerts} critical watchlist/anomalies`, changeDir: 'down' })}
      ${createKpiCard({ id: 'kpi-congestion', label: 'City Congestion Level', value: kpiData.congestionLevel, suffix: '%', icon: 'gauge', color: 'yellow', change: `↑ ${kpiData.congestionChange}% above baseline`, changeDir: 'down' })}
    </div>

    <!-- Map + Activity Feed -->
    <div class="content-grid content-grid--sidebar-right">
      <!-- Map -->
      <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div class="card__header" style="padding: 14px 20px; margin-bottom: 0; background: #0F151D; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <div class="card__title" style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="map-pin" style="color: var(--primary); width: 18px; height: 18px;"></i>
              Visakhapatnam City Traffic Map & Corridors
            </div>
            <div class="text-caption text-secondary" style="margin-top: 2px;">
              Andhra Pradesh • 12 CCTV Nodes • Real-Time Spatial GIS Flow
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <!-- Corridor Focus Selector -->
            <select class="select-input" id="map-corridor-jump" style="padding: 4px 8px; font-size: 11px; background: #111820; border: 1px solid #25303A; color: #F1F5F9; font-weight: 600; cursor: pointer;">
              <option value="all">📍 All Visakhapatnam</option>
              <option value="central">🏛️ Central (Jagadamba / RTC)</option>
              <option value="nh16">✈️ NH-16 (Airport / NAD Jn)</option>
              <option value="beach">🏖️ Beach Road (Rushikonda)</option>
              <option value="industrial">🏭 Industrial (Gajuwaka / Steel)</option>
              <option value="north">🌲 North Bypass (Pendurthi)</option>
            </select>

            <!-- Layer Mode Switcher -->
            <div class="map-controls" style="position: static; margin: 0;">
              <button class="map-controls__btn active" data-layer="traffic">Traffic Flow</button>
              <button class="map-controls__btn" data-layer="cameras">Camera Nodes</button>
              <button class="map-controls__btn" data-layer="heatmap">Density Heatmap</button>
              <button class="map-controls__btn" data-layer="satellite">🛰️ Satellite</button>
            </div>
          </div>
        </div>

        <div id="dashboard-map" class="dashboard-map" style="position: relative;">
          ${createMapLegend(TRAFFIC_LEGEND)}
        </div>

        <!-- Telemetry HUD Bar underneath map -->
        <div class="map-telemetry-hud" style="background: #0B0F14; border-top: 1px solid #25303A; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #94A3B8; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="pulse-dot pulse-dot--success" style="width: 7px; height: 7px;"></span>
              <span style="color: #F1F5F9; font-weight: 600;">11/12 Nodes Online</span>
            </div>
            <div style="color: #64748B;">|</div>
            <div id="map-coordinates-hud" style="font-family: var(--font-mono); color: #3B82F6;">Lat: 17.7285° N, Lon: 83.2850° E</div>
            <div style="color: #64748B;">|</div>
            <div>🌊 <span style="color: #CBD5E1;">Vizag Coast: 29°C • Clear • Wind 14 km/h (Bay of Bengal)</span></div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge badge--critical" style="font-size: 10px;">PEAK: Jagadamba Jn (92%)</span>
            <span class="badge badge--success" style="font-size: 10px;">CLEAR: Rushikonda (48 km/h)</span>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="card" style="max-height: 490px; display: flex; flex-direction: column;">
        <div class="card__header">
          <div class="card__title">Live Activity</div>
          <span class="badge badge--primary">LIVE</span>
        </div>
        <div class="activity-feed overflow-auto" id="activity-feed" style="flex: 1;">
          ${renderActivityFeed()}
        </div>
      </div>
    </div>

    <!-- Recent Critical Alerts -->
    <div style="margin-top: 16px;">
      <div class="card">
        <div class="card__header">
          <div class="card__title">Recent Critical Alerts</div>
          <button class="btn btn--ghost btn--sm" id="btn-view-all-alerts">
            View All <i data-lucide="arrow-right" style="width:14px;height:14px;"></i>
          </button>
        </div>
        <div class="content-grid content-grid--3">
          ${alerts.filter(a => a.severity === 'critical').map(a => createCompactAlertCard(a)).join('')}
        </div>
      </div>
    </div>
  `;

  // Initialize Lucide
  if (window.lucide) window.lucide.createIcons();

  // Animate KPI counters
  setTimeout(() => {
    animateKpi('kpi-cameras', kpiData.totalCameras);
    animateKpi('kpi-vehicles', kpiData.totalDetections);
    animateKpi('kpi-alerts', kpiData.activeAlerts);
    animateKpi('kpi-congestion', kpiData.congestionLevel, { suffix: '%' });
  }, 200);

  // View all alerts button
  const alertsBtn = container.querySelector('#btn-view-all-alerts');
  if (alertsBtn) alertsBtn.addEventListener('click', () => navigate('alerts'));

  // Export telemetry button
  const exportBtn = container.querySelector('#btn-export-telemetry');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cameras, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `vskp_telemetry_${Date.now()}.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    });
  }

  // Refresh data button
  const refreshBtn = container.querySelector('#btn-refresh-dashboard');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      animateKpi('kpi-cameras', kpiData.totalCameras);
      animateKpi('kpi-vehicles', kpiData.totalDetections);
      animateKpi('kpi-alerts', kpiData.activeAlerts);
      animateKpi('kpi-congestion', kpiData.congestionLevel, { suffix: '%' });
      showAlertToast({
        title: 'Telemetry Stream Synced',
        plate: null,
        camera: 'Command Central',
        message: 'All 12 camera edge nodes refreshed. System telemetry latency 14ms.',
        severity: 'info',
      });
    });
  }

  // Initialize map
  let map;
  setTimeout(() => {
    map = createMapComponent('dashboard-map', {
      showCameras: true,
      showTraffic: true,
      clickableMarkers: true,
    });

    if (map) {
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 400);
      setTimeout(() => map.invalidateSize(), 900);
    }
  }, 100);

  // Corridor Jump Dropdown
  const corridorJump = container.querySelector('#map-corridor-jump');
  if (corridorJump) {
    corridorJump.addEventListener('change', (e) => {
      if (map) {
        focusCorridor(map, e.target.value);
      }
    });
  }

  // Map layer toggle controls (Traffic Flow / Camera Nodes / Density Heatmap / Satellite)
  container.querySelectorAll('.map-controls__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.map-controls__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layer = btn.dataset.layer;
      if (map) {
        switchMapLayer(map, layer);
      }
    });
  });

  // Cleanup
  return () => {
    if (map) map.remove();
  };
}

function renderActivityFeed() {
  const activities = [
    { type: 'detection', icon: 'scan', title: 'AP31BK4821 detected at VSKP-C01 (NAD Jn)', time: '2 min ago' },
    { type: 'alert', icon: 'shield-alert', title: 'Watchlist vehicle AP31AB1234 at VSKP-C07', time: '5 min ago' },
    { type: 'detection', icon: 'scan', title: 'TS08JK1234 detected at VSKP-C08 (BRTS)', time: '6 min ago' },
    { type: 'camera', icon: 'cctv', title: 'Node VSKP-C12 (Pendurthi) telemetry offline', time: '12 min ago' },
    { type: 'detection', icon: 'scan', title: 'MH12XY9876 detected at VSKP-C04 (Gajuwaka)', time: '15 min ago' },
    { type: 'alert', icon: 'shield-alert', title: 'Speed limit violation: MH12XY9876 on Airport Rd', time: '18 min ago' },
    { type: 'detection', icon: 'scan', title: 'KA03MN5678 detected at VSKP-C10 (Rushikonda)', time: '22 min ago' },
    { type: 'camera', icon: 'cctv', title: 'Node VSKP-C09 (Steel Plant Rd) low latency notice', time: '25 min ago' },
    { type: 'detection', icon: 'scan', title: 'AP39CD5678 detected at VSKP-C05 (Siripuram)', time: '28 min ago' },
    { type: 'alert', icon: 'shield-alert', title: 'Route anomaly detected: Kurmannapalem detour', time: '30 min ago' },
    { type: 'detection', icon: 'scan', title: 'OD02PQ9012 (Bus) detected at VSKP-C06', time: '33 min ago' },
    { type: 'detection', icon: 'scan', title: 'AP16EF9012 detected at VSKP-C11 (Jagadamba)', time: '35 min ago' },
  ];

  return activities.map(a => `
    <div class="activity-feed__item">
      <div class="activity-feed__icon activity-feed__icon--${a.type}">
        <i data-lucide="${a.icon}"></i>
      </div>
      <div class="activity-feed__content">
        <div class="activity-feed__title">${a.title}</div>
        <div class="activity-feed__time">${a.time}</div>
      </div>
    </div>
  `).join('');
}
