/* ============================================
   CITY AI — Live Monitoring Screen
   ANPR camera feeds with real playing video & Webcam integration
   ============================================ */

import { cameras, recentDetections } from '../data/mock-data.js';
import { createCameraCard } from '../components/camera-card.js';
import { createDetectionRow } from '../components/vehicle-card.js';
import { randomPlate, randomTime, createLiveSimulator } from '../utils/animations.js';
import { navigate } from '../router.js';

let activeWebcamStream = null;

export function renderMonitoring(container) {
  const onlineCameras = cameras.filter(c => c.status === 'online');

  // Pre-paired detections for the visible camera nodes in Visakhapatnam
  const detections = [
    { plate: 'AP31BK4821', confidence: 96, time: '10:42:31 IST' },
    { plate: 'TS08JK1234', confidence: 92, time: '10:41:18 IST' },
    { plate: 'AP39CD5678', confidence: 94, time: '10:40:55 IST' },
    { plate: 'KA03MN5678', confidence: 93, time: '10:39:22 IST' },
  ];

  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Live Monitoring — Visakhapatnam</h1>
        <div class="screen-header__subtitle">
          <span class="pulse-dot pulse-dot--success"></span>
          <span>${onlineCameras.length} camera nodes streaming live</span>
          <span style="margin: 0 8px;">•</span>
          <span>Real-time ANPR & OCR processing</span>
          <span class="badge badge--success" style="margin-left: 8px; font-size: 10px;">SIMULATION</span>
        </div>
      </div>
      <div class="screen-header__actions" style="display:flex;gap:10px;">
        <button class="btn btn--secondary btn--sm" id="btn-toggle-webcam">
          <i data-lucide="camera"></i> Connect Local Webcam
        </button>
        <span class="badge badge--success">● LIVE STREAMS ACTIVE</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <select class="select-input" id="camera-filter">
        <option value="all">All Camera Nodes (${cameras.length})</option>
        ${cameras.map(c => `<option value="${c.id}">${c.id} — ${c.name} (${c.road})</option>`).join('')}
      </select>
      <select class="select-input" id="traffic-filter">
        <option value="all">All Traffic Levels</option>
        <option value="critical">Critical Congestion</option>
        <option value="high">High Density</option>
        <option value="moderate">Moderate Flow</option>
        <option value="low">Clear Corridor</option>
      </select>
      <div class="search-input" style="flex: 1; max-width: 320px;">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search landmark / node (e.g. NAD)..." id="camera-search" />
      </div>
    </div>

    <!-- Camera Grid with Real Video Feeds -->
    <div class="camera-grid" id="camera-grid">
      ${onlineCameras.slice(0, 4).map((cam, i) => createCameraCard(cam, detections[i])).join('')}
    </div>

    <!-- Detection Ticker -->
    <div class="card" style="margin-top: 16px;">
      <div class="card__header">
        <div class="card__title">
          <i data-lucide="scan" style="width:16px;height:16px;display:inline;vertical-align:middle;margin-right:8px;"></i>
          Recent ANPR Detections (Live Stream Log)
        </div>
        <span class="text-caption text-secondary" id="detection-count">${recentDetections.length} recorded events</span>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border);">
              ${['Registration Number', 'Camera Node', 'Timestamp (IST)', 'OCR Confidence', 'Vehicle Category', 'Actions'].map((h, i) =>
                `<th style="text-align:${i === 5 ? 'right' : 'left'};padding:8px 12px;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">${h}</th>`
              ).join('')}
            </tr>
          </thead>
          <tbody id="detection-table">
            ${recentDetections.map(d => {
              const cam = cameras.find(c => c.id === d.camera);
              return createDetectionRow(d, cam?.name || '');
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Webcam Toggle Handler
  const webcamBtn = container.querySelector('#btn-toggle-webcam');
  if (webcamBtn) {
    webcamBtn.addEventListener('click', async () => {
      const vskpVideo = document.getElementById('video-VSKP-C01');
      if (!vskpVideo) return;

      if (activeWebcamStream) {
        // Stop webcam
        activeWebcamStream.getTracks().forEach(track => track.stop());
        activeWebcamStream = null;
        vskpVideo.srcObject = null;
        vskpVideo.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        vskpVideo.play().catch(() => {});
        webcamBtn.innerHTML = '<i data-lucide="camera"></i> Connect Local Webcam';
        webcamBtn.classList.remove('btn--primary');
        webcamBtn.classList.add('btn--secondary');
        if (window.lucide) window.lucide.createIcons();
      } else {
        try {
          // Request camera stream from browser
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
          activeWebcamStream = stream;
          vskpVideo.src = '';
          vskpVideo.srcObject = stream;
          vskpVideo.play().catch(() => {});
          webcamBtn.innerHTML = '<i data-lucide="camera-off"></i> Disconnect Webcam (VSKP-C01)';
          webcamBtn.classList.remove('btn--secondary');
          webcamBtn.classList.add('btn--primary');
          if (window.lucide) window.lucide.createIcons();
        } catch (err) {
          alert('Webcam permission denied or no camera device found on this system: ' + err.message);
        }
      }
    });
  }

  // Camera click handlers binder
  const bindCameraClicks = () => {
    container.querySelectorAll('.camera-feed').forEach(feed => {
      feed.addEventListener('click', () => {
        navigate('cameras', { cameraId: feed.dataset.camera });
      });
    });
  };
  bindCameraClicks();

  // Dynamic Camera Filtering
  const filterCameras = () => {
    const selectedCam = container.querySelector('#camera-filter')?.value || 'all';
    const selectedTraffic = container.querySelector('#traffic-filter')?.value || 'all';
    const searchTerm = container.querySelector('#camera-search')?.value.trim().toLowerCase() || '';

    let list = cameras.filter(c => c.status === 'online');
    if (selectedCam !== 'all') {
      list = cameras.filter(c => c.id === selectedCam);
    }
    if (selectedTraffic !== 'all') {
      list = list.filter(c => c.traffic === selectedTraffic);
    }
    if (searchTerm) {
      list = list.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.id.toLowerCase().includes(searchTerm) || 
        c.road.toLowerCase().includes(searchTerm) || 
        c.zone.toLowerCase().includes(searchTerm)
      );
    }

    const grid = container.querySelector('#camera-grid');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 48px;">
          <i data-lucide="cctv" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
          <div class="text-h3" style="margin-bottom: 6px;">No Matching Camera Feeds</div>
          <div class="text-secondary text-sm">No camera nodes match the specified filter criteria.</div>
        </div>
      `;
    } else {
      grid.innerHTML = list.map((cam, i) => createCameraCard(cam, detections[i % detections.length])).join('');
    }

    if (window.lucide) window.lucide.createIcons();
    bindCameraClicks();
  };

  container.querySelector('#camera-filter')?.addEventListener('change', filterCameras);
  container.querySelector('#traffic-filter')?.addEventListener('change', filterCameras);
  container.querySelector('#camera-search')?.addEventListener('input', filterCameras);

  // Track button handlers via event delegation on table (works for initial and dynamically added rows)
  const detectionTable = container.querySelector('#detection-table');
  if (detectionTable) {
    detectionTable.addEventListener('click', (e) => {
      const btn = e.target.closest('.detection-search-btn');
      if (btn && btn.dataset.plate) {
        e.stopPropagation();
        navigate('vehicles', { plate: btn.dataset.plate });
      }
    });
  }

  // Live simulation — add new detections periodically with realistic Indian categories
  const cancelSim = createLiveSimulator(() => {
    const table = document.getElementById('detection-table');
    if (!table) return;

    const cam = cameras[Math.floor(Math.random() * cameras.length)];
    const plate = randomPlate();
    const conf = (88 + Math.random() * 10).toFixed(0);
    const types = ['Car (Sedan)', 'Car (SUV)', 'Car (Hatchback)', 'Two Wheeler', 'Auto Rickshaw', 'Bus', 'Truck', 'LCV'];
    const type = types[Math.floor(Math.random() * types.length)];

    const newRow = document.createElement('tr');
    newRow.innerHTML = createDetectionRow(
      { plate, camera: cam.id, time: randomTime(), confidence: Number(conf), type },
      cam.name
    ).replace(/^<tr[^>]*>/, '').replace(/<\/tr>$/, '');
    newRow.style.animation = 'fadeIn 0.4s ease';

    newRow.style.transition = 'background 0.2s';
    newRow.onmouseenter = function() { this.style.background = 'var(--bg-elevated)'; };
    newRow.onmouseleave = function() { this.style.background = 'transparent'; };

    table.insertBefore(newRow, table.firstChild);
    if (table.children.length > 15) table.removeChild(table.lastChild);
  }, 3500);

  return () => {
    cancelSim();
    if (activeWebcamStream) {
      activeWebcamStream.getTracks().forEach(track => track.stop());
      activeWebcamStream = null;
    }
  };
}
