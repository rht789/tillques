// server.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/v1/userRoutes');
const quizRoutes = require('./routes/v1/quizRoutes');
const questionRoutes = require('./routes/v1/questionRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - back to original
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// Add this before your routes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// API routes
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/questions', questionRoutes);

// Error handling middleware (add this after your routes)
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
