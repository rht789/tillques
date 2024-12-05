// services/quizService.js

const { Quiz, Topic, Question, Subtopic } = require('../models');

// Create a new quiz
exports.createQuiz = async (quizData) => {
  const { quizName, maxParticipants, topic, createdBy } = quizData;

  const quiz = await Quiz.create({
    quizName,
    maxParticipants,
    topicID: topic,
    createdBy,
  });

  return quiz;
};

// Get a quiz by ID
exports.getQuizById = async (quizID) => {
  const quiz = await Quiz.findOne({
    where: { quizID },
    include: [
      {
        model: Topic,
        as: 'topic',
        attributes: ['topicID', 'topicName'],
      },
      {
        model: Question,
        as: 'questions',
        through: { attributes: [] },
        include: [
          {
            model: Subtopic,
            as: 'subtopic',
            attributes: ['subtopicID', 'subtopicName'],
          },
        ],
      },
    ],
  });

  return quiz;
};

// List all quizzes
exports.listQuizzes = async (userID) => {
  if (!userID) {
    throw new Error('User ID is required');
  }

  const quizzes = await Quiz.findAll({
    where: { createdBy: userID },
    include: [
      {
        model: Topic,
        as: 'topic',
        attributes: ['topicID', 'topicName']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return {
    success: true,
    data: quizzes
  };
};

// Add a question to a quiz
exports.addQuestionToQuiz = async (quizID, questionID) => {
  const quiz = await Quiz.findByPk(quizID);
  if (!quiz) throw new Error('Quiz not found.');

  const question = await Question.findByPk(questionID);
  if (!question) throw new Error('Question not found.');

  await quiz.addQuestion(question);
};
