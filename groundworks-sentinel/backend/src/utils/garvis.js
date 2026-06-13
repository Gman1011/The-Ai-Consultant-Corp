/**
 * GARVIS — the data-collection system behind Sentinel.
 *
 * All structural movement readings surfaced by the dashboard are ingested by
 * GARVIS, the sensor network that polls each property's ground sensor and feeds
 * the readings into the Sentinel API.
 *
 *   GARVIS = Ground Analysis & Real-time Vigilance Intelligence System
 */

const GARVIS = {
  name: 'GARVIS',
  expansion: 'Ground Analysis & Real-time Vigilance Intelligence System',
  // Coarse health of the collection feed itself (distinct from property status).
  feedStatus: 'online',
};

module.exports = GARVIS;
