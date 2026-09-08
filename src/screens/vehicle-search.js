/* ============================================
   CITY AI — Vehicle Search & OCR Inspector Screen
   Registration search, OCR Image Upload & Step-by-Step AI Pipeline
   ============================================ */

import { vehicles, cameras } from '../data/mock-data.js';
import { createMapComponent } from '../components/map.js';
import { drawRoute, createCameraMarker } from '../utils/map-utils.js';
import { createVehicleStats, createConfidenceBar } from '../components/vehicle-card.js';
import { showEChallanModal } from '../components/echallan-modal.js';
import { normalizePlate, isValidPlate } from '../utils/validators.js';
import { formatConfidence, getStatusColor } from '../utils/formatters.js';
import { navigate, getParams } from '../router.js';
import { selectVehicle } from '../state.js';

let searchMap = null;

export function renderVehicleSearch(container) {
  const params = getParams();

  container.innerHTML = `
    <!-- Search Hero with Mode Switcher -->
    <div class="vehicle-search-hero">
      <div class="vehicle-search-hero__title">Vehicle Intelligence & ANPR Search</div>
      <div class="vehicle-search-hero__subtitle">Search by registration plate number or test live OCR image recognition pipeline</div>
      
      <!-- Mode Toggle -->
      <div style="display:flex;justify-content:center;gap:12px;margin: 16px 0;">
        <button class="btn btn--primary btn--sm search-mode-btn" id="mode-text-btn" data-mode="text">
          <i data-lucide="search"></i> Text Registration Search
        </button>
        <button class="btn btn--secondary btn--sm search-mode-btn" id="mode-ocr-btn" data-mode="ocr">
          <i data-lucide="camera"></i> 📸 OCR Plate Image Inspector
        </button>
      </div>

      <!-- Text Search Mode Panel -->
      <div id="text-search-panel">
        <div class="vehicle-search-bar">
          <input type="text" id="vehicle-search-input" placeholder="e.g. AP31BK4821" value="${params.plate || ''}" />
          <button class="btn btn--primary" id="vehicle-search-btn">
            <i data-lucide="search"></i> SEARCH
          </button>
        </div>
        <div style="margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
          <span class="text-caption text-muted">Demo vehicle registrations:</span>
          ${vehicles.map(v => `
            <button class="btn btn--ghost btn--sm quick-search-btn" data-plate="${v.plate}" style="font-family: var(--font-mono); font-size: 11px;">
              ${v.plate}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- OCR Image Inspector Mode Panel -->
      <div id="ocr-inspector-panel" style="display:none; max-width: 680px; margin: 0 auto; background: rgba(11,15,20,0.8); border: 1px solid var(--border); border-radius: 12px; padding: 20px;">
        <div style="font-size: 14px; font-weight: 700; color: #F1F5F9; margin-bottom: 8px; text-align: left;">
          Upload Vehicle Photo or Select Test Sample
        </div>
        <div style="display:flex; gap: 8px; margin-bottom: 16px; justify-content: flex-start; flex-wrap: wrap;">
          <button class="btn btn--ghost btn--sm ocr-sample-btn" data-sample="ap31" data-plate="AP31BK4821">Sample 1: AP31BK4821 (SUV)</button>
          <button class="btn btn--ghost btn--sm ocr-sample-btn" data-sample="ts08" data-plate="TS08JK1234">Sample 2: TS08JK1234 (Sedan)</button>
          <button class="btn btn--ghost btn--sm ocr-sample-btn" data-sample="stolen" data-plate="AP31AB1234">Sample 3: AP31AB1234 (Watchlist)</button>
        </div>

        <!-- Dropzone / Input -->
        <label style="border: 2px dashed #3B82F680; border-radius: 8px; padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: #111820; transition: border-color 0.2s;" ondragover="this.style.borderColor='#3B82F6'" ondragleave="this.style.borderColor='#3B82F680'">
          <i data-lucide="upload-cloud" style="width:36px;height:36px;color:#3B82F6;margin-bottom:8px;"></i>
          <span style="font-size:13px;font-weight:600;">Upload Vehicle Photo (JPG / PNG)</span>
          <span style="font-size:11px;color:#94A3B8;margin-top:4px;">Drag & drop image or browse files from computer</span>
          <input type="file" id="ocr-file-input" accept="image/*" style="display:none;" />
        </label>

        <!-- Pipeline Progress Inspector -->
        <div id="ocr-pipeline-result" style="margin-top: 16px; display: none;"></div>
      </div>
    </div>

    <!-- Results -->
    <div id="vehicle-results"></div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const searchBtn = container.querySelector('#vehicle-search-btn');
  const searchInput = container.querySelector('#vehicle-search-input');
  const textPanel = container.querySelector('#text-search-panel');
  const ocrPanel = container.querySelector('#ocr-inspector-panel');
  const modeTextBtn = container.querySelector('#mode-text-btn');
  const modeOcrBtn = container.querySelector('#mode-ocr-btn');

  // Mode switching
  modeTextBtn.addEventListener('click', () => {
    modeTextBtn.className = 'btn btn--primary btn--sm search-mode-btn';
    modeOcrBtn.className = 'btn btn--secondary btn--sm search-mode-btn';
    textPanel.style.display = 'block';
    ocrPanel.style.display = 'none';
  });

  modeOcrBtn.addEventListener('click', () => {
    modeOcrBtn.className = 'btn btn--primary btn--sm search-mode-btn';
    modeTextBtn.className = 'btn btn--secondary btn--sm search-mode-btn';
    textPanel.style.display = 'none';
    ocrPanel.style.display = 'block';
  });

  const executeSearch = (rawPlate) => {
    const cleaned = normalizePlate(rawPlate);
    searchInput.value = cleaned;
    doSearch(cleaned);
  };

  searchBtn.addEventListener('click', () => executeSearch(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeSearch(searchInput.value);
  });

  // Quick search buttons
  container.querySelectorAll('.quick-search-btn').forEach(btn => {
    btn.addEventListener('click', () => executeSearch(btn.dataset.plate));
  });

  // Sample OCR Buttons
  container.querySelectorAll('.ocr-sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      runOcrPipelineDemo(btn.dataset.plate, container);
    });
  });

  // File Upload OCR handler
  const fileInput = container.querySelector('#ocr-file-input');
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const samplePlate = 'AP31BK4821';
      runOcrPipelineDemo(samplePlate, container, URL.createObjectURL(e.target.files[0]));
    }
  });

  // Auto-search if plate param provided
  if (params.plate) {
    setTimeout(() => executeSearch(params.plate), 300);
  }

  return () => {
    if (searchMap) {
      searchMap.remove();
      searchMap = null;
    }
  };
}

/**
 * Simulate the 4-step computer vision & OCR pipeline
 */
function runOcrPipelineDemo(plate, container, customImageSrc = null) {
  const resultBox = container.querySelector('#ocr-pipeline-result');
  if (!resultBox) return;

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div style="background:#0B0F14;border:1px solid #25303A;border-radius:8px;padding:16px;text-align:left;">
      <div style="font-size:12px;font-weight:700;color:#3B82F6;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:6px;">
        <span class="pulse-dot pulse-dot--success"></span> AI COMPUTER VISION & OCR EXTRACTION PIPELINE
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:14px;">
        <!-- Step 1 -->
        <div style="background:#17212B;border-radius:6px;padding:10px;border:1px solid #25303A;">
          <div style="font-size:10px;color:#94A3B8;font-weight:700;">STEP 1: YOLOv8 LOCALIZATION</div>
          <div style="margin-top:6px;height:45px;background:#000;display:flex;align-items:center;justify-content:center;border:1px solid #22C55E;position:relative;overflow:hidden;border-radius:4px;">
            ${customImageSrc ? `<img src="${customImageSrc}" style="width:100%;height:100%;object-fit:cover;opacity:0.75;" />` : ''}
            <span style="position:absolute;font-family:var(--font-mono);font-size:11px;color:#22C55E;background:rgba(0,0,0,0.7);padding:1px 6px;border-radius:3px;">[ BBOX: 98.4% ]</span>
          </div>
        </div>

        <!-- Step 2 -->
        <div style="background:#17212B;border-radius:6px;padding:10px;border:1px solid #25303A;">
          <div style="font-size:10px;color:#94A3B8;font-weight:700;">STEP 2: BINARIZATION / PREPROC</div>
          <div style="margin-top:6px;height:45px;background:#222;display:flex;align-items:center;justify-content:center;filter:contrast(300%) grayscale(100%);border-radius:4px;">
            <span style="font-family:var(--font-mono);font-size:12px;color:#fff;letter-spacing:1px;">${plate}</span>
          </div>
        </div>

        <!-- Step 3 -->
        <div style="background:#17212B;border-radius:6px;padding:10px;border:1px solid #25303A;">
          <div style="font-size:10px;color:#94A3B8;font-weight:700;">STEP 3: OCR EXTRACTION</div>
          <div style="margin-top:6px;height:45px;background:#0B0F14;display:flex;align-items:center;justify-content:center;border-radius:4px;">
            <span style="font-family:var(--font-mono);font-size:13px;font-weight:800;color:#3B82F6;">${plate}</span>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;background:#17212B;padding:10px 14px;border-radius:6px;">
        <div>
          <div style="font-size:11px;color:#94A3B8;">Extracted License Plate:</div>
          <div style="font-family:var(--font-mono);font-size:16px;font-weight:800;color:#22C55E;">${plate}</div>
        </div>
        <button class="btn btn--primary btn--sm" id="btn-track-ocr-result">
          <i data-lucide="route"></i> Track Route on City Map
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const trackBtn = resultBox.querySelector('#btn-track-ocr-result');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const searchInput = container.querySelector('#vehicle-search-input');
      if (searchInput) searchInput.value = plate;
      doSearch(plate);
    });
  }
}

function doSearch(plate) {
  const results = document.getElementById('vehicle-results');
  if (!results || !plate) return;

  const vehicle = vehicles.find(v => v.plate === plate) || 
                  vehicles.find(v => v.plate.includes(plate)) ||
                  vehicles.find(v => plate.includes(v.plate));

  if (!vehicle) {
    results.innerHTML = `
      <div class="card" style="text-align: center; padding: 48px;">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
        <div class="text-h3" style="margin-bottom: 8px;">Registration Not Found</div>
        <div class="text-secondary">No recorded telemetry for registration "${plate}". Verify registration format (e.g., AP31BK4821).</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Update global state
  selectVehicle(vehicle.plate);

  const statusColors = {
    active: 'success',
    blacklisted: 'critical',
    suspicious: 'warning',
  };

  const traj = vehicle.trajectory;

  results.innerHTML = `
    <div class="vehicle-result animate-in">
      <!-- Header -->
      <div class="vehicle-result__header">
        <div>
          <div class="vehicle-result__plate">${vehicle.plate}</div>
          <div class="text-secondary" style="margin-top: 4px;">
            <strong>${vehicle.stateName || 'Indian Registration'}</strong> • ${vehicle.type} • ${vehicle.color}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="badge badge--${statusColors[vehicle.status] || 'primary'}" style="font-size: 12px; padding: 4px 12px;">
            ● ${vehicle.status === 'blacklisted' ? 'WATCHLIST' : vehicle.status.toUpperCase()}
          </span>
          <button class="btn btn--secondary btn--sm" id="btn-vehicle-challan">
            <i data-lucide="file-text"></i> E-Challan Notice
          </button>
          <button class="btn btn--primary btn--sm" id="btn-view-trajectory">
            <i data-lucide="route"></i> Reconstruct Trajectory
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      ${createVehicleStats(vehicle)}

      <!-- Map & Timeline -->
      <div class="vehicle-result__body">
        <div>
          <div class="text-label" style="margin-bottom: 8px;">Corridor Route Track (Visakhapatnam)</div>
          <div class="vehicle-result__map" id="vehicle-search-map"></div>
        </div>
        <div>
          <div class="text-label" style="margin-bottom: 8px;">Camera Checkpoint History (${traj.length} Nodes)</div>
          <div class="timeline">
            ${traj.map(t => {
              const cam = cameras.find(c => c.id === t.camera);
              return `
                <div class="timeline__item">
                  <div class="timeline__dot"></div>
                  <div class="timeline__content">
                    <div class="timeline__title">${t.camera} — ${cam?.name || 'Checkpoint'}</div>
                    <div class="timeline__meta">
                      ${t.time} • Speed: ${t.speed} km/h • OCR: ${Math.round(t.confidence * 100)}%
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // E-Challan Button handler
  const challanBtn = results.querySelector('#btn-vehicle-challan');
  if (challanBtn) {
    challanBtn.addEventListener('click', () => {
      showEChallanModal({
        plate: vehicle.plate,
        violation: vehicle.status === 'blacklisted' ? 'Demo Watchlist / Stolen Goods Carrier' : 'Speed Limit Compliance Check',
        camera: `${traj[0].camera} (${cameras.find(c => c.id === traj[0].camera)?.name || 'Corridor'})`,
        speed: `${traj[0].speed} km/h`,
        limit: '40 km/h',
        time: traj[0].time,
        fine: vehicle.status === 'blacklisted' ? 2500 : 1000,
      });
    });
  }

  // View full trajectory button
  const trajBtn = results.querySelector('#btn-view-trajectory');
  if (trajBtn) {
    trajBtn.addEventListener('click', () => {
      navigate('trajectory', { plate: vehicle.plate });
    });
  }

  // Initialize mini map
  setTimeout(() => {
    if (searchMap) searchMap.remove();

    const points = traj.map(t => {
      const cam = cameras.find(c => c.id === t.camera);
      return cam ? { lat: cam.lat, lon: cam.lon, name: cam.name } : null;
    }).filter(Boolean);

    if (points.length > 0) {
      searchMap = createMapComponent('vehicle-search-map', {
        center: [points[0].lat, points[0].lon],
        zoom: 13,
        showCameras: false,
        showTraffic: false,
      });

      if (searchMap) {
        drawRoute(searchMap, points, { color: '#3B82F6', weight: 3 });

        points.forEach((p, i) => {
          L.circleMarker([p.lat, p.lon], {
            radius: i === 0 || i === points.length - 1 ? 7 : 5,
            fillColor: i === 0 ? '#22C55E' : i === points.length - 1 ? '#EF4444' : '#3B82F6',
            fillOpacity: 1,
            color: '#fff',
            weight: 2,
          }).addTo(searchMap).bindPopup(`${p.name} (Stop ${i + 1})`);
        });

        setTimeout(() => searchMap.invalidateSize(), 200);
      }
    }
  }, 100);
}
