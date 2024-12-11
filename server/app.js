const express = require('express');
const cors = require('cors');
const path = require('path');
const profileRoutes = require('./routes/v1/profileRoutes');
const v1Routes = require('./routes/v1');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/v1/users', profileRoutes);
app.use('/api/v1', v1Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

module.exports = app; 