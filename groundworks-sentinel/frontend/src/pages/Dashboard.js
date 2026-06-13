import React, { useCallback, useEffect, useState } from 'react';
import { propertyAPI, statsAPI } from '../services/api';
import StatCard from '../components/StatCard';
import PropertyTable from '../components/PropertyTable';
import PropertyDrawer from '../components/PropertyDrawer';

const FILTERS = ['all', 'Alert', 'Watch', 'Stable'];

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all([statsAPI.get(), propertyAPI.getAll()])
      .then(([statsRes, propsRes]) => {
        setStats(statsRes.data);
        setProperties(propsRes.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible =
    filter === 'all'
      ? properties
      : properties.filter((p) => p.status === filter);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ◬
          </span>
          <div>
            <h1>
              Groundworks <span>Sentinel</span>
            </h1>
            <p className="tagline">Structural movement monitoring</p>
          </div>
        </div>
        <div className="topbar-meta">
          {stats && stats.feed && (
            <span className="feed-tag" title={stats.feed.expansion}>
              {stats.feed.name} feed · {stats.feed.feedStatus}
            </span>
          )}
          {stats && (
            <span className="updated">
              Updated {new Date(stats.updated).toLocaleTimeString()}
            </span>
          )}
          <button className="refresh-btn" onClick={load}>
            Refresh
          </button>
        </div>
      </header>

      <main className="layout">
        {error && (
          <div className="banner-error">
            Failed to load data. Is the Sentinel API running?
          </div>
        )}

        <section className="stats" aria-label="Fleet summary">
          {stats ? (
            <>
              <StatCard label="Properties" value={stats.total} sub="under monitoring" />
              <StatCard label="Stable" value={stats.stable} sub="within tolerance" tier="stable" />
              <StatCard label="On watch" value={stats.watch} sub="trending movement" tier="watch" />
              <StatCard label="Alerts" value={stats.alert} sub="crew dispatch" tier="alert" />
              <StatCard
                label="Peak movement"
                value={`${stats.maxMovement.toFixed(1)} mm`}
                sub={`${stats.avgMovement.toFixed(1)} mm avg`}
              />
            </>
          ) : (
            <div className="empty">{loading ? 'Loading…' : ''}</div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Monitored properties</h2>
            <div className="filters" role="group" aria-label="Filter by status">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`chip${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>
          </div>
          <PropertyTable properties={visible} onSelect={setSelectedId} />
        </section>
      </main>

      <footer className="feed-footer">
        Sensor data collected by <strong>{stats?.feed?.name || 'GARVIS'}</strong>
        {' — '}
        {stats?.feed?.expansion ||
          'Ground Analysis & Real-time Vigilance Intelligence System'}
        .
      </footer>

      <PropertyDrawer propertyId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}

export default Dashboard;
