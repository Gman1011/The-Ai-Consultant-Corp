import React from 'react';

// A single summary metric in the dashboard header strip.
function StatCard({ label, value, sub, tier }) {
  return (
    <div className={`stat-card${tier ? ` ${tier}` : ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export default StatCard;
