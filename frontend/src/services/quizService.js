// src/services/quizService.js

import api from './api';

export const getAllQuizzes = async () => {
  try {
    const response = await api.get('/quizzes');
    console.log('Quiz API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
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

const updateQuizMode = async (quizID, mode) => {
  try {
    const response = await api.put(`/api/v1/quizzes/${quizID}/mode`, { mode });
    return response.data;
  } catch (error) {
    console.error('Error updating quiz mode:', error.response?.data || error.message);
    throw error;
  }
};

const quizService = {
  getAllQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuizMode,
  // ... other methods
};

export default quizService;
