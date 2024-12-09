import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HostControl from './components/HostControl';
import QuizList from './components/QuizList';
// ... other imports

const App = () => {
  return (
    <Routes>
      <Route path="/quizzes" element={<QuizList />} />
      <Route path="/host-control/:sessionId" element={<HostControl />} />
      {/* ... other routes */}
    </Routes>
  );
};

export default App; 