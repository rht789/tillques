const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const quizRoutes = require('./quizRoutes');

// Mount routes
router.use('/users', userRoutes);
router.use('/quizzes', quizRoutes);

module.exports = router; 