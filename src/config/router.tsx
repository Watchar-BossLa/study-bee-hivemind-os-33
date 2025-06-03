import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageLoading } from "@/components/loading/PageLoading";

// Lazy load all pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const Home = lazy(() => import("@/pages/Home"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const SecuritySettings = lazy(() => import("@/pages/SecuritySettings"));
const Courses = lazy(() => import("@/pages/Courses"));
const CourseLearning = lazy(() => import("@/pages/CourseLearning"));
const CourseDetail = lazy(() => import("@/pages/CourseDetail"));
const Qualifications = lazy(() => import("@/pages/Qualifications"));
const Flashcards = lazy(() => import("@/pages/Flashcards"));
const CreateFlashcard = lazy(() => import("@/pages/CreateFlashcard"));
const EditFlashcard = lazy(() => import("@/pages/EditFlashcard"));
const FlashcardReview = lazy(() => import("@/pages/FlashcardReview"));
const FlashcardAnalytics = lazy(() => import("@/pages/FlashcardAnalytics"));
const FlashcardManagement = lazy(() => import("@/pages/FlashcardManagement"));
const OCR = lazy(() => import("@/pages/OCR"));
const OCRFlashcards = lazy(() => import("@/pages/OCRFlashcards"));
const GraphTutor = lazy(() => import("@/pages/GraphTutor"));
const Tutor = lazy(() => import("@/pages/Tutor"));
const QuorumDashboard = lazy(() => import("@/pages/QuorumDashboard"));
const Arena = lazy(() => import("@/pages/Arena"));
const ArenaLobby = lazy(() => import("@/pages/ArenaLobby"));
const ArenaMatch = lazy(() => import("@/pages/ArenaMatch"));
const ArenaAdmin = lazy(() => import("@/pages/ArenaAdmin"));
const LiveSessions = lazy(() => import("@/pages/LiveSessions"));
const LiveStudySessions = lazy(() => import("@/pages/LiveStudySessions"));
const StudyGroups = lazy(() => import("@/pages/StudyGroups"));
const CollaborativeNotes = lazy(() => import("@/pages/CollaborativeNotes"));
const PeerLearning = lazy(() => import("@/pages/PeerLearning"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const AdaptiveQuiz = lazy(() => import("@/pages/AdaptiveQuiz"));
const ProductionDashboard = lazy(() => import("@/pages/ProductionDashboard"));
const ThemeSettings = lazy(() => import("@/pages/ThemeSettings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoading />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SuspenseWrapper><Index /></SuspenseWrapper>,
  },
  {
    path: "/home",
    element: <SuspenseWrapper><Home /></SuspenseWrapper>,
  },
  {
    path: "/auth",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute requireAuth={false}>
          <Auth />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/profile",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/settings",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/security",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/courses",
    element: <SuspenseWrapper><Courses /></SuspenseWrapper>,
  },
  {
    path: "/courses/:courseId",
    element: <SuspenseWrapper><CourseDetail /></SuspenseWrapper>,
  },
  {
    path: "/courses/:courseId/learn",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <CourseLearning />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/qualifications",
    element: <SuspenseWrapper><Qualifications /></SuspenseWrapper>,
  },
  {
    path: "/flashcards",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Flashcards />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/flashcards/create",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <CreateFlashcard />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/flashcards/:id/edit",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <EditFlashcard />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/flashcards/review",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <FlashcardReview />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/flashcards/analytics",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <FlashcardAnalytics />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/flashcards/manage",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <FlashcardManagement />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/ocr",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <OCR />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/ocr-flashcards",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <OCRFlashcards />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/graph-tutor",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <GraphTutor />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/tutor",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Tutor />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/quorum-dashboard",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <QuorumDashboard />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/arena",
    element: <SuspenseWrapper><Arena /></SuspenseWrapper>,
  },
  {
    path: "/arena/lobby",
    element: <SuspenseWrapper><ArenaLobby /></SuspenseWrapper>,
  },
  {
    path: "/arena/match/:matchId",
    element: <SuspenseWrapper><ArenaMatch /></SuspenseWrapper>,
  },
  {
    path: "/arena/admin",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <ArenaAdmin />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/live-sessions",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <LiveSessions />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/live-study-sessions",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <LiveStudySessions />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/study-groups",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <StudyGroups />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/collaborative-notes",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <CollaborativeNotes />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/peer-learning",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <PeerLearning />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/analytics",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/adaptive-quiz",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <AdaptiveQuiz />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/production-dashboard",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <ProductionDashboard />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "/theme-settings",
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <ThemeSettings />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
  },
  {
    path: "*",
    element: <SuspenseWrapper><NotFound /></SuspenseWrapper>,
  },
]);
