// Shared formatting + status helpers for the dashboard UI.

export const STATUS_COLORS = {
  Stable: '#2ea043',
  Watch: '#d29922',
  Alert: '#f85149',
};

export function statusColor(status) {
  return STATUS_COLORS[status] || '#3b82f6';
}

export function formatMovement(mm) {
  return `${Number(mm).toFixed(1)} mm`;
}

// Render an ISO timestamp as a coarse "x min/hr ago" relative string.
export function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr} hr ago`;
}
