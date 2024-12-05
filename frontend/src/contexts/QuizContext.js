import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = {
    quizzes,
    setQuizzes,
    loading,
    setLoading,
    error,
    setError
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>; 
} 