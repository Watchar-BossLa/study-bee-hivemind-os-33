import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Tutor from './pages/Tutor';
import Flashcards from './pages/Flashcards';
import FlashcardReview from './pages/FlashcardReview';
import Analytics from './pages/Analytics';
import Qualifications from './pages/Qualifications';
import OCR from './pages/OCR';
import Arena from './pages/Arena';
import ArenaMatch from './pages/ArenaMatch';
import ArenaLobby from './pages/ArenaLobby';
import LiveSessions from './pages/LiveSessions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/flashcards/review" element={<FlashcardReview />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/qualifications" element={<Qualifications />} />
        <Route path="/ocr" element={<OCR />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/arena/:matchId" element={<ArenaMatch />} />
        <Route path="/arena/lobby" element={<ArenaLobby />} />
        <Route path="/live-sessions" element={<LiveSessions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
