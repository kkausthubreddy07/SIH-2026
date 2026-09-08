/* ============================================
   CITY AI — Trajectory Screen
   Three-panel: vehicle info | map | timeline
   ============================================ */

import { vehicles, cameras } from '../data/mock-data.js';
import { createMapComponent } from '../components/map.js';
import { createCameraMarker, drawRoute, createVehicleMarker, animateMarker } from '../utils/map-utils.js';
import { createConfidenceBar } from '../components/vehicle-card.js';
import { formatConfidence } from '../utils/formatters.js';
import { getParams, navigate } from '../router.js';
import { selectVehicle, state } from '../state.js';

let trajectoryMap = null;

export function renderTrajectory(container) {
  const params = getParams();
  const plate = params.plate || state.selectedVehicle || 'AP31BK4821';
  const vehicle = vehicles.find(v => v.plate === plate) || vehicles[0];
  const traj = vehicle.trajectory;

  // Persist selected vehicle in state
  selectVehicle(vehicle.plate);

  const statusColors = { active: 'success', blacklisted: 'critical', suspicious: 'warning' };
  const avgConf = traj.reduce((s, t) => s + t.confidence, 0) / traj.length;

  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Vehicle Trajectory</h1>
        <div class="screen-header__subtitle">
          Tracking <span style="font-family: var(--font-mono); font-weight: 600; color: var(--primary);">${vehicle.plate}</span>
          across ${traj.length} camera checkpoints
        </div>
      </div>
      <div class="screen-header__actions">
        <button class="btn btn--secondary btn--sm" id="btn-back-search">
          <i data-lucide="arrow-left"></i> Back to Search
        </button>
        <button class="btn btn--primary" id="btn-play-trajectory">
          <i data-lucide="play"></i> Play Trajectory
        </button>
      </div>
    </div>

    <div class="content-grid content-grid--three-panel" style="height: calc(100vh - 180px);">
      <!-- Left: Vehicle Info -->
      <div class="trajectory-panel" style="overflow-y: auto;">
        <div class="trajectory-panel__section">
          <div class="text-label" style="margin-bottom: 12px;">Registration</div>
          <div style="font-family: var(--font-mono); font-size: 20px; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 6px;">${vehicle.plate}</div>
          <div class="text-caption text-secondary" style="margin-bottom: 12px;">${vehicle.stateName || 'Indian Registration'}</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span class="badge badge--${statusColors[vehicle.status] || 'primary'}">● ${vehicle.status === 'blacklisted' ? 'WATCHLIST' : vehicle.status.toUpperCase()}</span>
          </div>
          <div class="camera-info-grid" style="margin-top: 16px;">
            <div class="camera-info-item">
              <div class="camera-info-item__label">Category</div>
              <div class="camera-info-item__value">${vehicle.type}</div>
            </div>
            <div class="camera-info-item">
              <div class="camera-info-item__label">Color</div>
              <div class="camera-info-item__value">${vehicle.color}</div>
            </div>
            <div class="camera-info-item">
              <div class="camera-info-item__label">Distance</div>
              <div class="camera-info-item__value">${vehicle.distance} km</div>
            </div>
            <div class="camera-info-item">
              <div class="camera-info-item__label">Checkpoints</div>
              <div class="camera-info-item__value">${vehicle.camerasVisited} Nodes</div>
            </div>
          </div>
        </div>

        <div class="trajectory-panel__section">
          ${createConfidenceBar(avgConf, 'Avg Detection Confidence')}
        </div>

        <div class="trajectory-panel__section">
          <div class="text-label" style="margin-bottom: 8px;">First Seen</div>
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 600;">${traj[0].time}</div>
          <div class="text-caption text-muted" style="margin-top: 2px;">${cameras.find(c => c.id === traj[0].camera)?.name || ''}</div>
        </div>

        <div class="trajectory-panel__section">
          <div class="text-label" style="margin-bottom: 8px;">Last Seen</div>
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 600;">${traj[traj.length - 1].time}</div>
          <div class="text-caption text-muted" style="margin-top: 2px;">${cameras.find(c => c.id === traj[traj.length - 1].camera)?.name || ''}</div>
        </div>

        <div>
          <div class="text-label" style="margin-bottom: 8px;">Avg Speed</div>
          <div style="font-size: 18px; font-weight: 700;">
            ${(traj.reduce((s, t) => s + t.speed, 0) / traj.length).toFixed(1)} km/h
          </div>
        </div>
      </div>

      <!-- Center: GIS Map -->
      <div class="trajectory-map" id="trajectory-map"></div>

      <!-- Right: Timeline -->
      <div class="trajectory-panel" style="overflow-y: auto;">
        <div class="text-label" style="margin-bottom: 16px;">Trajectory Timeline</div>
        <div class="trajectory-timeline">
          ${traj.map((t, i) => {
            const cam = cameras.find(c => c.id === t.camera) || { name: 'Unknown', road: '' };
            const isLast = i === traj.length - 1;
            return `
              <div class="trajectory-timeline__item" id="timeline-item-${i}">
                <div class="trajectory-timeline__marker">
                  <div class="trajectory-timeline__dot${i === 0 ? ' trajectory-timeline__dot--active' : ''}"></div>
                  ${!isLast ? '<div class="trajectory-timeline__line"></div>' : ''}
                </div>
                <div class="trajectory-timeline__content">
                  <div class="trajectory-timeline__camera">${t.camera} — ${cam.name}</div>
                  <div class="trajectory-timeline__time">${t.time}</div>
                  <div class="trajectory-timeline__location">${cam.road}</div>
                  <div style="display: flex; gap: 12px; margin-top: 4px;">
                    <span class="text-caption text-muted">${t.speed} km/h</span>
                    <span class="badge badge--${t.confidence > 0.9 ? 'success' : 'warning'}" style="font-size: 10px;">${formatConfidence(t.confidence)}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Animate confidence bar
  setTimeout(() => {
    container.querySelectorAll('[data-width]').forEach(bar => {
      bar.style.transition = 'width 1s ease';
      bar.style.width = bar.dataset.width + '%';
    });
  }, 200);

  // Init map
  let vehicleMarker = null;
  let cancelAnimation = null;

  setTimeout(() => {
    if (trajectoryMap) trajectoryMap.remove();
    try {
      trajectoryMap = createMapComponent('trajectory-map', { zoom: 13, showCameras: false });

      if (trajectoryMap) {
        // Add camera markers
        traj.forEach(t => {
          const cam = cameras.find(c => c.id === t.camera);
          if (cam) createCameraMarker(cam).addTo(trajectoryMap);
        });

        // Draw route
        drawRoute(trajectoryMap, traj, { color: '#3B82F6', weight: 3 });

        // Add start/end badges
        const startIcon = L.divIcon({
          className: '',
          html: '<div style="background:#22C55E;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 0 10px rgba(34,197,94,0.5);">START</div>',
          iconSize: [40, 20],
          iconAnchor: [20, 30],
        });
        const endIcon = L.divIcon({
          className: '',
          html: '<div style="background:#EF4444;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;box-shadow:0 0 10px rgba(239,68,68,0.5);">END</div>',
          iconSize: [40, 20],
          iconAnchor: [20, 30],
        });
        L.marker([traj[0].lat, traj[0].lon], { icon: startIcon }).addTo(trajectoryMap);
        L.marker([traj[traj.length - 1].lat, traj[traj.length - 1].lon], { icon: endIcon }).addTo(trajectoryMap);
      }
    } catch (e) {
      console.warn('Map init error:', e);
    }
  }, 300);

  // Play trajectory
  const playBtn = container.querySelector('#btn-play-trajectory');
  playBtn.addEventListener('click', () => {
    if (!trajectoryMap) return;

    if (cancelAnimation) cancelAnimation();
    if (vehicleMarker) trajectoryMap.removeLayer(vehicleMarker);

    // Reset timeline highlights
    traj.forEach((_, i) => {
      const dot = container.querySelector(`#timeline-item-${i} .trajectory-timeline__dot`);
      if (dot) {
        dot.classList.remove('trajectory-timeline__dot--active');
      }
    });

    const path = traj.map(t => [t.lat, t.lon]);
    vehicleMarker = createVehicleMarker(path[0]);
    vehicleMarker.addTo(trajectoryMap);

    playBtn.innerHTML = '<i data-lucide="loader"></i> Playing...';
    playBtn.disabled = true;
    if (window.lucide) window.lucide.createIcons();

    cancelAnimation = animateMarker(vehicleMarker, path, {
      duration: 5000,
      onStep: (segIndex) => {
        for (let i = 0; i <= segIndex; i++) {
          const dot = container.querySelector(`#timeline-item-${i} .trajectory-timeline__dot`);
          if (dot) dot.classList.add('trajectory-timeline__dot--active');
        }
      },
      onComplete: () => {
        traj.forEach((_, i) => {
          const dot = container.querySelector(`#timeline-item-${i} .trajectory-timeline__dot`);
          if (dot) dot.classList.add('trajectory-timeline__dot--active');
        });
        playBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Replay';
        playBtn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  // Back to search
  container.querySelector('#btn-back-search').addEventListener('click', () => {
    navigate('vehicles', { plate: vehicle.plate });
  });

  return () => {
    if (cancelAnimation) cancelAnimation();
    if (trajectoryMap) {
      trajectoryMap.remove();
      trajectoryMap = null;
    }
  };
}
