/* ============================================
   CITY AI — Camera Details Screen
   Individual camera view with feed + stats
   ============================================ */

import { cameras, vehicles } from '../data/mock-data.js';
import { createCameraInfoGrid } from '../components/camera-card.js';
import { createDetectionItem, createConfidenceBar } from '../components/vehicle-card.js';
import { createMapComponent } from '../components/map.js';
import { getParams, navigate } from '../router.js';
import { selectCamera } from '../state.js';

let detailMap = null;

export function renderCameraDetails(container) {
  const params = getParams();
  const cameraId = params.cameraId || 'VSKP-C01';
  const camera = cameras.find(c => c.id === cameraId) || cameras[0];

  // Update global state
  selectCamera(camera.id);

  // Get detections from vehicle trajectories
  const allDetections = [];
  vehicles.forEach(v => {
    v.trajectory.forEach(t => {
      if (t.camera === camera.id) {
        allDetections.push({
          plate: v.plate,
          time: t.time,
          confidence: t.confidence,
          type: v.type,
          speed: t.speed,
          status: v.status,
        });
      }
    });
  });

  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Camera ${camera.id} — ${camera.name}</h1>
        <div class="screen-header__subtitle">
          <span class="status status--${camera.status}">
            <span class="status__dot"></span>
            ${camera.status.toUpperCase()}
          </span>
          <span style="margin: 0 8px;">•</span>
          <span>${camera.road} • ${camera.direction}</span>
        </div>
      </div>
      <div class="screen-header__actions">
        <select class="select-input" id="camera-selector">
          ${cameras.map(c => `
            <option value="${c.id}" ${c.id === camera.id ? 'selected' : ''}>${c.id} — ${c.name}</option>
          `).join('')}
        </select>
        <button class="btn btn--secondary btn--sm">
          <i data-lucide="settings-2"></i> Configure
        </button>
      </div>
    </div>

    <div class="content-grid content-grid--sidebar-right">
      <!-- Main Content -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Live Feed -->
        <div class="camera-detail-feed" style="position:relative;background:#05070A;">
          <div class="camera-detail-feed__overlay">
            <span class="pulse-dot pulse-dot--${camera.status === 'online' ? 'success' : 'critical'}" style="width:6px;height:6px;"></span>
            <span>${camera.status === 'online' ? 'LIVE STREAMING' : 'OFFLINE'}</span>
            <span style="color: var(--text-muted);">•</span>
            <span style="color: var(--primary);font-weight:700;">${camera.id}</span>
          </div>

          <!-- Real Playing CCTV Video -->
          <video 
            autoplay 
            loop 
            muted 
            playsinline 
            style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9; filter: contrast(1.1) brightness(0.95);"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          ></video>

          <div style="position:absolute;bottom:12px;left:14px;font-family:var(--font-mono);font-size:12px;color:#22C55E;background:rgba(11,15,20,0.8);padding:4px 10px;border-radius:4px;z-index:2;">
            HD 1080P • 30 FPS • ANPR ENGINE ACTIVE
          </div>

          ${camera.status === 'online' ? `
            <div class="detection-box" style="top:35%;left:38%;width:180px;height:120px;animation:pulse 2s infinite;">
              <div class="detection-box__label" style="display:flex;gap:4px;">
                <span>AI OBJECT SCAN</span>
                <span style="color:#22C55E;font-weight:700;">97%</span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Camera Info Grid (component) -->
        <div class="card">
          <div class="card__header"><div class="card__title">Camera Information</div></div>
          ${createCameraInfoGrid(camera)}
        </div>

        <!-- Mini Map -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="card__header" style="padding: 16px 20px; margin-bottom: 0;">
            <div class="card__title">Camera Location</div>
          </div>
          <div id="camera-detail-map" style="height: 250px;"></div>
        </div>
      </div>

      <!-- Right Panel -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Recent Detections -->
        <div class="card" style="flex: 1;">
          <div class="card__header">
            <div class="card__title">Recent Detections</div>
            <span class="text-caption text-secondary">${allDetections.length} detected</span>
          </div>
          <div class="detection-list" id="camera-detections">
            ${allDetections.length > 0
              ? allDetections.map(d => createDetectionItem(d)).join('')
              : `<div class="empty-state" style="padding:32px;">
                   <i data-lucide="scan" style="width:32px;height:32px;"></i>
                   <div class="text-sm text-secondary" style="margin-top:8px;">No recent detections</div>
                 </div>`
            }
          </div>
        </div>

        <!-- Performance (component) -->
        <div class="card">
          <div class="card__header"><div class="card__title">Performance</div></div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${createConfidenceBar(0.96, 'Detection Rate')}
            ${createConfidenceBar(0.92, 'OCR Accuracy')}
            ${createConfidenceBar(0.71, 'Avg Latency (142ms)')}
            ${createConfidenceBar(camera.status === 'online' ? 0.997 : 0, 'Uptime')}
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Camera selector
  container.querySelector('#camera-selector').addEventListener('change', (e) => {
    navigate('cameras', { cameraId: e.target.value });
  });

  // Detection click → vehicle search
  container.querySelectorAll('.detection-list__item').forEach(item => {
    item.addEventListener('click', () => {
      navigate('vehicles', { plate: item.dataset.plate });
    });
  });

  // Animate confidence bars
  setTimeout(() => {
    container.querySelectorAll('[data-width]').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.transition = 'width 1s ease';
        bar.style.width = bar.dataset.width + '%';
      }, i * 100);
    });
  }, 200);

  // Init mini map
  setTimeout(() => {
    if (detailMap) detailMap.remove();
    detailMap = createMapComponent('camera-detail-map', {
      center: [camera.lat, camera.lon],
      zoom: 15,
      zoomControl: false,
      showCameras: true,
      cameras: [camera],
    });
  }, 300);

  return () => {
    if (detailMap) { detailMap.remove(); detailMap = null; }
  };
}
