import React from 'react';
import { statusColor } from '../utils/format';

/**
 * Lightweight, dependency-free SVG area chart for a property's movement
 * history. Avoids pulling a charting library into the bundle.
 */
function TrendChart({ history, status }) {
  const width = 380;
  const height = 160;
  const pad = { top: 12, right: 8, bottom: 22, left: 28 };

  if (!history || history.length === 0) {
    return <div className="chart-empty">No history</div>;
  }

  const values = history.map((h) => h.movement);
  const maxVal = Math.max(...values, 1);
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const color = statusColor(status);

  const x = (i) => pad.left + (i / (history.length - 1)) * innerW;
  const y = (v) => pad.top + innerH - (v / maxVal) * innerH;

  const linePath = history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(h.movement).toFixed(1)}`)
    .join(' ');
  const areaPath =
    `${linePath} L ${x(history.length - 1).toFixed(1)} ${pad.top + innerH} ` +
    `L ${x(0).toFixed(1)} ${pad.top + innerH} Z`;

  // A few evenly spaced x labels (start, middle, end) keep the axis readable.
  const tickIdx = [0, Math.floor((history.length - 1) / 2), history.length - 1];

  return (
    <svg
      className="trend-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="30-day movement trend"
    >
      <defs>
        <linearGradient id={`grad-${status}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal gridlines + y labels */}
      {[0, 0.5, 1].map((f) => {
        const gy = pad.top + innerH - f * innerH;
        return (
          <g key={f}>
            <line
              x1={pad.left}
              y1={gy}
              x2={width - pad.right}
              y2={gy}
              stroke="#283040"
              strokeWidth="1"
            />
            <text x={4} y={gy + 4} className="axis-text">
              {(maxVal * f).toFixed(1)}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill={`url(#grad-${status})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" />

      {tickIdx.map((i) => (
        <text key={i} x={x(i)} y={height - 6} textAnchor="middle" className="axis-text">
          {history[i].date.slice(5)}
        </text>
      ))}
    </svg>
  );
}

export default TrendChart;
