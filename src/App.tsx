
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseContent from './pages/CourseContent';
import CourseLearning from './pages/CourseLearning';
import Arena from './pages/Arena';
import ArenaAdmin from './pages/ArenaAdmin';
import CollaborativeNotes from './pages/CollaborativeNotes';
import FlashcardReview from './pages/FlashcardReview';
import PeerLearning from './pages/PeerLearning';
import OCRFlashcards from './pages/OCRFlashcards';
import GraphTutor from './pages/GraphTutor';
import ThemeSettings from './pages/ThemeSettings';
import StudyGroups from './pages/StudyGroups';
import LiveStudySessions from './pages/LiveStudySessions';
import Qualifications from './pages/Qualifications';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './components/theme/ThemeProvider';
import QuorumDashboard from './pages/QuorumDashboard';

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <HelmetProvider>
          <BrowserRouter>
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:courseId" element={<CourseContent />} />
                <Route path="/learn/:courseId" element={<CourseLearning />} />
                <Route path="/arena" element={<Arena />} />
                <Route path="/arena/admin" element={<ArenaAdmin />} />
                <Route path="/notes" element={<CollaborativeNotes />} />
                <Route path="/flashcards" element={<FlashcardReview />} />
                <Route path="/peers" element={<PeerLearning />} />
                <Route path="/ocr" element={<OCRFlashcards />} />
                <Route path="/graph-tutor" element={<GraphTutor />} />
                <Route path="/theme" element={<ThemeSettings />} />
                <Route path="/study-groups" element={<StudyGroups />} />
                <Route path="/live-sessions" element={<LiveStudySessions />} />
                <Route path="/qualifications" element={<Qualifications />} />
                <Route path="/quorum-dashboard" element={<QuorumDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </BrowserRouter>
        </HelmetProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
