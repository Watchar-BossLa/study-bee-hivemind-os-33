
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Arena from './pages/Arena';
import Courses from './pages/Courses';
import Flashcards from './pages/Flashcards';
import FlashcardManagement from './pages/FlashcardManagement';
import CreateFlashcard from './pages/CreateFlashcard';
import EditFlashcard from './pages/EditFlashcard';
import Analytics from './pages/Analytics';
import Tutor from './pages/Tutor';
import GraphTutor from './pages/GraphTutor';
import AdaptiveQuiz from './pages/AdaptiveQuiz';
import QuorumDashboard from './pages/QuorumDashboard';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/flashcards/management" element={<FlashcardManagement />} />
        <Route path="/flashcards/create" element={<CreateFlashcard />} />
        <Route path="/flashcards/edit/:id" element={<EditFlashcard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/graph-tutor" element={<GraphTutor />} />
        <Route path="/adaptive-quiz" element={<AdaptiveQuiz />} />
        <Route path="/quorum-dashboard" element={<QuorumDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
