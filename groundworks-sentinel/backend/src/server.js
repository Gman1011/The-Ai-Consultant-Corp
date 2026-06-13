require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const GARVIS = require('./utils/garvis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/properties', require('./routes/properties'));
app.use('/api/stats', require('./routes/stats'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Groundworks Sentinel API is running',
    feed: `${GARVIS.name} (${GARVIS.expansion}) — ${GARVIS.feedStatus}`,
  });
});

// Serve the built React frontend (single-port production deployment).
// When the build exists, the API and UI are served from the same origin so the
// frontend can call the API with relative `/api` URLs.
const BUILD_DIR = path.join(__dirname, '..', '..', 'frontend', 'build');
const hasBuild = fs.existsSync(path.join(BUILD_DIR, 'index.html'));

if (hasBuild) {
  app.use(express.static(BUILD_DIR));
  // SPA fallback: any non-API GET returns the app shell so client routing works.
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(BUILD_DIR, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// 404 handler (unmatched API routes, or any route before the build exists)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Sentinel running on port ${PORT}`);
  console.log(`  API:  http://localhost:${PORT}/api`);
  if (hasBuild) {
    console.log(`  App:  http://localhost:${PORT}/`);
  } else {
    console.log('  (frontend build not found — run "npm run build" to serve the UI)');
  }
});

module.exports = app;
