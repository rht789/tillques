import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HostControl from './components/HostControl';
import QuizList from './components/QuizList';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
// ... other imports

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/quizzes" element={<QuizList />} />
      <Route path="/host-control/:sessionId" element={<HostControl />} />
      {/* ... other routes */}
    </Routes>
  );
};

export default App; 