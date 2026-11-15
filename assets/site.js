// Valeur & Désir — front-end behaviour: seals, gallery cases, and live market data.

// 1. Break the seal / unveil the story
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-toggle]');
  if (!btn) return;
  const scope = btn.closest('[data-toggle-scope]');
  if (scope) scope.classList.toggle('is-open');
});

// 2. Live market data, refreshed daily by a GitHub Action into data/prices.json
const fmtPrice = (v, cur) => {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(v);
  } catch { return v.toFixed(2) + ' ' + cur; }
};
const fmtPct = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + '%';
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function drawChart(el, series) {
  const W = 600, H = 280, P = 8;
  const closes = series.map((p) => p[1]);
  const min = Math.min(...closes), max = Math.max(...closes);
  const x = (i) => P + (i / (series.length - 1)) * (W - 2 * P);
  const y = (v) => H - P - ((v - min) / (max - min || 1)) * (H - 2 * P);
  const d = series.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p[1]).toFixed(1)).join(' ');
  const last = series[series.length - 1];
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  for (let k = 1; k < 4; k++) {
    const g = document.createElementNS(ns, 'line');
    g.setAttribute('x1', 0); g.setAttribute('x2', W);
    g.setAttribute('y1', (H / 4) * k); g.setAttribute('y2', (H / 4) * k);
    g.setAttribute('stroke', '#E3D9C4'); g.setAttribute('stroke-width', '1');
    svg.appendChild(g);
  }
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#1E3B2F');
  path.setAttribute('stroke-width', '2.5');
  path.setAttribute('vector-effect', 'non-scaling-stroke');
  path.setAttribute('class', 'di-line');
  svg.appendChild(path);
  const dot = document.createElementNS(ns, 'circle');
  dot.setAttribute('cx', x(series.length - 1)); dot.setAttribute('cy', y(last[1]));
  dot.setAttribute('r', '5'); dot.setAttribute('fill', '#C9A961');
  svg.appendChild(dot);
  el.appendChild(svg);
  const note = el.querySelector('[data-chart-note]');
  if (note) note.remove();
}

fetch('data/prices.json', { cache: 'no-store' })
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data || !data.tickers) return;
    const get = (sym) => data.tickers[sym];

    document.querySelectorAll('[data-price]').forEach((el) => {
      const t = get(el.dataset.price);
      if (t && t.series.length) el.textContent = fmtPrice(t.series[t.series.length - 1][1], t.currency);
    });
    document.querySelectorAll('[data-change]').forEach((el) => {
      const t = get(el.dataset.change);
      if (t && t.series.length > 1) {
        const first = t.series[0][1], last = t.series[t.series.length - 1][1];
        el.textContent = fmtPct(((last - first) / first) * 100);
      }
    });
    document.querySelectorAll('[data-chart]').forEach((el) => {
      const t = get(el.dataset.chart);
      if (t && t.series.length > 1) drawChart(el, t.series);
    });
    if (data.updated) {
      document.querySelectorAll('[data-updated]').forEach((el) => {
        el.textContent = 'Closing prices · last updated ' + fmtDate(data.updated) + ' · source: EODHD';
      });
    }
  })
  .catch(() => {});
