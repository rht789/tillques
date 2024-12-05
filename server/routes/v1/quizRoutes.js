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
router.put('/:id/mode', authenticateToken, quizController.updateQuizMode);

// Update quiz step route
router.put('/:id/step', authenticateToken, quizController.updateQuizStep);

// Create question route
router.post('/:id/questions', authenticateToken, quizController.createQuestion);

module.exports = router;
