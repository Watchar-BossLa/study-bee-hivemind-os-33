import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Analytics from '@/pages/Analytics';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import CourseLearning from '@/pages/CourseLearning';
import CourseContent from '@/pages/CourseContent';
import Tutor from '@/pages/Tutor';
import GraphTutor from '@/pages/GraphTutor';
import Flashcards from '@/pages/Flashcards';
import FlashcardReview from '@/pages/FlashcardReview';
import FlashcardAnalytics from '@/pages/FlashcardAnalytics';
import ArenaLobby from '@/pages/ArenaLobby';
import ArenaMatch from '@/pages/ArenaMatch';
import ArenaAdmin from '@/pages/ArenaAdmin';
import LiveSessions from '@/pages/LiveSessions';
import LiveStudySessions from '@/pages/LiveStudySessions';
import CollaborativeNotes from '@/pages/CollaborativeNotes';
import OCR from '@/pages/OCR';
import OCRFlashcards from '@/pages/OCRFlashcards';
import Qualifications from '@/pages/Qualifications';
import ThemeSettings from '@/pages/ThemeSettings';
import Profile from '@/pages/Profile';
import PeerLearning from '@/pages/PeerLearning';
import StudyGroups from '@/pages/StudyGroups';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import QuorumDashboard from '@/pages/QuorumDashboard';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import CreateFlashcard from '@/pages/CreateFlashcard';
import FlashcardManagement from '@/pages/FlashcardManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/learning/:courseId" element={<CourseLearning />} />
        <Route path="/content/:courseId/:sectionId/:lessonId" element={<CourseContent />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/graphtutor" element={<GraphTutor />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/flashcards/create" element={<CreateFlashcard />} />
        <Route path="/flashcards/review" element={<FlashcardReview />} />
        <Route path="/flashcards/analytics" element={<FlashcardAnalytics />} />
        <Route path="/flashcards/manage" element={<FlashcardManagement />} />
        <Route path="/arena" element={<ArenaLobby />} />
        <Route path="/arena/match/:matchId" element={<ArenaMatch />} />
        <Route path="/arena/admin" element={<ArenaAdmin />} />
        <Route path="/live-sessions" element={<LiveSessions />} />
        <Route path="/live-sessions/:sessionId" element={<LiveStudySessions />} />
        <Route path="/collaborative-notes" element={<CollaborativeNotes />} />
        <Route path="/ocr" element={<OCR />} />
        <Route path="/ocr/flashcards/:uploadId" element={<OCRFlashcards />} />
        <Route path="/qualifications" element={<Qualifications />} />
        <Route path="/theme-settings" element={<ThemeSettings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/peer" element={<PeerLearning />} />
        <Route path="/groups" element={<StudyGroups />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quorum-dashboard" element={<QuorumDashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
