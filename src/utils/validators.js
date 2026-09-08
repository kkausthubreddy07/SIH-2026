/* ============================================
   CITY AI — Validators
   Input validation for Indian registrations, coordinates & OCR heuristics
   ============================================ */

/**
 * Demo validation layer for Indian vehicle registration formats
 * Format: SS00AA0000 / SS00A0000 / BH00AA0000
 */
const REGISTRATION_REGEX = /^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{4}$/;

export function isValidPlate(plate) {
  if (!plate || typeof plate !== 'string') return false;
  const cleaned = plate.replace(/\s+/g, '').toUpperCase();
  return REGISTRATION_REGEX.test(cleaned);
}

/**
 * Clean and normalize a registration input
 * " ap 31 bk 4821 " → "AP31BK4821"
 */
export function normalizePlate(input) {
  if (!input) return '';
  return input.replace(/\s+/g, '').toUpperCase();
}

/**
 * Indian States and Union Territories Code Reference
 */
export const STATE_CODES = {
  AP: 'Andhra Pradesh',
  TS: 'Telangana',
  KA: 'Karnataka',
  OD: 'Odisha',
  TN: 'Tamil Nadu',
  MH: 'Maharashtra',
  KL: 'Kerala',
  DL: 'Delhi NCR',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
  GJ: 'Gujarat',
  RJ: 'Rajasthan',
  MP: 'Madhya Pradesh',
  PB: 'Punjab',
  HR: 'Haryana',
  BR: 'Bihar',
  JH: 'Jharkhand',
  CG: 'Chhattisgarh',
  GA: 'Goa',
  AS: 'Assam',
  UK: 'Uttarakhand',
  HP: 'Himachal Pradesh',
  PY: 'Puducherry',
  CH: 'Chandigarh',
  JK: 'Jammu & Kashmir',
  BH: 'Bharat Series (All-India)',
};

export function getStateName(plate) {
  if (!plate || plate.length < 2) return 'Unknown';
  const prefix = plate.substring(0, 2).toUpperCase();
  return STATE_CODES[prefix] || 'Indian Registration';
}

/**
 * Check if coordinates are valid
 */
export function isValidCoordinates(lat, lon) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

/**
 * Check if a camera node ID is valid format (e.g. "VSKP-C01" or "C01")
 */
export function isValidCameraId(id) {
  return /^(VSKP-)?C\d{2,3}$/i.test(id);
}

/**
 * OCR character confusion correction heuristics
 */
const OCR_CORRECTIONS = {
  'O': '0',
  'I': '1',
  'Z': '2',
  'S': '5',
  'B': '8',
  'G': '6',
};

export function correctOcrMisreads(text) {
  if (!text) return '';
  const cleaned = text.toUpperCase().replace(/\s+/g, '');
  if (cleaned.length < 9) return cleaned;

  const stateCode = cleaned.substring(0, 2);
  const district = cleaned.substring(2, 4);
  const rest = cleaned.substring(4);

  // Correct numbers in district code
  const correctedDistrict = district.split('').map(c => OCR_CORRECTIONS[c] || c).join('');

  return stateCode + correctedDistrict + rest;
}
