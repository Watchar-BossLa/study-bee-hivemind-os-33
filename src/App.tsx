
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from "@/components/ui/toast"

import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import CourseContent from '@/pages/CourseContent';
import CourseLearning from '@/pages/CourseLearning';
import Flashcards from '@/pages/Flashcards';
import CreateFlashcard from '@/pages/CreateFlashcard';
import EditFlashcard from '@/pages/EditFlashcard';
import FlashcardReview from '@/pages/FlashcardReview';
import FlashcardManagement from '@/pages/FlashcardManagement';
import FlashcardAnalytics from '@/pages/FlashcardAnalytics';
import Analytics from '@/pages/Analytics';
import Arena from '@/pages/Arena';
import ArenaLobby from '@/pages/ArenaLobby';
import ArenaMatch from '@/pages/ArenaMatch';
import ArenaAdmin from '@/pages/ArenaAdmin';
import LiveSessions from '@/pages/LiveSessions';
import LiveStudySessions from '@/pages/LiveStudySessions';
import Tutor from '@/pages/Tutor';
import GraphTutor from '@/pages/GraphTutor';
import QuorumDashboard from '@/pages/QuorumDashboard';
import OCR from '@/pages/OCR';
import OCRFlashcards from '@/pages/OCRFlashcards';
import AdaptiveQuiz from '@/pages/AdaptiveQuiz';
import Qualifications from '@/pages/Qualifications';
import Profile from '@/pages/Profile';
import ThemeSettings from '@/pages/ThemeSettings';
import Settings from '@/pages/Settings';
import NotImplemented from '@/pages/NotImplemented';
import NotFound from '@/pages/NotFound';
import NotFoundPage from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorFallback } from '@/components/error/ErrorFallback';
import StudyGroups from '@/pages/StudyGroups';
import PeerLearning from '@/pages/PeerLearning';
import CollaborativeNotes from '@/pages/CollaborativeNotes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: "/courses",
    element: <ProtectedRoute><Courses /></ProtectedRoute>,
  },
  {
    path: "/courses/:courseId",
    element: <ProtectedRoute><CourseDetail /></ProtectedRoute>,
  },
  {
    path: "/courses/:courseId/content",
    element: <ProtectedRoute><CourseContent /></ProtectedRoute>,
  },
  {
    path: "/courses/:courseId/learning",
    element: <ProtectedRoute><CourseLearning /></ProtectedRoute>,
  },
  {
    path: "/flashcards",
    element: <ProtectedRoute><Flashcards /></ProtectedRoute>,
  },
  {
    path: "/flashcards/create",
    element: <ProtectedRoute><CreateFlashcard /></ProtectedRoute>,
  },
  {
    path: "/flashcards/:id/edit",
    element: <ProtectedRoute><EditFlashcard /></ProtectedRoute>,
  },
  {
    path: "/flashcards/review",
    element: <ProtectedRoute><FlashcardReview /></ProtectedRoute>,
  },
  {
    path: "/flashcards/management",
    element: <ProtectedRoute><FlashcardManagement /></ProtectedRoute>,
  },
  {
    path: "/flashcards/analytics",
    element: <ProtectedRoute><FlashcardAnalytics /></ProtectedRoute>,
  },
  {
    path: "/analytics",
    element: <ProtectedRoute><Analytics /></ProtectedRoute>,
  },
  {
    path: "/arena",
    element: <ProtectedRoute><Arena /></ProtectedRoute>,
  },
  {
    path: "/arena/lobby",
    element: <ProtectedRoute><ArenaLobby /></ProtectedRoute>,
  },
  {
    path: "/arena/match/:matchId",
    element: <ProtectedRoute><ArenaMatch /></ProtectedRoute>,
  },
  {
    path: "/arena/admin",
    element: <ProtectedRoute><ArenaAdmin /></ProtectedRoute>,
  },
  {
    path: "/live-sessions",
    element: <ProtectedRoute><LiveSessions /></ProtectedRoute>,
  },
  {
    path: "/live-study-sessions",
    element: <ProtectedRoute><LiveStudySessions /></ProtectedRoute>,
  },
  {
    path: "/study-groups",
    element: <ProtectedRoute><StudyGroups /></ProtectedRoute>,
  },
  {
    path: "/peer-learning",
    element: <ProtectedRoute><PeerLearning /></ProtectedRoute>,
  },
  {
    path: "/collaborative-notes",
    element: <ProtectedRoute><CollaborativeNotes /></ProtectedRoute>,
  },
  {
    path: "/tutor",
    element: <ProtectedRoute><Tutor /></ProtectedRoute>,
  },
  {
    path: "/graph-tutor",
    element: <ProtectedRoute><GraphTutor /></ProtectedRoute>,
  },
  {
    path: "/quorum-dashboard",
    element: <ProtectedRoute><QuorumDashboard /></ProtectedRoute>,
  },
  {
    path: "/ocr",
    element: <ProtectedRoute><OCR /></ProtectedRoute>,
  },
  {
    path: "/ocr/flashcards",
    element: <ProtectedRoute><OCRFlashcards /></ProtectedRoute>,
  },
  {
    path: "/adaptive-quiz",
    element: <ProtectedRoute><AdaptiveQuiz /></ProtectedRoute>,
  },
  {
    path: "/qualifications",
    element: <ProtectedRoute><Qualifications /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/theme-settings",
    element: <ProtectedRoute><ThemeSettings /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: "/not-implemented",
    element: <NotImplemented />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
