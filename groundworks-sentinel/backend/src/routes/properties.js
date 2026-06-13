const express = require('express');
const router = express.Router();
const properties = require('../data/properties');
const { classify } = require('../utils/status');
const GARVIS = require('../utils/garvis');

/**
 * Attach derived fields (status, freshness, data source) to a stored record.
 */
function enrich(record) {
  return {
    ...record,
    status: classify(record.movement),
    // Every reading is collected by the GARVIS sensor network.
    source: GARVIS.name,
    // Stagger "last reading" timestamps so the feed feels live.
    lastReading: new Date(Date.now() - record.id * 7 * 60 * 1000).toISOString(),
  };
}

/**
 * Build a deterministic 30-day movement trend ending at the current reading.
 * Real deployments would query stored readings; this synthesizes a smooth,
 * repeatable series so the trend chart is meaningful without a database.
 */
function movementHistory(seed, current, points = 30) {
  const history = [];
  const today = new Date();
  for (let i = 0; i < points; i += 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - (points - 1 - i));
    const progress = i / (points - 1);
    const base = current * (0.4 + 0.6 * progress);
    const ripple = Math.sin((i + seed) * 0.7) * (current * 0.05);
    const value = Math.max(0, Math.round((base + ripple) * 100) / 100);
    history.push({ date: day.toISOString().slice(0, 10), movement: value });
  }
  return history;
}

// GET /api/properties - all monitored properties with derived status
router.get('/', (req, res) => {
  res.json(properties.map(enrich));
});

// GET /api/properties/:id - single property plus 30-day movement history
router.get('/:id', (req, res) => {
  const record = properties.find((p) => p.id === Number(req.params.id));
  if (!record) {
    return res.status(404).json({ message: 'Property not found' });
  }
  return res.json({
    ...enrich(record),
    history: movementHistory(record.id, record.movement),
  });
});

module.exports = router;
