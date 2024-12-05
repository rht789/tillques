// server/routes/v1/quizRoutes.js

const express = require('express');
const router = express.Router();
const quizController = require('../../controllers/quizController');
const { authenticateToken } = require('../../middlewares/authMiddleware');

// Protect all quiz routes
router.use(authenticateToken);

// Quiz routes
router.get('/', quizController.getQuizzes);
router.post('/', quizController.createQuiz);
router.get('/:id', quizController.getQuiz);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

// Update quiz mode route
router.put('/:quizID/mode', authenticateToken, quizController.updateQuizMode);

module.exports = router;
