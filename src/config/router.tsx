
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageLoading } from '@/components/loading/PageLoading';

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

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageLoading />}>
    <Component />
  </Suspense>
);

const withProtectedSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageLoading />}>
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(Home),
  },
  {
    path: "/auth",
    element: withSuspense(Auth),
  },
  {
    path: "/login",
    element: withSuspense(Login),
  },
  {
    path: "/register",
    element: withSuspense(Register),
  },
  {
    path: "/dashboard",
    element: withProtectedSuspense(Dashboard),
  },
  {
    path: "/courses",
    element: withProtectedSuspense(Courses),
  },
  {
    path: "/courses/:courseId",
    element: withProtectedSuspense(CourseDetail),
  },
  {
    path: "/courses/:courseId/content",
    element: withProtectedSuspense(CourseContent),
  },
  {
    path: "/courses/:courseId/learning",
    element: withProtectedSuspense(CourseLearning),
  },
  {
    path: "/flashcards",
    element: withProtectedSuspense(Flashcards),
  },
  {
    path: "/flashcards/create",
    element: withProtectedSuspense(CreateFlashcard),
  },
  {
    path: "/flashcards/:id/edit",
    element: withProtectedSuspense(EditFlashcard),
  },
  {
    path: "/flashcards/review",
    element: withProtectedSuspense(FlashcardReview),
  },
  {
    path: "/flashcards/management",
    element: withProtectedSuspense(FlashcardManagement),
  },
  {
    path: "/flashcards/analytics",
    element: withProtectedSuspense(FlashcardAnalytics),
  },
  {
    path: "/analytics",
    element: withProtectedSuspense(Analytics),
  },
  {
    path: "/arena",
    element: withProtectedSuspense(Arena),
  },
  {
    path: "/arena/lobby",
    element: withProtectedSuspense(ArenaLobby),
  },
  {
    path: "/arena/match/:matchId",
    element: withProtectedSuspense(ArenaMatch),
  },
  {
    path: "/arena/admin",
    element: withProtectedSuspense(ArenaAdmin),
  },
  {
    path: "/live-sessions",
    element: withProtectedSuspense(LiveSessions),
  },
  {
    path: "/live-study-sessions",
    element: withProtectedSuspense(LiveStudySessions),
  },
  {
    path: "/study-groups",
    element: withProtectedSuspense(StudyGroups),
  },
  {
    path: "/peer-learning",
    element: withProtectedSuspense(PeerLearning),
  },
  {
    path: "/collaborative-notes",
    element: withProtectedSuspense(CollaborativeNotes),
  },
  {
    path: "/tutor",
    element: withProtectedSuspense(Tutor),
  },
  {
    path: "/graph-tutor",
    element: withProtectedSuspense(GraphTutor),
  },
  {
    path: "/quorum-dashboard",
    element: withProtectedSuspense(QuorumDashboard),
  },
  {
    path: "/ocr",
    element: withProtectedSuspense(OCR),
  },
  {
    path: "/ocr/flashcards",
    element: withProtectedSuspense(OCRFlashcards),
  },
  {
    path: "/adaptive-quiz",
    element: withProtectedSuspense(AdaptiveQuiz),
  },
  {
    path: "/qualifications",
    element: withProtectedSuspense(Qualifications),
  },
  {
    path: "/profile",
    element: withProtectedSuspense(Profile),
  },
  {
    path: "/theme-settings",
    element: withProtectedSuspense(ThemeSettings),
  },
  {
    path: "/settings",
    element: withProtectedSuspense(Settings),
  },
  {
    path: "/not-implemented",
    element: withSuspense(NotImplemented),
  },
  {
    path: "/404",
    element: withSuspense(NotFound),
  },
  {
    path: "*",
    element: withSuspense(NotFoundPage),
  },
]);
