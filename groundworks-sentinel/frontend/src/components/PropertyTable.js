import React from 'react';
import StatusBadge from './StatusBadge';
import { formatMovement, timeAgo } from '../utils/format';

// Sortable (by movement, desc) property list with a status filter applied
// upstream. Clicking a row opens the detail drawer.
function PropertyTable({ properties, onSelect }) {
  if (properties.length === 0) {
    return <div className="empty">No properties match this filter.</div>;
  }

  const rows = [...properties].sort((a, b) => b.movement - a.movement);

  return (
    <div className="table-wrap">
      <table className="prop-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Location</th>
            <th>Foundation</th>
            <th className="num">Movement</th>
            <th>Status</th>
            <th>Last reading</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} onClick={() => onSelect(p.id)}>
              <td>
                <div className="prop-name">{p.name}</div>
                <div className="prop-sub">{p.sensorId}</div>
              </td>
              <td>{p.city}</td>
              <td>{p.foundation}</td>
              <td className="num">
                <span className="movement-val">{formatMovement(p.movement)}</span>
              </td>
              <td>
                <StatusBadge status={p.status} />
              </td>
              <td>{timeAgo(p.lastReading)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropertyTable;
