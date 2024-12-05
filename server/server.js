// server.js

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/v1/userRoutes');
const quizRoutes = require('./routes/v1/quizRoutes');
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

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// API routes
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/users', userRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
