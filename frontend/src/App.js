// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import QuizList from './pages/Quizzes/QuizList';
import CreateQuiz from './pages/Quizzes/CreateQuiz';
import CreateQuestion from './pages/Questions/CreateQuestion';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import ModeSelection from './pages/Quizzes/ModeSelection';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
            <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
            <Route path="/quizzes/:quizID/mode-selection" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />
            <Route path="/quizzes/:quizID/create-question" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
            {/* ... other routes ... */}
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
