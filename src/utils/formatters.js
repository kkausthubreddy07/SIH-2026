/* ============================================
   CITY AI — Formatters
   Number, date, and text formatting utilities
   ============================================ */

/**
 * Format a number with commas and optional decimals
 * formatNumber(12842) → "12,842"
 * formatNumber(32.4, 1) → "32.4"
 */
export function formatNumber(num, decimals = 0) {
  return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a percentage
 * formatPercent(0.96) → "96%"
 * formatPercent(63) → "63%"  (if already 0-100)
 */
export function formatPercent(value, decimals = 0) {
  const pct = value <= 1 ? value * 100 : value;
  return pct.toFixed(decimals) + '%';
}

/**
 * Format distance in km
 * formatDistance(14.8) → "14.8 km"
 */
export function formatDistance(km, decimals = 1) {
  return km.toFixed(decimals) + ' km';
}

/**
 * Format speed
 * formatSpeed(32.4) → "32.4 km/h"
 */
export function formatSpeed(speed, decimals = 1) {
  return speed.toFixed(decimals) + ' km/h';
}

/**
 * Format confidence as badge-friendly value
 * formatConfidence(0.96) → "96%"
 */
export function formatConfidence(conf) {
  return Math.round(conf <= 1 ? conf * 100 : conf) + '%';
}

/**
 * Get confidence level string
 * getConfidenceLevel(0.96) → "high"
 */
export function getConfidenceLevel(conf) {
  const pct = conf <= 1 ? conf * 100 : conf;
  if (pct >= 90) return 'high';
  if (pct >= 70) return 'medium';
  return 'low';
}

/**
 * Get the current date formatted nicely
 * formatDate() → "Monday, September 1, 2026"
 */
export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time
 * formatRelativeTime(120) → "2 min ago"
 */
export function formatRelativeTime(seconds) {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Calculate duration between two time strings
 * calculateDuration("10:02:31", "10:21:04") → "18 min"
 */
export function calculateDuration(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const minutes = (eh * 60 + em) - (sh * 60 + sm);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Get severity badge class
 * getSeverityBadge("critical") → "badge--critical"
 */
export function getSeverityBadge(severity) {
  const map = {
    critical: 'badge--critical',
    warning: 'badge--warning',
    info: 'badge--info',
  };
  return map[severity] || 'badge--primary';
}

/**
 * Get traffic color by level
 */
export function getTrafficColor(traffic) {
  const map = {
    low: '#22C55E',
    moderate: '#F59E0B',
    high: '#EF4444',
    critical: '#DC2626',
    unknown: '#64748B',
  };
  return map[traffic] || '#64748B';
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  const map = {
    online: '#22C55E',
    offline: '#64748B',
    warning: '#F59E0B',
    critical: '#EF4444',
    active: '#22C55E',
    blacklisted: '#EF4444',
    suspicious: '#F59E0B',
  };
  return map[status] || '#64748B';
}
