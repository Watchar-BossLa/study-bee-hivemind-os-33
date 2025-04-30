
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Courses from './pages/Courses';
import CourseContent from './pages/CourseContent';
import CourseLearning from './pages/CourseLearning';
import Arena from './pages/Arena';
import FlashcardReview from './pages/FlashcardReview';
import OCRFlashcards from './pages/OCRFlashcards';
import GraphTutor from './pages/GraphTutor';
import LiveStudySessions from './pages/LiveStudySessions';
import PeerLearning from './pages/PeerLearning';
import NotImplemented from './pages/NotImplemented';
import NotFound from './pages/NotFound';
import Qualifications from './pages/Qualifications';
import StudyGroups from './pages/StudyGroups';
import CollaborativeNotes from './pages/CollaborativeNotes';
import QuorumDashboard from './pages/QuorumDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseContent />} />
        <Route path="/learning/:courseId" element={<CourseLearning />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/flashcards/review" element={<FlashcardReview />} />
        <Route path="/flashcards/ocr" element={<OCRFlashcards />} />
        <Route path="/tutor" element={<GraphTutor />} />
        <Route path="/live-sessions" element={<LiveStudySessions />} />
        <Route path="/peer-learning" element={<PeerLearning />} />
        <Route path="/qualifications" element={<Qualifications />} />
        <Route path="/study-groups" element={<StudyGroups />} />
        <Route path="/notes" element={<CollaborativeNotes />} />
        <Route path="/dashboard/quorum" element={<QuorumDashboard />} />
        <Route path="/wip" element={<NotImplemented />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
