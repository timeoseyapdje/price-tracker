const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

console.log('__dirname:', __dirname);
console.log('public path:', path.join(__dirname, 'public'));

// ─── Data ─────────────────────────────────────────────────
const trainPrices = {};
const techPrices = {};

const ROUTES = {
  'PARIS-LYON': { base: 45, variance: 80 },
  'PARIS-MARSEILLE': { base: 55, variance: 100 },
  'PARIS-BORDEAUX': { base: 40, variance: 70 },
  'PARIS-NANTES': { base: 35, variance: 60 },
  'PARIS-LILLE': { base: 25, variance: 50 },
  'PARIS-STRASBOURG': { base: 50, variance: 85 },
  'PARIS-TOULOUSE': { base: 60, variance: 110 },
  'PARIS-NICE': { base: 70, variance: 130 },
  'LYON-MARSEILLE': { base: 30, variance: 55 },
  'BORDEAUX-TOULOUSE': { base: 20, variance: 35 },
  'MARSEILLE-NICE': { base: 20, variance: 35 },
};

const TECH = {
  'RTX 4090': { base: 1899, variance: 150 },
  'RTX 4080': { base: 1099, variance: 100 },
  'RTX 4070 Ti': { base: 799, variance: 80 },
  'RTX 4070': { base: 599, variance: 60 },
  'RX 7900 XTX': { base: 999, variance: 90 },
  'RX 7900 XT': { base: 799, variance: 75 },
  'DDR5 32GB 6000MHz': { base: 149, variance: 30 },
  'DDR5 16GB 6000MHz': { base: 89, variance: 20 },
  'DDR4 32GB 3200MHz': { base: 69, variance: 15 },
  'DDR4 16GB 3200MHz': { base: 39, variance: 10 },
};

function genPrice(base, variance, seed = 0) {
  const now = Date.now();
  const noise =
    Math.sin(now / 100000 + seed) * 0.3 +
    Math.sin(now / 50000 + seed * 2) * 0.2 +
    Math.sin(now / 20000 + seed * 3) * 0.15 +
    (Math.random() - 0.5) * 0.35;
  return Math.max(base * 0.4, Math.round((base + noise * variance) * 100) / 100);
}

function buildSummary(history) {
  const prices = history.map(h => h.price);
  const current = prices[prices.length - 1];
  const previous = prices[prices.length - 2] ?? current;
  const change = parseFloat((current - previous).toFixed(2));
  return {
    history,
    current,
    change,
    changePercent: parseFloat(((change / previous) * 100).toFixed(2)),
    high: Math.max(...prices),
    low: Math.min(...prices),
    open: prices[0],
  };
}

function initHistory(genFn) {
  const now = Date.now();
  return Array.from({ length: 50 }, (_, i) => ({
    time: new Date(now - (49 - i) * 60000).toISOString(),
    price: genFn(49 - i),
  }));
}

// Init data
Object.entries(ROUTES).forEach(([r, c], idx) => {
  trainPrices[r] = initHistory(offset => genPrice(c.base, c.variance, idx + offset * 0.1));
});
Object.entries(TECH).forEach(([p, c], idx) => {
  techPrices[p] = initHistory(offset => genPrice(c.base, c.variance, idx + offset * 0.1 + 100));
});

// Cron: update every minute
cron.schedule('* * * * *', () => {
  const now = new Date().toISOString();
  Object.entries(ROUTES).forEach(([r, c], idx) => {
    trainPrices[r].push({ time: now, price: genPrice(c.base, c.variance, idx) });
    if (trainPrices[r].length > 200) trainPrices[r].shift();
  });
  Object.entries(TECH).forEach(([p, c], idx) => {
    techPrices[p].push({ time: now, price: genPrice(c.base, c.variance, idx + 100) });
    if (techPrices[p].length > 200) techPrices[p].shift();
  });
});

// ─── Routes ──────────────────────────────────────────────
app.get('/api/routes', (req, res) => {
  res.json(Object.keys(ROUTES).map(r => {
    const [from, ...rest] = r.split('-');
    return { id: r, from, to: rest.join('-') };
  }));
});

// Batch endpoint — returns ALL train prices in one call
app.get('/api/trains-batch', (req, res) => {
  const result = {};
  Object.keys(ROUTES).forEach(r => {
    result[r] = buildSummary(trainPrices[r]);
  });
  res.json(result);
});

app.get('/api/train/:route', (req, res) => {
  const route = req.params.route.toUpperCase();
  if (!trainPrices[route]) return res.status(404).json({ error: 'Route not found' });
  res.json(buildSummary(trainPrices[route]));
});

// Tech batch
app.get('/api/tech', (req, res) => {
  const result = {};
  Object.keys(TECH).forEach(p => {
    result[p] = buildSummary(techPrices[p]);
  });
  res.json(result);
});

app.get('/api/tech/:product', (req, res) => {
  const product = decodeURIComponent(req.params.product);
  if (!techPrices[product]) return res.status(404).json({ error: 'Product not found' });
  res.json(buildSummary(techPrices[product]));
});

// Serve frontend
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send(`File not found: ${indexPath}`);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`PrixTrack running on port ${PORT}`));