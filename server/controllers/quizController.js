// server/controllers/quizController.js

const { Quiz, Topic } = require('../models');
const { v4: uuidv4 } = require('uuid');
const quizService = require('../services/quizService');

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const userID = req.user.id; // From JWT token
    if (!userID) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const quizzes = await quizService.listQuizzes(userID);
    res.json(quizzes);
  } catch (error) {
    console.error('Error in getQuizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
};

// Get a specific quiz
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        quizID: req.params.id,
        createdBy: req.user.id 
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz'
    });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const {
      quizName,
      description,
      visibility = 'private',
      maxParticipants,
      topicName,
      startAt
    } = req.body;

    // Check if the topic already exists
    let topic = await Topic.findOne({ where: { topicName } });

    // If the topic doesn't exist, create it
    if (!topic) {
      topic = await Topic.create({
        topicID: uuidv4(),
        topicName
      });
    }

    // Create the quiz with default values for questionMode, status, and currentStep
    const quiz = await Quiz.create({
      quizID: uuidv4(),
      quizName,
      description,
      visibility,
      topicID: topic.topicID,
      createdBy: req.user.id,
      maxParticipants,
      startAt,
      // questionMode, status, and currentStep will use default values from the model
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating quiz',
      error: error.message
    });
  }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        quizID: req.params.id,
        createdBy: req.user.id 
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.update(req.body);

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating quiz'
    });
  }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      where: { 
        quizID: req.params.id,
        createdBy: req.user.id 
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.destroy();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quiz'
    });
  }
};

// New function to update question mode
exports.updateQuestionMode = async (req, res) => {
  try {
    const { quizID } = req.params;
    const { mode } = req.body;

    console.log('Updating quiz mode:', { quizID, mode, userId: req.user.id }); // Debug log

    // Validate mode
    if (!['manual', 'ai'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mode. Must be either "manual" or "ai"'
      });
    }

    const quiz = await Quiz.findOne({
      where: { 
        quizID,
        createdBy: req.user.id  // Make sure we're using the correct user ID field
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await quiz.update({ 
      questionMode: mode,
      currentStep: 'mode_selected'
    });

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error updating question mode:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating question mode',
      error: error.message
    });
  }
};

// Add this new method
exports.validateQuizStep = async (req, res) => {
  try {
    const { quizID } = req.params;
    const { step } = req.body;

    console.log('Validating quiz step:', { quizID, step, userId: req.user.id }); // Debug log

    // Validate step value
    const validSteps = ['initial', 'mode_selected', 'questions_added'];
    if (!validSteps.includes(step)) {
      return res.status(400).json({
        success: false,
        message: `Invalid step. Must be one of: ${validSteps.join(', ')}`
      });
    }

    const quiz = await Quiz.findOne({
      where: { 
        quizID,
        createdBy: req.user.id 
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Update the quiz step
    await quiz.update({ currentStep: step });

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Error validating quiz step:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating quiz step',
      error: error.message
    });
  }
};