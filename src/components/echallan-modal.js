/* ============================================
   CITY AI — E-Challan / Violation Notice Generator
   Official-style traffic police violation notice modal
   ============================================ */

/**
 * Open an interactive E-Challan modal
 * @param {Object} data
 * @param {string} data.plate - Vehicle registration number
 * @param {string} data.violation - Violation category (e.g. Over-speeding, Stolen Vehicle, Red Light)
 * @param {string} data.camera - Camera node ID & Landmark
 * @param {string} data.speed - Recorded speed (e.g. 52 km/h)
 * @param {string} data.limit - Speed limit (e.g. 40 km/h)
 * @param {string} data.time - Timestamp with IST
 * @param {number} data.fine - Fine amount in INR (e.g. 1500)
 */
export function showEChallanModal({
  plate = 'AP31AB1234',
  violation = 'Demo Watchlist Flag / Unauthorized Transit',
  camera = 'VSKP-C07 (Airport Road Flyover)',
  speed = '52 km/h',
  limit = '40 km/h',
  time = `${new Date().toLocaleTimeString()} IST`,
  fine = 1500,
}) {
  // Remove existing modal if any
  const existing = document.getElementById('echallan-modal');
  if (existing) existing.remove();

  const challanNo = `VSKP-CH-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const modal = document.createElement('div');
  modal.id = 'echallan-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 100000;
    background: rgba(5, 7, 10, 0.85);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.25s ease;
  `;

  modal.innerHTML = `
    <div style="
      background: #111820;
      border: 1px solid #25303A;
      border-top: 4px solid #EF4444;
      border-radius: 12px;
      max-width: 650px;
      width: 100%;
      box-shadow: 0 24px 60px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.2);
      color: #F1F5F9;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    ">
      <!-- Modal Header -->
      <div style="padding: 18px 24px; border-bottom: 1px solid #25303A; display: flex; align-items: center; justify-content: space-between; background: #0B0F14;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(239,68,68,0.15); border: 1px solid #EF4444; display: flex; align-items: center; justify-content: center; color: #EF4444; font-size: 18px;">
            🚔
          </div>
          <div>
            <div style="font-size: 16px; font-weight: 800; letter-spacing: 0.04em;">VISAKHAPATNAM CITY POLICE</div>
            <div style="font-size: 11px; color: #94A3B8;">TRAFFIC INTELLIGENCE & E-CHALLAN ENFORCEMENT DIVISION</div>
          </div>
        </div>
        <button id="close-echallan-btn" style="background: transparent; border: none; color: #94A3B8; font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 4px;">✕</button>
      </div>

      <!-- Challan Notice Body -->
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 18px; max-height: 75vh; overflow-y: auto;">
        
        <!-- Summary Bar -->
        <div style="background: #17212B; border: 1px dashed #25303A; border-radius: 8px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600;">E-Challan Reference No.</div>
            <div style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; color: #3B82F6;">${challanNo}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600;">Penalty Assessment</div>
            <div style="font-size: 18px; font-weight: 800; color: #EF4444;">₹${fine.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <!-- Evidence & Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <!-- Left: Target Info -->
          <div style="background: #0B0F14; border: 1px solid #25303A; border-radius: 8px; padding: 14px;">
            <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">Vehicle Particulars</div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
              <div><span style="color: #64748B;">Registration:</span> <strong style="font-family: var(--font-mono); color: #3B82F6;">${plate}</strong></div>
              <div><span style="color: #64748B;">Violation:</span> <span style="color: #EF4444; font-weight: 600;">${violation}</span></div>
              <div><span style="color: #64748B;">Recorded Speed:</span> <strong>${speed}</strong> (Limit: ${limit})</div>
              <div><span style="color: #64748B;">Detection Time:</span> <span>${time}</span></div>
              <div><span style="color: #64748B;">Camera Node:</span> <span>${camera}</span></div>
            </div>
          </div>

          <!-- Right: AI Photographic Evidence -->
          <div style="background: #0B0F14; border: 1px solid #25303A; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">ANPR Photo Evidence</div>
            <div style="height: 90px; background: #111820; border-radius: 6px; border: 1px solid #22C55E50; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <video autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;opacity:0.75;" src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"></video>
              <div style="position: absolute; bottom: 4px; left: 6px; font-family: var(--font-mono); font-size: 10px; background: rgba(0,0,0,0.8); color: #22C55E; padding: 2px 6px; border-radius: 3px;">
                PLATE: ${plate} (97%)
              </div>
            </div>
            <div style="font-size: 11px; color: #22C55E; margin-top: 6px;">
              ● Cryptographically Verified ANPR Hash
            </div>
          </div>
        </div>

        <!-- Compliance & Payment Notice -->
        <div style="font-size: 11px; color: #64748B; line-height: 1.5; background: rgba(239,68,68,0.05); padding: 10px 14px; border-radius: 6px; border-left: 3px solid #EF4444;">
          <strong>Official Notice:</strong> This electronic violation record has been logged in the Visakhapatnam Metropolitan Traffic Intelligence system under Motor Vehicles Act provisions. Payment or contestation must be registered within 15 calendar days.
        </div>
      </div>

      <!-- Modal Footer -->
      <div style="padding: 16px 24px; border-top: 1px solid #25303A; background: #0B0F14; display: flex; justify-content: space-between; align-items: center;">
        <button id="dismiss-echallan-btn" class="btn btn--secondary btn--sm">Dismiss</button>
        <div style="display: flex; gap: 8px;">
          <button id="print-echallan-btn" class="btn btn--primary btn--sm" style="background: #22C55E; border-color: #22C55E;">
            🖨️ Print / Download Notice
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const close = () => modal.remove();
  modal.querySelector('#close-echallan-btn').addEventListener('click', close);
  modal.querySelector('#dismiss-echallan-btn').addEventListener('click', close);
  
  modal.querySelector('#print-echallan-btn').addEventListener('click', () => {
    window.print();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
}
