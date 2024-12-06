// server.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/v1/userRoutes');
const quizRoutes = require('./routes/v1/quizRoutes');
const questionRoutes = require('./routes/v1/questionRoutes');
require('dotenv').config();
const requestLogger = require('./middlewares/requestLogger');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Add after your basic middleware but before routes
app.use(requestLogger);

// API routes
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/users', userRoutes);
// app.use('/api/v1', questionRoutes);

// Error handling middleware
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
