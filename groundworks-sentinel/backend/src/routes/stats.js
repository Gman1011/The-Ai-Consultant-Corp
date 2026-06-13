const express = require('express');
const router = express.Router();
const properties = require('../data/properties');
const { classify } = require('../utils/status');
const GARVIS = require('../utils/garvis');

// GET /api/stats - fleet-wide summary counts used by the dashboard header
router.get('/', (req, res) => {
  const tiers = { Stable: 0, Watch: 0, Alert: 0 };
  const movements = properties.map((p) => {
    tiers[classify(p.movement)] += 1;
    return p.movement;
  });
  const total = properties.length;
  const sum = movements.reduce((a, b) => a + b, 0);

  res.json({
    total,
    stable: tiers.Stable,
    watch: tiers.Watch,
    alert: tiers.Alert,
    avgMovement: total ? Math.round((sum / total) * 100) / 100 : 0,
    maxMovement: total ? Math.max(...movements) : 0,
    updated: new Date().toISOString(),
    // Attribution for the collection feed powering these readings.
    feed: GARVIS,
  });
});

module.exports = router;
