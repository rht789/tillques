// src/services/questionService.js

import api from './api';

const createQuestion = async (quizID, questionData) => {
  try {
    // Format the data to match backend expectations
    const formattedData = {
      questionText: questionData.questionText,
      questionType: questionData.questionType,
      difficulty: questionData.difficulty,
      timeLimit: questionData.timeLimit,
      source: 'manual',
      options: questionData.options.map(opt => ({
        optionText: opt.text,
        isCorrect: opt.isCorrect
      }))
    };

    console.log('Sending formatted data:', formattedData);
    const response = await api.post(`/api/v1/quizzes/${quizID}/questions`, formattedData);
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
