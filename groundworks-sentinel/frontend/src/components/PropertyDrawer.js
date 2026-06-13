import React, { useEffect, useState } from 'react';
import { propertyAPI } from '../services/api';
import StatusBadge from './StatusBadge';
import TrendChart from './TrendChart';
import { formatMovement } from '../utils/format';

// Slide-in detail panel: property metadata + 30-day movement trend.
// Fetches the per-property detail (with history) when opened.
function PropertyDrawer({ propertyId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (propertyId == null) return undefined;
    let active = true;
    setLoading(true);
    setError(false);
    setDetail(null);

    propertyAPI
      .getById(propertyId)
      .then((res) => {
        if (active) setDetail(res.data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [propertyId]);

  // Close on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (propertyId == null) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" aria-label="Property detail">
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {loading && <p className="empty">Loading…</p>}
        {error && <p className="empty">Could not load property.</p>}

        {detail && (
          <div>
            <h3>{detail.name}</h3>
            <div className="drawer-city">{detail.city}</div>
            <StatusBadge status={detail.status} />

            <div className="meta-grid">
              <div className="meta-item">
                <div className="k">Movement</div>
                <div className="v">{formatMovement(detail.movement)}</div>
              </div>
              <div className="meta-item">
                <div className="k">Foundation</div>
                <div className="v">{detail.foundation}</div>
              </div>
              <div className="meta-item">
                <div className="k">Sensor</div>
                <div className="v">{detail.sensorId}</div>
              </div>
              <div className="meta-item">
                <div className="k">Installed</div>
                <div className="v">{detail.installed}</div>
              </div>
            </div>

            <div className="chart-box">
              <h4>30-day movement trend (mm)</h4>
              <TrendChart history={detail.history} status={detail.status} />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default PropertyDrawer;
