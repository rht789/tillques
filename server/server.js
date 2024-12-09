// server.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/v1/userRoutes');
const quizRoutes = require('./routes/v1/quizRoutes');
const questionRoutes = require('./routes/v1/questionRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
require('dotenv').config();
const requestLogger = require('./middlewares/requestLogger');
const waitingRoomHandler = require('./socket/waitingRoomHandler');
const socketAuthMiddleware = require('./middlewares/socketAuthMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Apply socket authentication middleware
io.use(socketAuthMiddleware);

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
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
app.use('/api/v1/sessions', sessionRoutes);
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

// Initialize socket handlers
waitingRoomHandler(io);

app.set('io', io);  // Make io available to routes

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
