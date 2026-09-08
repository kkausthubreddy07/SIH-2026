/* ============================================
   CITY AI — Map Utilities
   Leaflet helpers for Visakhapatnam GIS maps (100% Free, High Speed & No API key needed)
   ============================================ */

// CartoDB Dark Matter base tiles (high speed, CORS enabled, dark styled for command centers)
export const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const CARTO_LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
export const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Esri World Imagery Satellite tiles
export const ESRI_SATELLITE_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const ESRI_ATTRIBUTION = '&copy; Esri &mdash; Visakhapatnam Coastal Satellite Telemetry';

// Visakhapatnam Center & Zoom
export const DEFAULT_CENTER = [17.7285, 83.2850];
export const DEFAULT_ZOOM = 12;

// Visakhapatnam Strategic Corridor Focus Coordinates
export const VSKP_CORRIDOR_VIEWS = {
  all: { center: [17.7285, 83.2850], zoom: 12, name: 'All Visakhapatnam Metropolitan Area' },
  central: { center: [17.7200, 83.3080], zoom: 14, name: 'Central Commercial Hub (Jagadamba / RTC Complex)' },
  nh16: { center: [17.7340, 83.2360], zoom: 13.5, name: 'NH-16 North Corridor (Airport / NAD Junction)' },
  beach: { center: [17.7600, 83.3600], zoom: 13, name: 'Coastline / Beach Road (Rushikonda IT SEZ)' },
  industrial: { center: [17.6700, 83.1950], zoom: 13, name: 'Industrial Sector (Gajuwaka / Steel Plant)' },
  north: { center: [17.7820, 83.2140], zoom: 13.5, name: 'North Outer Bypass (Pendurthi / Simhachalam)' },
};

/**
 * Create a Leaflet map with dark tiles and crisp road labels
 */
export function createMap(containerId, options = {}) {
  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) return null;

  // Clean up any stale Leaflet instance on the container element
  if (container._leaflet_id) {
    container._leaflet_id = null;
  }

  const center = options.center || DEFAULT_CENTER;
  const zoom = options.zoom || DEFAULT_ZOOM;

  const map = L.map(container, {
    center: center,
    zoom: zoom,
    zoomControl: options.zoomControl !== false,
    attributionControl: true,
    maxZoom: 18,
    minZoom: 10,
    preferCanvas: true,
  });

  // Explicitly set view to ensure tile calculations run immediately
  map.setView(center, zoom);

  // Base Map Layer based on active theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('cityai-theme') || 'dark';
  const initialTiles = currentTheme === 'light' ? CARTO_LIGHT_TILES : CARTO_DARK_TILES;

  const baseLayer = L.tileLayer(initialTiles, {
    attribution: CARTO_ATTRIBUTION,
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  map._cityaiBaseLayer = baseLayer;
  window._cityaiActiveMap = map;

  // Track coordinates on mouse move
  map.on('mousemove', (e) => {
    const hud = document.getElementById('map-coordinates-hud');
    if (hud) {
      hud.textContent = `Lat: ${e.latlng.lat.toFixed(4)}° N, Lon: ${e.latlng.lng.toFixed(4)}° E`;
    }
  });

  // Force map redraw to prevent grey/blank tile sizing issues
  setTimeout(() => { map.invalidateSize(); }, 100);
  setTimeout(() => { map.invalidateSize(); }, 350);
  setTimeout(() => { map.invalidateSize(); }, 750);

  return map;
}

/**
 * Create a camera marker with custom SVG icon and rich info popup
 */
export function createCameraMarker(camera, onClick) {
  const statusColors = {
    online: '#22C55E',
    offline: '#64748B',
    warning: '#F59E0B',
    critical: '#EF4444',
  };

  const trafficColors = {
    low: '#22C55E',
    moderate: '#F59E0B',
    high: '#EF4444',
    critical: '#DC2626',
    unknown: '#64748B',
  };

  const color = statusColors[camera.status] || '#64748B';
  const shortId = camera.id.replace('VSKP-', '');

  const icon = L.divIcon({
    className: 'camera-marker',
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        cursor: pointer;
      ">
        <div style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(11, 15, 20, 0.94);
          border: 2px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: ${color};
          font-family: 'Inter', sans-serif;
          box-shadow: 0 0 16px ${color}90, 0 4px 10px rgba(0,0,0,0.8);
          transition: transform 0.2s ease;
        " onmouseenter="this.style.transform='scale(1.15)'" onmouseleave="this.style.transform='scale(1)'">${shortId}</div>
        ${camera.status === 'online' ? `
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid #0B0F14;
            box-shadow: 0 0 10px ${color};
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

  const marker = L.marker([camera.lat, camera.lon], { icon, title: `${camera.id} — ${camera.name}` });

  // Rich Popup Content
  const popupContent = `
    <div style="font-family: 'Inter', sans-serif; min-width: 240px; color: #F1F5F9; padding: 4px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #25303A; padding-bottom: 6px;">
        <span style="font-family: var(--font-mono); font-size: 14px; font-weight: 800; color: #3B82F6;">${camera.id}</span>
        <span style="
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          background: ${trafficColors[camera.traffic]}22;
          color: ${trafficColors[camera.traffic]};
          border: 1px solid ${trafficColors[camera.traffic]}50;
        ">${camera.traffic} Traffic</span>
      </div>

      <div style="font-weight: 700; font-size: 15px; color: #F8FAFC; margin-bottom: 3px;">${camera.name}</div>
      <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">📍 ${camera.road} • ${camera.direction}</div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: #17212B; padding: 8px 10px; border-radius: 6px; margin-bottom: 10px; font-size: 11px;">
        <div>
          <div style="color: #94A3B8;">Avg Speed:</div>
          <div style="font-weight: 700; color: #F8FAFC; font-size: 13px;">${camera.avgSpeed} km/h</div>
        </div>
        <div>
          <div style="color: #94A3B8;">Today Volume:</div>
          <div style="font-weight: 700; color: #F8FAFC; font-size: 13px;">${camera.vehiclesToday.toLocaleString()}</div>
        </div>
        <div>
          <div style="color: #94A3B8;">Sector Zone:</div>
          <div style="color: #F8FAFC; font-weight: 600;">${camera.zone}</div>
        </div>
        <div>
          <div style="color: #94A3B8;">Telemetry:</div>
          <div style="color: ${color}; font-weight: 700;">● ${camera.status.toUpperCase()}</div>
        </div>
      </div>

      <button id="btn-popup-view-${camera.id}" style="
        width: 100%;
        background: #3B82F6;
        color: #fff;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: background 0.2s;
      " onmouseover="this.style.background='#2563EB'" onmouseout="this.style.background='#3B82F6'">
        📹 Open CCTV Live Stream
      </button>
    </div>
  `;

  marker.bindPopup(popupContent, {
    closeButton: false,
    offset: [0, -14],
    className: 'visakhapatnam-marker-popup',
  });

  marker.on('popupopen', () => {
    const btn = document.getElementById(`btn-popup-view-${camera.id}`);
    if (btn && onClick) {
      btn.addEventListener('click', () => onClick(camera));
    }
  });

  if (onClick) {
    marker.on('click', () => {
      // open popup on click
      marker.openPopup();
    });
  }

  return marker;
}

/**
 * Draw a route polyline between points
 */
export function drawRoute(map, points, options = {}) {
  const latlngs = points.map(p => [p.lat, p.lon]);

  const polyline = L.polyline(latlngs, {
    color: options.color || '#3B82F6',
    weight: options.weight || 4,
    opacity: options.opacity || 0.9,
    dashArray: options.dashed ? '8 12' : null,
    ...options,
  }).addTo(map);

  if (options.fitBounds !== false) {
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }

  return polyline;
}

/**
 * Create an animated vehicle marker for trajectory playback
 */
export function createVehicleMarker(position) {
  const icon = L.divIcon({
    className: 'vehicle-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #3B82F6;
        border: 3px solid #fff;
        box-shadow: 0 0 24px rgba(59,130,246,0.9), 0 0 45px rgba(59,130,246,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 15px;
      ">🚗</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return L.marker(position, { icon, zIndexOffset: 1000 });
}

/**
 * Animate a marker along a path
 */
export function animateMarker(marker, path, options = {}) {
  const duration = options.duration || 3500;
  const totalPoints = path.length;
  let animationFrame;
  let startTime;

  const onStep = options.onStep || (() => {});
  const onComplete = options.onComplete || (() => {});

  function interpolate(p1, p2, t) {
    return [
      p1[0] + (p2[0] - p1[0]) * t,
      p1[1] + (p2[1] - p1[1]) * t,
    ];
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const segmentProgress = progress * (totalPoints - 1);
    const segIndex = Math.floor(segmentProgress);
    const segT = segmentProgress - segIndex;

    if (segIndex < totalPoints - 1) {
      const pos = interpolate(path[segIndex], path[segIndex + 1], segT);
      marker.setLatLng(pos);
      onStep(segIndex, segT);
    } else {
      marker.setLatLng(path[totalPoints - 1]);
    }

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      onComplete();
    }
  }

  animationFrame = requestAnimationFrame(step);

  return () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };
}

/**
 * Create named, traffic-colored road segments across Visakhapatnam corridors
 */
export function addTrafficSegments(map, cameras) {
  const segments = [];
  const connections = [
    { from: 'VSKP-C01', to: 'VSKP-C08', name: 'NH-16 BRTS Expressway Corridor', dist: '3.4 km' },
    { from: 'VSKP-C08', to: 'VSKP-C06', name: 'Dwaraka Nagar Commercial Arterial', dist: '2.8 km' },
    { from: 'VSKP-C06', to: 'VSKP-C11', name: 'Commercial Center Spine (Jagadamba)', dist: '1.9 km' },
    { from: 'VSKP-C11', to: 'VSKP-C05', name: 'VIP Road Corridor (Siripuram)', dist: '2.1 km' },
    { from: 'VSKP-C05', to: 'VSKP-C02', name: 'Siripuram ↔ Maddilapalem Junction', dist: '2.4 km' },
    { from: 'VSKP-C02', to: 'VSKP-C03', name: 'Sector 1 MVP Main Corridor', dist: '3.1 km' },
    { from: 'VSKP-C03', to: 'VSKP-C10', name: 'Beach Road Coastal Highway (Rushikonda)', dist: '6.4 km' },
    { from: 'VSKP-C07', to: 'VSKP-C01', name: 'Airport Flyover Expressway Corridor', dist: '4.2 km' },
    { from: 'VSKP-C01', to: 'VSKP-C04', name: 'Gajuwaka Industrial Arterial', dist: '7.8 km' },
    { from: 'VSKP-C04', to: 'VSKP-C09', name: 'Vizag Steel Plant Link (Kurmannapalem)', dist: '5.6 km' },
  ];

  const trafficColors = {
    low: '#22C55E',
    moderate: '#F59E0B',
    high: '#EF4444',
    critical: '#DC2626',
  };

  const cameraMap = {};
  cameras.forEach(c => { cameraMap[c.id] = c; });

  connections.forEach((conn) => {
    const c1 = cameraMap[conn.from];
    const c2 = cameraMap[conn.to];
    if (!c1 || !c2) return;

    const traffic = c1.avgSpeed < c2.avgSpeed ? c1.traffic : c2.traffic;
    const avgSpeed = ((c1.avgSpeed + c2.avgSpeed) / 2).toFixed(1);
    const color = trafficColors[traffic] || '#22C55E';

    const segment = L.polyline(
      [[c1.lat, c1.lon], [c2.lat, c2.lon]],
      { color, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }
    ).addTo(map);

    segment.bindTooltip(`
      <div style="font-family:sans-serif;font-size:11px;">
        <strong style="color:#F1F5F9;">${conn.name} (${conn.dist})</strong><br/>
        <span style="color:${color};font-weight:700;">● ${traffic.toUpperCase()} TRAFFIC</span> • ${avgSpeed} km/h avg
      </div>
    `, { sticky: true, className: 'map-tooltip' });

    segments.push(segment);
  });

  return segments;
}
