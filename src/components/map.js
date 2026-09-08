/* ============================================
   CITY AI — Map Component
   Reusable map wrapper with Heatmap, Traffic, Camera & Satellite controls
   ============================================ */

import { 
  createMap as initLeafletMap, 
  createCameraMarker, 
  addTrafficSegments, 
  CARTO_DARK_TILES, 
  CARTO_ATTRIBUTION, 
  ESRI_SATELLITE_TILES, 
  ESRI_ATTRIBUTION,
  VSKP_CORRIDOR_VIEWS 
} from '../utils/map-utils.js';
import { cameras } from '../data/mock-data.js';
import { navigate } from '../router.js';

/**
 * Visakhapatnam Traffic Density Heatmap Points [lat, lon, intensity]
 */
export const VSKP_HEAT_POINTS = [
  [17.7137, 83.3018, 0.95], // Jagadamba Junction (Critical)
  [17.7256, 83.3075, 0.90], // RTC Complex / Dwaraka Nagar
  [17.7471, 83.2476, 0.85], // NAD Junction (NH-16)
  [17.6868, 83.2185, 0.80], // Gajuwaka Junction
  [17.7295, 83.2746, 0.75], // BRTS Corridor
  [17.7215, 83.3180, 0.65], // Siripuram Circle
  [17.7358, 83.3176, 0.55], // Maddilapalem
  [17.7212, 83.2244, 0.45], // Airport Road Flyover
  [17.7441, 83.3387, 0.35], // MVP Colony
  [17.7815, 83.3850, 0.30], // Rushikonda Beach Road
  [17.6540, 83.1720, 0.25], // Steel Plant Road
  // Intermediate road cluster points for smooth gradient
  [17.7200, 83.3050, 0.80],
  [17.7300, 83.2900, 0.70],
  [17.7380, 83.2600, 0.75],
  [17.7000, 83.2350, 0.60],
];

/**
 * Create and initialize a map in a container
 */
export function createMapComponent(containerId, options = {}) {
  try {
    const map = initLeafletMap(containerId, {
      center: options.center,
      zoom: options.zoom,
      zoomControl: options.zoomControl,
    });

    if (!map) return null;

    const layers = {
      markers: [],
      trafficSegments: [],
      heatLayer: null,
      satelliteLayer: null,
    };

    // 1. Camera Markers Layer
    const cameraList = options.cameras || cameras;
    cameraList.forEach(cam => {
      const marker = createCameraMarker(cam, (c) => {
        navigate('cameras', { cameraId: c.id });
      });
      if (options.showCameras !== false) marker.addTo(map);
      layers.markers.push(marker);
    });

    // 2. Traffic Flow Segments Layer
    if (options.showTraffic !== false) {
      layers.trafficSegments = addTrafficSegments(map, cameras);
    }

    // 3. Heatmap Layer (using Leaflet.heat if available)
    if (typeof L !== 'undefined' && typeof L.heatLayer === 'function') {
      layers.heatLayer = L.heatLayer(VSKP_HEAT_POINTS, {
        radius: 38,
        blur: 26,
        maxZoom: 15,
        gradient: {
          0.2: '#3B82F6',
          0.4: '#06B6D4',
          0.6: '#22C55E',
          0.8: '#F59E0B',
          1.0: '#EF4444',
        },
      });
      if (options.showHeatmap) {
        layers.heatLayer.addTo(map);
      }
    }

    // 4. Pre-create Satellite Layer for instant switching
    layers.satelliteLayer = L.tileLayer(ESRI_SATELLITE_TILES, {
      attribution: ESRI_ATTRIBUTION,
      maxZoom: 18,
    });

    // Store layers object on map instance for easy toggle
    map._cityaiLayers = layers;

    return map;
  } catch (e) {
    console.warn('Map initialization error:', e);
    return null;
  }
}

/**
 * Switch map layer mode
 * @param {L.Map} map
 * @param {'traffic'|'cameras'|'heatmap'|'satellite'} mode
 */
export function switchMapLayer(map, mode) {
  if (!map || !map._cityaiLayers) return;
  const { markers, trafficSegments, heatLayer, satelliteLayer } = map._cityaiLayers;

  if (mode === 'traffic') {
    // Revert to CartoDB dark base if satellite was active
    if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (map._cityaiBaseLayer && !map.hasLayer(map._cityaiBaseLayer)) map._cityaiBaseLayer.addTo(map);

    trafficSegments.forEach(seg => { if (!map.hasLayer(seg)) seg.addTo(map); });
    markers.forEach(m => { if (!map.hasLayer(m)) m.addTo(map); });
    if (heatLayer && map.hasLayer(heatLayer)) map.removeLayer(heatLayer);

  } else if (mode === 'cameras') {
    if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (map._cityaiBaseLayer && !map.hasLayer(map._cityaiBaseLayer)) map._cityaiBaseLayer.addTo(map);

    trafficSegments.forEach(seg => { if (map.hasLayer(seg)) map.removeLayer(seg); });
    markers.forEach(m => { if (!map.hasLayer(m)) m.addTo(map); });
    if (heatLayer && map.hasLayer(heatLayer)) map.removeLayer(heatLayer);

  } else if (mode === 'heatmap') {
    if (satelliteLayer && map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
    if (map._cityaiBaseLayer && !map.hasLayer(map._cityaiBaseLayer)) map._cityaiBaseLayer.addTo(map);

    trafficSegments.forEach(seg => { if (map.hasLayer(seg)) map.removeLayer(seg); });
    markers.forEach(m => { if (!map.hasLayer(m)) m.addTo(map); });
    if (heatLayer && !map.hasLayer(heatLayer)) heatLayer.addTo(map);

  } else if (mode === 'satellite') {
    // Switch to high-resolution coastal satellite imagery
    if (map._cityaiBaseLayer && map.hasLayer(map._cityaiBaseLayer)) map.removeLayer(map._cityaiBaseLayer);
    if (satelliteLayer && !map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);

    trafficSegments.forEach(seg => { if (!map.hasLayer(seg)) seg.addTo(map); });
    markers.forEach(m => { if (!map.hasLayer(m)) m.addTo(map); });
    if (heatLayer && map.hasLayer(heatLayer)) map.removeLayer(heatLayer);
  }

  map.invalidateSize();
}

/**
 * Focus / smooth flyTo a specific Visakhapatnam corridor
 * @param {L.Map} map
 * @param {'all'|'central'|'nh16'|'beach'|'industrial'|'north'} corridorKey
 */
export function focusCorridor(map, corridorKey = 'all') {
  if (!map) return;
  const view = VSKP_CORRIDOR_VIEWS[corridorKey] || VSKP_CORRIDOR_VIEWS.all;
  map.flyTo(view.center, view.zoom, {
    animate: true,
    duration: 1.2,
    easeLinearity: 0.25,
  });
}

/**
 * Create a map legend overlay HTML
 */
export function createMapLegend(items) {
  return `
    <div class="map-legend">
      <div style="font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">
        Corridor Flow
      </div>
      ${items.map(item => `
        <div class="map-legend__item">
          <div class="map-legend__dot" style="background: ${item.color}; box-shadow: 0 0 6px ${item.color};"></div>
          <span>${item.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export const TRAFFIC_LEGEND = [
  { color: '#EF4444', label: 'Congested (< 20 km/h)' },
  { color: '#F59E0B', label: 'Moderate Flow (20-35 km/h)' },
  { color: '#22C55E', label: 'Clear Corridor (> 35 km/h)' },
];
