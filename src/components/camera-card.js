/* ============================================
   CITY AI — Camera Card Component
   Live CCTV video streams, dynamic ANPR overlays & Webcam integration
   ============================================ */

// Real looping traffic CCTV videos for simulated nodes
const CAMERA_VIDEOS = {
  'VSKP-C01': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'VSKP-C02': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'VSKP-C03': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'VSKP-C04': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
};

/**
 * Create a camera feed card HTML string with real playing video
 * @param {Object} camera - Camera data object
 * @param {Object} [detection] - Optional active detection data
 */
export function createCameraCard(camera, detection = null) {
  const statusColor = camera.status === 'online' ? 'var(--success)' : 'var(--text-muted)';
  const trafficBadge = camera.traffic === 'high' || camera.traffic === 'critical' ? 'critical'
    : camera.traffic === 'moderate' ? 'warning' : 'success';

  const videoSrc = CAMERA_VIDEOS[camera.id] || CAMERA_VIDEOS['VSKP-C01'];

  return `
    <div class="camera-feed" data-camera="${camera.id}">
      <div class="camera-feed__header">
        <div class="camera-feed__name">
          <span style="width:8px;height:8px;border-radius:50%;display:inline-block;background:${statusColor};box-shadow:0 0 6px ${statusColor};"></span>
          ${camera.id} — ${camera.name}
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge--${trafficBadge}">${camera.traffic.toUpperCase()}</span>
          <span class="badge badge--success" style="font-size:10px;">● LIVE</span>
        </div>
      </div>
      <div class="camera-feed__video" style="background:#05070A;position:relative;">
        <!-- Real Video Stream -->
        <video 
          id="video-${camera.id}"
          autoplay 
          loop 
          muted 
          playsinline 
          style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85; filter: contrast(1.1) brightness(0.9);"
          src="${videoSrc}"
        ></video>

        <!-- CCTV HUD Overlay -->
        <div style="position:absolute;top:8px;left:10px;font-family:var(--font-mono);font-size:11px;color:#22C55E;text-shadow:0 0 4px #000;z-index:2;display:flex;align-items:center;gap:6px;">
          <span class="pulse-dot pulse-dot--success" style="width:6px;height:6px;"></span>
          <span>REC [${camera.id}] 30FPS • 1080p</span>
        </div>

        <div style="position:absolute;top:8px;right:10px;font-family:var(--font-mono);font-size:11px;color:#94A3B8;text-shadow:0 0 4px #000;z-index:2;">
          ${new Date().toLocaleTimeString()} IST
        </div>

        <!-- Dynamic AI ANPR Bounding Box -->
        ${detection ? `
          <div class="detection-box" style="top:32%;left:28%;width:140px;height:95px;animation:pulse 2s infinite;">
            <div class="detection-box__label" style="display:flex;align-items:center;gap:4px;">
              <span>AI SCAN</span>
              <span style="color:#22C55E;font-weight:700;">${detection.confidence}%</span>
            </div>
          </div>
          <div class="camera-feed__detection" style="z-index:3;">
            <span style="font-size:16px;">🚗</span>
            <span class="camera-feed__plate">${detection.plate}</span>
            <span class="camera-feed__confidence">${detection.confidence}%</span>
            <span class="camera-feed__time">${detection.time}</span>
          </div>
        ` : ''}
      </div>
      <div class="camera-feed__footer">
        <span class="text-caption text-secondary">${camera.road} • ${camera.direction}</span>
        <span class="text-caption text-secondary">Speed: <strong style="color:var(--text);">${camera.avgSpeed} km/h</strong></span>
      </div>
    </div>
  `;
}

/**
 * Create a camera info grid (for camera details)
 */
export function createCameraInfoGrid(camera) {
  const trafficBadge = camera.traffic === 'high' || camera.traffic === 'critical' ? 'critical'
    : camera.traffic === 'moderate' ? 'warning'
    : camera.traffic === 'unknown' ? 'info' : 'success';

  return `
    <div class="camera-info-grid" style="grid-template-columns: repeat(3, 1fr);">
      <div class="camera-info-item">
        <div class="camera-info-item__label">Location</div>
        <div class="camera-info-item__value">${camera.name}</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Road Corridor</div>
        <div class="camera-info-item__value">${camera.road}</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Direction</div>
        <div class="camera-info-item__value">${camera.direction}</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Coordinates</div>
        <div class="camera-info-item__value" style="font-family:var(--font-mono);font-size:13px;">${camera.lat.toFixed(4)}, ${camera.lon.toFixed(4)}</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Current Traffic</div>
        <div class="camera-info-item__value">
          <span class="badge badge--${trafficBadge}">${camera.traffic.toUpperCase()}</span>
        </div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Average Speed</div>
        <div class="camera-info-item__value">${camera.avgSpeed} km/h</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Vehicles Today</div>
        <div class="camera-info-item__value" style="font-weight:700;font-size:18px;">${camera.vehiclesToday.toLocaleString()}</div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Node Telemetry</div>
        <div class="camera-info-item__value">
          <span class="status status--${camera.status}">
            <span class="status__dot"></span>
            ${camera.status.toUpperCase()}
          </span>
        </div>
      </div>
      <div class="camera-info-item">
        <div class="camera-info-item__label">Uptime</div>
        <div class="camera-info-item__value" style="color:var(--success);">${camera.status === 'online' ? '99.7%' : '0%'}</div>
      </div>
    </div>
  `;
}
