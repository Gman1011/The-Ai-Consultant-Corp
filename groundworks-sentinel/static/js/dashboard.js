/* Groundworks Sentinel — dashboard front end.
 * Pulls fleet stats and property readings from the Flask API and renders the
 * summary cards, the property table, and a per-property detail drawer with a
 * 30-day movement trend chart.
 */

const state = {
  properties: [],
  filter: "all",
  chart: null,
};

const fmtMovement = (mm) => `${mm.toFixed(1)}<span class="movement-unit"> mm</span>`;

function fmtTimestamp(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr} hr ago`;
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

/* ---- Rendering ----------------------------------------------------- */

function renderStats(stats) {
  const cards = [
    { label: "Properties", value: stats.total, sub: "under monitoring", cls: "" },
    { label: "Stable", value: stats.stable, sub: "within tolerance", cls: "stable" },
    { label: "On watch", value: stats.watch, sub: "trending movement", cls: "watch" },
    { label: "Alerts", value: stats.alert, sub: "crew dispatch", cls: "alert" },
    {
      label: "Peak movement",
      value: `${stats.max_movement.toFixed(1)} mm`,
      sub: `${stats.avg_movement.toFixed(1)} mm avg`,
      cls: "",
    },
  ];
  document.getElementById("stats").innerHTML = cards
    .map(
      (c) => `
      <div class="stat-card ${c.cls}">
        <div class="stat-label">${c.label}</div>
        <div class="stat-value">${c.value}</div>
        <div class="stat-sub">${c.sub}</div>
      </div>`
    )
    .join("");

  const updated = new Date(stats.updated);
  document.getElementById("updated").textContent = Number.isNaN(updated.getTime())
    ? ""
    : `Updated ${updated.toLocaleTimeString()}`;
}

function renderRows() {
  const tbody = document.getElementById("prop-rows");
  const rows = state.properties.filter(
    (p) => state.filter === "all" || p.status === state.filter
  );

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No properties match this filter.</td></tr>`;
    return;
  }

  // Surface the most active sites first.
  rows.sort((a, b) => b.movement - a.movement);

  tbody.innerHTML = rows
    .map(
      (p) => `
      <tr data-id="${p.id}">
        <td><div class="prop-name">${p.name}</div><div class="prop-sub">${p.sensor_id}</div></td>
        <td>${p.city}</td>
        <td>${p.foundation}</td>
        <td class="num"><span class="movement-val">${fmtMovement(p.movement)}</span></td>
        <td><span class="badge ${p.status}">${p.status}</span></td>
        <td>${fmtTimestamp(p.last_reading)}</td>
      </tr>`
    )
    .join("");

  tbody.querySelectorAll("tr[data-id]").forEach((tr) => {
    tr.addEventListener("click", () => openDrawer(Number(tr.dataset.id)));
  });
}

/* ---- Detail drawer ------------------------------------------------- */

async function openDrawer(id) {
  const overlay = document.getElementById("overlay");
  const drawer = document.getElementById("drawer");
  const body = document.getElementById("drawer-body");

  overlay.hidden = false;
  drawer.hidden = false;
  body.innerHTML = `<p class="empty">Loading…</p>`;

  let detail;
  try {
    detail = await fetchJSON(`/api/properties/${id}`);
  } catch (err) {
    body.innerHTML = `<p class="empty">Could not load property.</p>`;
    return;
  }

  body.innerHTML = `
    <h3>${detail.name}</h3>
    <div class="drawer-city">${detail.city}</div>
    <span class="badge ${detail.status}">${detail.status}</span>
    <div class="meta-grid">
      <div class="meta-item"><div class="k">Movement</div><div class="v">${detail.movement.toFixed(1)} mm</div></div>
      <div class="meta-item"><div class="k">Foundation</div><div class="v">${detail.foundation}</div></div>
      <div class="meta-item"><div class="k">Sensor</div><div class="v">${detail.sensor_id}</div></div>
      <div class="meta-item"><div class="k">Installed</div><div class="v">${detail.installed}</div></div>
    </div>
    <div class="chart-box">
      <h4>30-day movement trend (mm)</h4>
      <canvas id="trend-chart" height="170"></canvas>
    </div>`;

  renderChart(detail.history, detail.status);
}

function statusColor(status) {
  return { Stable: "#2ea043", Watch: "#d29922", Alert: "#f85149" }[status] || "#3b82f6";
}

function renderChart(history, status) {
  const ctx = document.getElementById("trend-chart");
  if (state.chart) state.chart.destroy();

  const color = statusColor(status);
  const gradient = ctx.getContext("2d").createLinearGradient(0, 0, 0, 170);
  gradient.addColorStop(0, color + "55");
  gradient.addColorStop(1, color + "00");

  state.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: history.map((h) => h.date.slice(5)),
      datasets: [
        {
          data: history.map((h) => h.movement),
          borderColor: color,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#8b97a7", maxTicksLimit: 6 }, grid: { display: false } },
        y: { ticks: { color: "#8b97a7" }, grid: { color: "#283040" }, beginAtZero: true },
      },
    },
  });
}

function closeDrawer() {
  document.getElementById("overlay").hidden = true;
  document.getElementById("drawer").hidden = true;
  if (state.chart) {
    state.chart.destroy();
    state.chart = null;
  }
}

/* ---- Data load ----------------------------------------------------- */

async function load() {
  try {
    const [stats, props] = await Promise.all([
      fetchJSON("/api/stats"),
      fetchJSON("/api/properties"),
    ]);
    state.properties = props;
    renderStats(stats);
    renderRows();
  } catch (err) {
    document.getElementById("prop-rows").innerHTML =
      `<tr><td colspan="6" class="empty">Failed to load data. Is the API running?</td></tr>`;
  }
}

/* ---- Wire up ------------------------------------------------------- */

document.getElementById("refresh").addEventListener("click", load);
document.getElementById("drawer-close").addEventListener("click", closeDrawer);
document.getElementById("overlay").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  state.filter = btn.dataset.filter;
  renderRows();
});

load();
