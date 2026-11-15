// Fetches one year of daily closing prices for the five houses from EODHD
// and writes them to data/prices.json. Run daily by .github/workflows/update-prices.yml.
// Needs the EODHD_API_KEY environment variable (stored as a GitHub secret, never in the code).
import fs from 'node:fs';

const KEY = process.env.EODHD_API_KEY;
if (!KEY) {
  console.error('Missing EODHD_API_KEY');
  process.exit(1);
}

const HOUSES = [
  { symbol: 'MC.PA', name: 'LVMH', currency: 'EUR' },
  { symbol: 'RMS.PA', name: 'Hermès', currency: 'EUR' },
  { symbol: 'KER.PA', name: 'Kering', currency: 'EUR' },
  { symbol: 'CFR.SW', name: 'Richemont', currency: 'CHF' },
  { symbol: '1913.HK', name: 'Prada Group', currency: 'HKD' },
];

const from = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().slice(0, 10);
const out = { updated: new Date().toISOString().slice(0, 10), source: 'EODHD end-of-day prices', tickers: {} };

// Keep the previous file so one failed request never wipes out good data.
let previous = {};
try { previous = JSON.parse(fs.readFileSync('data/prices.json', 'utf8')).tickers || {}; } catch {}

for (const h of HOUSES) {
  const url = `https://eodhd.com/api/eod/${encodeURIComponent(h.symbol)}?api_token=${KEY}&fmt=json&from=${from}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    const series = rows
      .filter((r) => r.close != null)
      .map((r) => [r.date, Math.round(r.close * 100) / 100]);
    if (!series.length) throw new Error('no rows');
    out.tickers[h.symbol] = { name: h.name, currency: h.currency, series };
    console.log(`${h.symbol}: ${series.length} days, last ${series.at(-1).join(' ')}`);
  } catch (err) {
    console.error(`${h.symbol} failed: ${err.message}`);
    if (previous[h.symbol]) out.tickers[h.symbol] = previous[h.symbol];
  }
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/prices.json', JSON.stringify(out));
