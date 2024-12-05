// routes/v1/questionRoutes.js

const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/questionController');
const { authenticateToken } = require('../../middlewares/authMiddleware');
const validateQuestion = require('../../middlewares/validateQuestion');

// Question routes
router.post('/:quizID/questions', 
  authenticateToken,
  validateQuestion,
  (req, res, next) => {
    console.log('Request body after validation:', req.body);
    next();
  },
  questionController.createQuestion
);

router.get('/:quizID/questions',
  authenticateToken,
  questionController.getQuizQuestions
);

module.exports = router;
