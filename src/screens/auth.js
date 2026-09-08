/* ============================================
   CITY AI — Auth Screen
   Dark themed login with glassmorphism
   ============================================ */

export function renderAuth(container, onLogin) {
  container.innerHTML = `
    <div class="auth-card animate-in">
      <div class="auth-card__logo">
        <div class="auth-card__icon">
          <i data-lucide="scan-eye"></i>
        </div>
        <div class="auth-card__brand-name">CITY AI</div>
        <div class="auth-card__brand-sub">VISAKHAPATNAM • ANDHRA PRADESH</div>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <div class="text-h3" style="margin-bottom: 4px;">Command Center Access</div>
        <div class="text-secondary text-sm">Traffic Intelligence & ANPR Trajectory Platform</div>
        <div style="margin-top: 8px;">
          <span class="badge badge--success" style="font-size: 11px;">● SIMULATION MODE ACTIVE</span>
        </div>
      </div>

      <form class="auth-form" id="login-form">
        <div class="input-group">
          <label class="input-group__label">Operator ID / Email</label>
          <input type="email" id="auth-email" placeholder="control.vskp@cityai.gov.in" value="control.vskp@cityai.gov.in" />
        </div>
        <div class="input-group">
          <label class="input-group__label">Security Key</label>
          <input type="password" id="auth-password" placeholder="••••••••" value="vskp2026" />
        </div>
        <button type="submit" class="btn btn--primary btn--lg">
          <i data-lucide="log-in"></i>
          Access Command Center
        </button>
      </form>

      <div class="auth-hint">
        <div class="auth-hint__title">Demo Access Credentials</div>
        <div class="auth-hint__cred">control.vskp@cityai.gov.in / vskp2026</div>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <span class="text-caption text-muted">Synthetic Visakhapatnam dataset for prototype demonstration</span>
      </div>
    </div>
  `;

  // Initialize Lucide
  if (window.lucide) window.lucide.createIcons();

  // Handle form submit
  const form = container.querySelector('#login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<span class="text-sm">Authenticating...</span>';
    btn.disabled = true;

    setTimeout(() => {
      onLogin();
    }, 800);
  });
}
