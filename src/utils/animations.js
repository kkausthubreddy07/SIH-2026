/* ============================================
   CITY AI — Animations & Utilities
   Counter animations, transitions, simulated live feeds
   ============================================ */

/**
 * Animate a number counting up
 */
export function animateCounter(element, target, options = {}) {
  const duration = options.duration || 1500;
  const decimals = options.decimals || 0;
  const prefix = options.prefix || '';
  const suffix = options.suffix || '';
  const start = options.start || 0;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = start + (target - start) * easedProgress;

    element.textContent = prefix + formatNumber(current, decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Format a number with commas
 */
export function formatNumber(num, decimals = 0) {
  return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Animate elements staggered
 */
export function staggerAnimate(container, selector, options = {}) {
  const delay = options.delay || 80;
  const elements = container.querySelectorAll(selector);

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = `opacity 0.4s ease ${i * delay}ms, transform 0.4s ease ${i * delay}ms`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/**
 * Animate width of progress bars
 */
export function animateProgressBars(container) {
  const bars = container.querySelectorAll('[data-width]');
  bars.forEach((bar, i) => {
    const width = bar.dataset.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1s ease';
      bar.style.width = width + '%';
    }, 100 + i * 100);
  });
}

/**
 * Simulate live data updates
 */
export function createLiveSimulator(callback, interval = 4000) {
  const id = setInterval(callback, interval);
  return () => clearInterval(id);
}

/**
 * Generate a synthetic Indian plate number with realistic state distributions
 */
export function randomPlate() {
  const states = ['AP', 'AP', 'AP', 'AP', 'TS', 'TS', 'KA', 'OD', 'TN', 'MH'];
  const state = states[Math.floor(Math.random() * states.length)];
  const district = state === 'AP' ? (Math.random() > 0.4 ? '31' : '39') : String(Math.floor(Math.random() * 38) + 1).padStart(2, '0');
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `${state}${district}${l1}${l2}${num}`;
}

/**
 * Generate random time string in IST
 */
export function randomTime() {
  const h = String(Math.floor(Math.random() * 3) + 9).padStart(2, '0');
  const m = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  const s = String(Math.floor(Math.random() * 60)).padStart(2, '0');
  return `${h}:${m}:${s} IST`;
}
