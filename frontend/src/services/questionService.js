// src/services/questionService.js

import api from './api';

const createQuestion = async (quizID, questionData) => {
  try {
    let formattedData = {
      questionText: questionData.questionText,
      questionType: questionData.questionType,
      source: 'manual',
      difficulty: questionData.difficulty || 'medium',
      timeLimit: parseInt(questionData.timeLimit) || 30,
    };

    // Handle different question types
    switch (questionData.questionType) {
      case 'MCQ':
        formattedData.options = questionData.options.map(opt => ({
          text: opt.optionText,
          isCorrect: opt.isCorrect
        }));
        break;

      case 'TRUE_FALSE':
        formattedData.correctAnswer = questionData.correctAnswer === 'True';
        break;

      case 'SHORT_ANSWER':
      case 'FILL_IN_THE_BLANKS':
        formattedData.correctAnswer = questionData.correctAnswer;
        break;
    }

    console.log('Sending formatted data:', formattedData);
    const response = await api.post(`/quizzes/${quizID}/questions`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error.response?.data || error.message);
    throw error;
  }
};

const getQuestionById = async (questionID) => {
  const response = await api.get(`/questions/${questionID}`);
  return response.data;
};

const updateQuestion = async (questionID, updateData) => {
  const response = await api.put(`/questions/${questionID}`, updateData);
  return response.data;
};

const deleteQuestion = async (questionID) => {
  const response = await api.delete(`/questions/${questionID}`);
  return response.data;
};

// Add the new method to search for a question by text
const findQuestionByText = async (questionText) => {
  const response = await api.get('/questions/search', {
    params: { questionText },
  });
  return response.data;
};

const questionService = {
  createQuestion,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  findQuestionByText,
};

export default questionService;
