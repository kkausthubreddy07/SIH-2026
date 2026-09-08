/* ============================================
   CITY AI — Global State
   Centralized application state management
   ============================================ */

const listeners = [];

export const state = {
  currentUser: null,
  selectedVehicle: null,
  selectedCamera: null,
  mapLayer: 'traffic',
  alertsFilter: 'all',
  isAuthenticated: false,
};

/**
 * Update state and notify listeners
 */
export function setState(updates) {
  Object.assign(state, updates);
  listeners.forEach(fn => fn(state));
}

/**
 * Subscribe to state changes
 */
export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

/**
 * Select a vehicle and persist across screens
 */
export function selectVehicle(plate) {
  setState({ selectedVehicle: plate });
}

/**
 * Select a camera and persist across screens
 */
export function selectCamera(cameraId) {
  setState({ selectedCamera: cameraId });
}
