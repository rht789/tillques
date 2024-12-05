// src/services/quizService.js

import api from './api';

const getAllQuizzes = async () => {
  try {
    const response = await api.get('/quizzes');
    return response;
  } catch (error) {
    console.error('Error in getAllQuizzes:', {
      message: error.message,
      response: error.response?.data
    });
    throw error;
  }
};

const createQuiz = async (quizData) => {
  const response = await api.post('/quizzes', quizData);
  return response.data;
};

const deleteQuiz = async (quizId) => {
  const response = await api.delete(`/quizzes/${quizId}`);
  return response.data;
};

const quizService = {
  getAllQuizzes,
  createQuiz,
  deleteQuiz,
  // ... other methods
};

export default quizService;
