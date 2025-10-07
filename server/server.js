const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const apiRoutes = require('./routes/api');
const cartRoutes = require('./routes/cart');

// Serve static images folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', apiRoutes);
app.use('/api/cart', cartRoutes);

// ✅ Serve React frontend build (important for Render)
app.use(express.static(path.join(__dirname, '../rev_orbit_auto_frames/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../rev_orbit_auto_frames/build/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});