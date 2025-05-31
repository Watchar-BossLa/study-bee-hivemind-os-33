
import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from "@/components/ui/toast"

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const Auth = lazy(() => import('@/pages/Auth'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Courses = lazy(() => import('@/pages/Courses'));
const CourseDetail = lazy(() => import('@/pages/CourseDetail'));
const CourseContent = lazy(() => import('@/pages/CourseContent'));
const CourseLearning = lazy(() => import('@/pages/CourseLearning'));
const Flashcards = lazy(() => import('@/pages/Flashcards'));
const CreateFlashcard = lazy(() => import('@/pages/CreateFlashcard'));
const EditFlashcard = lazy(() => import('@/pages/EditFlashcard'));
const FlashcardReview = lazy(() => import('@/pages/FlashcardReview'));
const FlashcardManagement = lazy(() => import('@/pages/FlashcardManagement'));
const FlashcardAnalytics = lazy(() => import('@/pages/FlashcardAnalytics'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Arena = lazy(() => import('@/pages/Arena'));
const ArenaLobby = lazy(() => import('@/pages/ArenaLobby'));
const ArenaMatch = lazy(() => import('@/pages/ArenaMatch'));
const ArenaAdmin = lazy(() => import('@/pages/ArenaAdmin'));
const LiveSessions = lazy(() => import('@/pages/LiveSessions'));
const LiveStudySessions = lazy(() => import('@/pages/LiveStudySessions'));
const Tutor = lazy(() => import('@/pages/Tutor'));
const GraphTutor = lazy(() => import('@/pages/GraphTutor'));
const QuorumDashboard = lazy(() => import('@/pages/QuorumDashboard'));
const OCR = lazy(() => import('@/pages/OCR'));
const OCRFlashcards = lazy(() => import('@/pages/OCRFlashcards'));
const AdaptiveQuiz = lazy(() => import('@/pages/AdaptiveQuiz'));
const Qualifications = lazy(() => import('@/pages/Qualifications'));
const Profile = lazy(() => import('@/pages/Profile'));
const ThemeSettings = lazy(() => import('@/pages/ThemeSettings'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotImplemented = lazy(() => import('@/pages/NotImplemented'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const StudyGroups = lazy(() => import('@/pages/StudyGroups'));
const PeerLearning = lazy(() => import('@/pages/PeerLearning'));
const CollaborativeNotes = lazy(() => import('@/pages/CollaborativeNotes'));

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorFallback } from '@/components/error/ErrorFallback';

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<PageLoading />}><Home /></Suspense>,
  },
  {
    path: "/auth",
    element: <Suspense fallback={<PageLoading />}><Auth /></Suspense>,
  },
  {
    path: "/login",
    element: <Suspense fallback={<PageLoading />}><Login /></Suspense>,
  },
  {
    path: "/register",
    element: <Suspense fallback={<PageLoading />}><Register /></Suspense>,
  },
  {
    path: "/dashboard",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Dashboard /></ProtectedRoute></Suspense>,
  },
  {
    path: "/courses",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Courses /></ProtectedRoute></Suspense>,
  },
  {
    path: "/courses/:courseId",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><CourseDetail /></ProtectedRoute></Suspense>,
  },
  {
    path: "/courses/:courseId/content",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><CourseContent /></ProtectedRoute></Suspense>,
  },
  {
    path: "/courses/:courseId/learning",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><CourseLearning /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Flashcards /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards/create",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><CreateFlashcard /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards/:id/edit",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><EditFlashcard /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards/review",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><FlashcardReview /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards/management",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><FlashcardManagement /></ProtectedRoute></Suspense>,
  },
  {
    path: "/flashcards/analytics",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><FlashcardAnalytics /></ProtectedRoute></Suspense>,
  },
  {
    path: "/analytics",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Analytics /></ProtectedRoute></Suspense>,
  },
  {
    path: "/arena",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Arena /></ProtectedRoute></Suspense>,
  },
  {
    path: "/arena/lobby",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><ArenaLobby /></ProtectedRoute></Suspense>,
  },
  {
    path: "/arena/match/:matchId",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><ArenaMatch /></ProtectedRoute></Suspense>,
  },
  {
    path: "/arena/admin",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><ArenaAdmin /></ProtectedRoute></Suspense>,
  },
  {
    path: "/live-sessions",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><LiveSessions /></ProtectedRoute></Suspense>,
  },
  {
    path: "/live-study-sessions",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><LiveStudySessions /></ProtectedRoute></Suspense>,
  },
  {
    path: "/study-groups",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><StudyGroups /></ProtectedRoute></Suspense>,
  },
  {
    path: "/peer-learning",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><PeerLearning /></ProtectedRoute></Suspense>,
  },
  {
    path: "/collaborative-notes",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><CollaborativeNotes /></ProtectedRoute></Suspense>,
  },
  {
    path: "/tutor",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Tutor /></ProtectedRoute></Suspense>,
  },
  {
    path: "/graph-tutor",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><GraphTutor /></ProtectedRoute></Suspense>,
  },
  {
    path: "/quorum-dashboard",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><QuorumDashboard /></ProtectedRoute></Suspense>,
  },
  {
    path: "/ocr",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><OCR /></ProtectedRoute></Suspense>,
  },
  {
    path: "/ocr/flashcards",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><OCRFlashcards /></ProtectedRoute></Suspense>,
  },
  {
    path: "/adaptive-quiz",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><AdaptiveQuiz /></ProtectedRoute></Suspense>,
  },
  {
    path: "/qualifications",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Qualifications /></ProtectedRoute></Suspense>,
  },
  {
    path: "/profile",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense>,
  },
  {
    path: "/theme-settings",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><ThemeSettings /></ProtectedRoute></Suspense>,
  },
  {
    path: "/settings",
    element: <Suspense fallback={<PageLoading />}><ProtectedRoute><Settings /></ProtectedRoute></Suspense>,
  },
  {
    path: "/not-implemented",
    element: <Suspense fallback={<PageLoading />}><NotImplemented /></Suspense>,
  },
  {
    path: "/404",
    element: <Suspense fallback={<PageLoading />}><NotFound /></Suspense>,
  },
  {
    path: "*",
    element: <Suspense fallback={<PageLoading />}><NotFoundPage /></Suspense>,
  },
]);

// Create optimized QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const handleGlobalError = (error: Error): void => {
  console.error('Global application error:', error);
  // In production, this would send to monitoring service
};

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={ErrorFallback} onError={handleGlobalError}>
          <AuthProvider>
            <ToastProvider />
            <RouterProvider router={router} />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
