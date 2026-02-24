const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── In-memory price database ───────────────────────────────────────────────
const trainPrices = {};    // key: "PARIS-LYON-2024-01-15", value: [{time, price}]
const techPrices = {};     // key: "rtx4090", value: [{time, price}]

// French train routes with realistic base prices (€)
const ROUTES = {
  'PARIS-LYON': { base: 45, variance: 80, peak: 120 },
  'PARIS-MARSEILLE': { base: 55, variance: 100, peak: 160 },
  'PARIS-BORDEAUX': { base: 40, variance: 70, peak: 130 },
  'PARIS-NANTES': { base: 35, variance: 60, peak: 110 },
  'PARIS-LILLE': { base: 25, variance: 50, peak: 90 },
  'PARIS-STRASBOURG': { base: 50, variance: 85, peak: 140 },
  'PARIS-TOULOUSE': { base: 60, variance: 110, peak: 170 },
  'PARIS-NICE': { base: 70, variance: 130, peak: 200 },
  'LYON-MARSEILLE': { base: 30, variance: 55, peak: 85 },
  'BORDEAUX-TOULOUSE': { base: 20, variance: 35, peak: 60 },
  'MARSEILLE-NICE': { base: 20, variance: 35, peak: 55 },
};

// Tech products with realistic prices (€)
const TECH_PRODUCTS = {
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

// Helper: realistic price generation with trading-like patterns
function generatePrice(base, variance, seed = 0) {
  const now = Date.now();
  const noise = Math.sin(now / 100000 + seed) * 0.3 +
                Math.sin(now / 50000 + seed * 2) * 0.2 +
                Math.sin(now / 20000 + seed * 3) * 0.15 +
                (Math.random() - 0.5) * 0.35;
  
  const price = base + noise * variance;
  return Math.max(base * 0.4, Math.round(price * 100) / 100);
}

// Initialize history with 50 past data points (simulating 50 minutes of data)
function initHistory(key, generator) {
  const history = [];
  const now = Date.now();
  for (let i = 49; i >= 0; i--) {
    history.push({
      time: new Date(now - i * 60000).toISOString(),
      price: generator(i)
    });
  }
  return history;
}

// Initialize all train routes
Object.entries(ROUTES).forEach(([route, config], idx) => {
  trainPrices[route] = initHistory(route, (offset) => 
    generatePrice(config.base, config.variance, idx + offset * 0.1)
  );
});

// Initialize all tech products
Object.entries(TECH_PRODUCTS).forEach(([product, config], idx) => {
  techPrices[product] = initHistory(product, (offset) =>
    generatePrice(config.base, config.variance, idx + offset * 0.1 + 100)
  );
});

// Update prices every minute
cron.schedule('* * * * *', () => {
  const now = new Date().toISOString();
  
  Object.entries(ROUTES).forEach(([route, config], idx) => {
    const newPrice = generatePrice(config.base, config.variance, idx);
    trainPrices[route].push({ time: now, price: newPrice });
    // Keep last 200 data points
    if (trainPrices[route].length > 200) trainPrices[route].shift();
  });

  Object.entries(TECH_PRODUCTS).forEach(([product, config], idx) => {
    const newPrice = generatePrice(config.base, config.variance, idx + 100);
    techPrices[product].push({ time: now, price: newPrice });
    if (techPrices[product].length > 200) techPrices[product].shift();
  });

  console.log(`[${now}] Prices updated`);
});

// ─── API Routes ──────────────────────────────────────────────────────────────

// Get all available routes
app.get('/api/routes', (req, res) => {
  const routes = Object.keys(ROUTES).map(route => {
    const [from, to] = route.split('-');
    return { id: route, from, to };
  });
  res.json(routes);
});

// Get price history for a train route
app.get('/api/train/:route', (req, res) => {
  const route = req.params.route.toUpperCase();
  if (!trainPrices[route]) return res.status(404).json({ error: 'Route not found' });
  
  const history = trainPrices[route];
  const current = history[history.length - 1].price;
  const previous = history[history.length - 2]?.price || current;
  const open = history[0].price;
  const prices = history.map(h => h.price);
  
  res.json({
    route,
    history,
    current,
    change: current - previous,
    changePercent: ((current - previous) / previous * 100).toFixed(2),
    high: Math.max(...prices),
    low: Math.min(...prices),
    open,
  });
});

// Get all tech product prices
app.get('/api/tech', (req, res) => {
  const data = {};
  Object.entries(techPrices).forEach(([product, history]) => {
    const current = history[history.length - 1].price;
    const previous = history[history.length - 2]?.price || current;
    data[product] = {
      current,
      change: current - previous,
      changePercent: ((current - previous) / previous * 100).toFixed(2),
      history: history.slice(-60),
    };
  });
  res.json(data);
});

// Get price history for a specific tech product
app.get('/api/tech/:product', (req, res) => {
  const product = decodeURIComponent(req.params.product);
  if (!techPrices[product]) return res.status(404).json({ error: 'Product not found' });
  
  const history = techPrices[product];
  const current = history[history.length - 1].price;
  const previous = history[history.length - 2]?.price || current;
  const prices = history.map(h => h.price);
  
  res.json({
    product,
    history,
    current,
    change: current - previous,
    changePercent: ((current - previous) / previous * 100).toFixed(2),
    high: Math.max(...prices),
    low: Math.min(...prices),
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TrainTracker running on port ${PORT}`);
});
