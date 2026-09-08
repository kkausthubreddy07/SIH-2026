/* ============================================
   CITY AI — Traffic Analytics Screen
   Charts, OD matrix, congestion analysis
   ============================================ */

import { trafficFlow, congestionZones, odMatrix, vehicleTypes, kpiData } from '../data/mock-data.js';
import { createKpiCard, animateKpi } from '../components/kpi-card.js';
import { animateProgressBars } from '../utils/animations.js';

let charts = [];

export function renderAnalytics(container) {
  container.innerHTML = `
    <div class="screen-header">
      <div class="screen-header__left">
        <h1 class="screen-header__title">Traffic Analytics — Visakhapatnam</h1>
        <div class="screen-header__subtitle">City-wide traffic density, classification & origin-destination intelligence (IST)</div>
      </div>
      <div class="screen-header__actions">
        <select class="select-input" id="analytics-timeframe">
          <option>Today (01 Sep 2026)</option>
          <option>Last 24 Hours</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <select class="select-input" id="analytics-corridor">
          <option value="all">All Corridors (Visakhapatnam)</option>
          <option value="nh16">NH-16 North Corridor</option>
          <option value="central">Central / Commercial Corridor</option>
          <option value="industrial">Industrial Corridor (Gajuwaka / Steel Plant)</option>
          <option value="beach">Coastline / Beach Road Corridor</option>
        </select>
        <button class="btn btn--secondary btn--sm" id="btn-export-analytics">
          <i data-lucide="download"></i> Export Analytics
        </button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-grid stagger-children">
      ${createKpiCard({ id: 'kpi-speed', label: 'City Avg Speed', value: kpiData.avgSpeed, suffix: ' km/h', icon: 'gauge', color: 'blue', change: 'across 12 camera nodes', changeDir: 'neutral' })}
      ${createKpiCard({ id: 'kpi-total-vehicles', label: 'Vehicles Today (Simulated)', value: 124823, icon: 'car', color: 'green', change: '+8.2% vs last Tuesday', changeDir: 'up' })}
      ${createKpiCard({ id: 'kpi-congested', label: 'Congested Corridors', value: 4, icon: 'traffic-cone', color: 'yellow', change: 'of 10 monitored sectors', changeDir: 'down' })}
      ${createKpiCard({ id: 'kpi-peak-hour', label: 'Peak Rush Interval', value: 10, suffix: ':00 AM IST', icon: 'clock', color: 'cyan', change: 'Office / College Commute', changeDir: 'neutral' })}
    </div>

    <!-- Charts Row 1 -->
    <div class="content-grid content-grid--2" style="margin-bottom: 16px;">
      <!-- Vehicle Flow Chart -->
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">Vehicle Flow (Hourly)</div>
          <div style="display: flex; gap: 12px;">
            ${trafficFlow.datasets.map(d => `
              <span style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-secondary);">
                <span style="width: 8px; height: 8px; border-radius: 2px; background: ${d.color};"></span>
                ${d.label}
              </span>
            `).join('')}
          </div>
        </div>
        <div class="chart-card__canvas">
          <canvas id="chart-vehicle-flow"></canvas>
        </div>
      </div>

      <!-- Vehicle Type Distribution -->
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">Vehicle Type Distribution</div>
        </div>
        <div style="display: flex; align-items: center; gap: 24px;">
          <div style="width: 200px; height: 200px;">
            <canvas id="chart-vehicle-types"></canvas>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            ${vehicleTypes.map(v => `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="width: 10px; height: 10px; border-radius: 2px; background: ${v.color};"></span>
                  <span class="text-sm">${v.type}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="text-sm text-secondary">${v.count.toLocaleString()}</span>
                  <span class="text-sm" style="font-weight: 600; width: 40px; text-align: right;">${v.percentage}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="content-grid content-grid--2" style="margin-bottom: 16px;">
      <!-- Congestion by Zone -->
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">Congestion by Zone</div>
        </div>
        <div id="congestion-bars" style="display: flex; flex-direction: column; gap: 4px;">
          ${congestionZones.map(z => `
            <div class="congestion-bar">
              <div class="congestion-bar__label">${z.zone}</div>
              <div class="congestion-bar__track">
                <div class="congestion-bar__fill" data-width="${z.value}" style="background: ${z.color}; width: 0%;">${z.value > 30 ? z.value + '%' : ''}</div>
              </div>
              <div class="congestion-bar__value" style="color: ${z.color};">${z.value}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Speed Distribution Chart -->
      <div class="chart-card">
        <div class="chart-card__header">
          <div class="chart-card__title">Speed Distribution by Zone</div>
        </div>
        <div class="chart-card__canvas">
          <canvas id="chart-speed-dist"></canvas>
        </div>
      </div>
    </div>

    <!-- OD Matrix -->
    <div class="chart-card">
      <div class="chart-card__header">
        <div class="chart-card__title">Origin → Destination Matrix</div>
        <span class="text-caption text-secondary">Vehicle count between camera zones</span>
      </div>
      <div style="overflow-x: auto;">
        <table class="od-matrix">
          <thead>
            <tr>
              <th style="background: var(--bg-base);">FROM ↓ / TO →</th>
              ${odMatrix.zones.map(z => `<th>${z}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${odMatrix.zones.map((zone, i) => `
              <tr>
                <th>${zone}</th>
                ${odMatrix.data[i].map((val, j) => {
                  if (i === j) return '<td class="self">—</td>';
                  const maxVal = 421;
                  const alpha = (val / maxVal * 0.6 + 0.05).toFixed(2);
                  let color;
                  if (val > 300) color = `rgba(239,68,68,${alpha})`;
                  else if (val > 200) color = `rgba(245,158,11,${alpha})`;
                  else if (val > 100) color = `rgba(59,130,246,${alpha})`;
                  else color = `rgba(59,130,246,${(alpha * 0.5).toFixed(2)})`;
                  return `<td style="background: ${color}; font-weight: ${val > 200 ? '600' : '400'};">${val}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Animate KPIs
  setTimeout(() => {
    animateKpi('kpi-speed', kpiData.avgSpeed, { decimals: 1, suffix: ' km/h' });
    animateKpi('kpi-total-vehicles', 124823);
    animateKpi('kpi-congested', 4);
  }, 200);

  // Animate congestion bars
  setTimeout(() => {
    animateProgressBars(container);
  }, 400);

  // Export Analytics handler
  const exportBtn = container.querySelector('#btn-export-analytics');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const report = {
        city: 'Visakhapatnam',
        timestamp: new Date().toISOString(),
        kpis: {
          avgSpeed: kpiData.avgSpeed,
          totalVehicles: 124823,
          congestedCorridors: 4,
          peakRushHour: '10:00 AM IST'
        },
        vehicleTypes,
        congestionZones,
        trafficFlowLabels: trafficFlow.labels,
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
      const dl = document.createElement('a');
      dl.setAttribute("href", dataStr);
      dl.setAttribute("download", `visakhapatnam_traffic_analytics_${Date.now()}.json`);
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
    });
  }

  // Initialize Charts
  setTimeout(() => {
    initCharts();
  }, 300);

  return () => {
    charts.forEach(c => c.destroy());
    charts = [];
  };
}

function initCharts() {
  if (typeof Chart === 'undefined') return;

  // Vehicle Flow line chart
  try {
    const ctx1 = document.getElementById('chart-vehicle-flow');
    if (ctx1) {
      charts.push(new Chart(ctx1, {
        type: 'line',
        data: {
          labels: trafficFlow.labels,
          datasets: trafficFlow.datasets.map(d => ({
            label: d.label,
            data: d.data,
            borderColor: d.color,
            backgroundColor: d.color + '15',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: d.color,
            pointBorderColor: '#0B0F14',
            pointBorderWidth: 2,
          })),
        },
        options: chartOptions('Vehicle Count'),
      }));
    }
  } catch (e) { console.warn(e); }

  // Vehicle types doughnut
  try {
    const ctx2 = document.getElementById('chart-vehicle-types');
    if (ctx2) {
      charts.push(new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: vehicleTypes.map(v => v.type),
          datasets: [{
            data: vehicleTypes.map(v => v.count),
            backgroundColor: vehicleTypes.map(v => v.color),
            borderColor: '#111820',
            borderWidth: 3,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '65%',
          plugins: {
            legend: { display: false },
          },
        },
      }));
    }
  } catch (e) { console.warn(e); }

  // Speed distribution bar chart
  try {
    const ctx3 = document.getElementById('chart-speed-dist');
    if (ctx3) {
      const zones = ['Railway Stn', 'Airport', 'RK Beach', 'Jagadamba', 'NAD Jn', 'Gajuwaka', 'Maddilapalem', 'Seethammadhara'];
      const speeds = [18.2, 42.5, 22.1, 12.4, 38.7, 45.2, 32.8, 24.6];

      charts.push(new Chart(ctx3, {
        type: 'bar',
        data: {
          labels: zones,
          datasets: [{
            label: 'Avg Speed (km/h)',
            data: speeds,
            backgroundColor: speeds.map(s => s < 20 ? '#EF444480' : s < 30 ? '#F59E0B80' : '#22C55E80'),
            borderColor: speeds.map(s => s < 20 ? '#EF4444' : s < 30 ? '#F59E0B' : '#22C55E'),
            borderWidth: 1,
            borderRadius: 4,
          }],
        },
        options: chartOptions('Speed (km/h)'),
      }));
    }
  } catch (e) { console.warn(e); }
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111820',
        borderColor: '#25303A',
        borderWidth: 1,
        titleFont: { family: "'Inter'" },
        bodyFont: { family: "'Inter'" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: '#25303A20', drawBorder: false },
        ticks: { color: '#64748B', font: { family: "'Inter'", size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: '#25303A40', drawBorder: false },
        ticks: { color: '#64748B', font: { family: "'Inter'", size: 11 } },
        border: { display: false },
        title: {
          display: true,
          text: yLabel,
          color: '#64748B',
          font: { family: "'Inter'", size: 11 },
        },
      },
    },
  };
}
