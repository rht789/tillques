// src/App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizProvider } from './contexts/QuizContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <AuthProvider>
      <QuizProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LandingPage />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/quizzes" element={<ProtectedRoute><ErrorBoundary><QuizList /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
              <Route path="/quizzes/:quizID/mode-selection" element={<ProtectedRoute><ModeSelection /></ProtectedRoute>} />
              <Route path="/quizzes/:quizID/create-question" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
              {/* ... other routes ... */}
            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </QuizProvider>
    </AuthProvider>
  );
}

export default App;
