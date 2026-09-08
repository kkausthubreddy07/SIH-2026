/* ============================================
   CITY AI — Router
   Hash-based SPA router
   ============================================ */

const routes = {};
let currentRoute = null;
let currentCleanup = null;

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path, params = {}) {
  // Store params for render
  navigate._params = params;
  const currentHash = window.location.hash.slice(1) || 'dashboard';
  if (currentHash === path) {
    handleRoute();
  } else {
    window.location.hash = path;
  }
}

export function getParams() {
  return navigate._params || {};
}

export function getCurrentRoute() {
  return currentRoute;
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'dashboard';
  const content = document.getElementById('content');

  if (!content) return;

  // Cleanup previous screen
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
  }
  currentCleanup = null;

  // Update sidebar active state
  document.querySelectorAll('.sidebar__item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === hash);
  });

  // Render new screen
  const renderFn = routes[hash];
  if (renderFn) {
    currentRoute = hash;
    content.innerHTML = '';
    content.scrollTop = 0;
    const cleanup = renderFn(content);
    if (typeof cleanup === 'function') {
      currentCleanup = cleanup;
    }
  } else {
    content.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <div class="empty-state__title">Page not found</div>
        <p class="text-secondary">The requested screen does not exist.</p>
      </div>
    `;
  }

  // Re-initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  // Initial route
  handleRoute();
}
