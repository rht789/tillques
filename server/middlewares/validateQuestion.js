// middlewares/validateQuestion.js

const Joi = require('joi');

const validateQuestion = (req, res, next) => {
  const { 
    questionText, 
    questionType, 
    difficulty,
    timeLimit,
    correctAnswer,
    options 
  } = req.body;

  console.log('Validating question data:', req.body); // Debug log

  // Basic validation
  if (!questionText || !questionType || !difficulty) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: questionText, questionType, or difficulty'
    });
  }

  // Type-specific validation
  switch (questionType) {
    case 'TRUE_FALSE':
      if (typeof correctAnswer !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'True/False questions require a boolean correctAnswer'
        });
      }
      break;

    case 'MCQ':
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'MCQ questions require at least 2 options'
        });
      }
      if (!options.some(opt => opt.isCorrect)) {
        return res.status(400).json({
          success: false,
          message: 'MCQ questions must have at least one correct option'
        });
      }
      break;

    case 'SHORT_ANSWER':
    case 'FILL_IN_THE_BLANKS':
      if (!correctAnswer || typeof correctAnswer !== 'string') {
        return res.status(400).json({
          success: false,
          message: `${questionType} questions require a correct answer`
        });
      }
      break;

    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid question type'
      });
  }

  next();
};

module.exports = validateQuestion;
