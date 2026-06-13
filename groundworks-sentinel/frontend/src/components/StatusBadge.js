import React from 'react';

// Color-coded pill for a property's status tier. Alert pulses to draw the eye.
function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export default StatusBadge;
