// controllers/questionController.js

const { Question, Quiz, Subtopic, Option, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');
const questionService = require('../services/questionService');

// Create a new question under a specific quiz
exports.createQuestion = async (req, res) => {
  const { quizID } = req.params;
  const transaction = await sequelize.transaction();

  try {
    const {
      questionText,
      questionType,
      difficulty,
      timeLimit,
      source,
      options
    } = req.body;

    // Create question
    const question = await Question.create({
      questionID: uuidv4(),
      questionText,
      questionType,
      source,
      difficulty,
      timeLimit
    }, { transaction });

    // If MCQ, create options
    if (questionType === 'MCQ' && Array.isArray(options)) {
      await Promise.all(options.map(option =>
        Option.create({
          optionID: uuidv4(),
          questionID: question.questionID,
          optionText: option.optionText,
          isCorrect: option.isCorrect
        }, { transaction })
      ));
    }

    // Associate question with quiz
    await question.addQuiz(quizID, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating question'
    });
  }
};

// Get all questions (optional)
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [
        {
          model: Subtopic,
          as: 'subtopic',
          attributes: ['subtopicID', 'subtopicName'],
        },
        {
          model: Option,
          as: 'options',
          attributes: ['optionID', 'optionText', 'isCorrect'],
        },
        {
          model: Quiz,
          as: 'quizzes',
          attributes: ['quizID', 'quizName'],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Get a specific question by ID (optional)
exports.getQuestionById = async (req, res) => {
  const { questionID } = req.params;

  try {
    const question = await Question.findOne({
      where: { questionID },
      include: [
        {
          model: Subtopic,
          as: 'subtopic',
          attributes: ['subtopicID', 'subtopicName'],
        },
        {
          model: Option,
          as: 'options',
          attributes: ['optionID', 'optionText', 'isCorrect'],
        },
        {
          model: Quiz,
          as: 'quizzes',
          attributes: ['quizID', 'quizName'],
          through: { attributes: [] },
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Update a question (optional)
exports.updateQuestion = async (req, res) => {
  const { questionID } = req.params;
  const {
    questionText,
    questionType,
    correctAns,
    source,
    difficulty,
    subtopicID,
    options, // Array of options for MCQ
  } = req.body;
  const userID = req.userID; // Set by authMiddleware

  try {
    // Find the question
    const question = await Question.findOne({ where: { questionID }, include: [Quiz] });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // Verify that the user owns the quiz associated with the question
    const quiz = await Quiz.findOne({ where: { quizID: question.quizzes[0].quizID, createdBy: userID } });
    if (!quiz) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this question.' });
    }

    // If subtopicID is provided, verify it belongs to the quiz's topic
    if (subtopicID) {
      const subtopic = await Subtopic.findOne({ where: { subtopicID, topicID: quiz.topicID } });
      if (!subtopic) {
        return res.status(400).json({ success: false, message: 'Invalid subtopic for this quiz.' });
      }
    }

    // Update the question
    await question.update({
      questionText: questionText || question.questionText,
      questionType: questionType || question.questionType,
      correctAns: questionType !== 'MCQ' ? correctAns : null,
      source: source || question.source,
      difficulty: difficulty || question.difficulty,
      subtopicID: subtopicID || question.subtopicID,
    });

    // If questionType is MCQ, handle options
    if (questionType === 'MCQ' && Array.isArray(options)) {
      // Delete existing options
      await Option.destroy({ where: { questionID: question.questionID } });

      // Create new options
      const optionData = options.map((opt) => ({
        questionID: question.questionID,
        optionText: opt.optionText,
        isCorrect: opt.isCorrect,
      }));
      await Option.bulkCreate(optionData);
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Delete a question (optional)
exports.deleteQuestion = async (req, res) => {
  const { questionID } = req.params;
  const userID = req.userID; // Set by authMiddleware

  try {
    const question = await Question.findOne({ where: { questionID }, include: [Quiz] });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // Verify that the user owns the quiz associated with the question
    const quiz = await Quiz.findOne({ where: { quizID: question.quizzes[0].quizID, createdBy: userID } });
    if (!quiz) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this question.' });
    }

    // Delete associated options
    await Option.destroy({ where: { questionID: question.questionID } });

    // Remove association with quiz
    await quiz.removeQuestion(question);

    // Delete the question
    await question.destroy();

    res.status(200).json({ success: true, message: 'Question deleted successfully.' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Add this new method
exports.getQuizQuestions = async (req, res) => {
  const { quizID } = req.params;

  try {
    const quiz = await Quiz.findOne({
      where: { 
        quizID,
        createdBy: req.user.id 
      },
      include: [{
        model: Question,
        as: 'questions',
        include: [{
          model: Option,
          as: 'options'
        }]
      }]
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.status(200).json({
      success: true,
      data: quiz.questions
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz questions'
    });
  }
};
