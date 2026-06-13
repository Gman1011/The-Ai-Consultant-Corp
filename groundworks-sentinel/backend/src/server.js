require('dotenv').config();
const express = require('express');
const cors = require('cors');
const GARVIS = require('./utils/garvis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Sentinel API running on port ${PORT}`);
});

module.exports = app;
