/**
 * Status model for structural movement readings.
 *
 * Movement is cumulative, measured in millimetres. Each reading is classified
 * into a tier so crews can triage which sites need attention:
 *   Stable : movement < 2.0 mm        -> within normal seasonal variation
 *   Watch  : 2.0 mm <= movement < 5.0 -> trending, schedule an inspection
 *   Alert  : movement >= 5.0 mm       -> active movement, dispatch a crew
 */

const STABLE_THRESHOLD = 2.0;
const WATCH_THRESHOLD = 5.0;

function classify(movement) {
  if (movement < STABLE_THRESHOLD) return 'Stable';
  if (movement < WATCH_THRESHOLD) return 'Watch';
  return 'Alert';
}

module.exports = { classify, STABLE_THRESHOLD, WATCH_THRESHOLD };
