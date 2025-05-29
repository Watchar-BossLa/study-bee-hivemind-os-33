
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Courses = lazy(() => import('@/pages/Courses'));
const Flashcards = lazy(() => import('@/pages/Flashcards'));
const CreateFlashcard = lazy(() => import('@/pages/CreateFlashcard'));
const EditFlashcard = lazy(() => import('@/pages/EditFlashcard'));
const FlashcardReview = lazy(() => import('@/pages/FlashcardReview'));
const FlashcardAnalytics = lazy(() => import('@/pages/FlashcardAnalytics'));
const FlashcardManagement = lazy(() => import('@/pages/FlashcardManagement'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Arena = lazy(() => import('@/pages/Arena'));
const ArenaLobby = lazy(() => import('@/pages/ArenaLobby'));
const ArenaMatch = lazy(() => import('@/pages/ArenaMatch'));
const ArenaAdmin = lazy(() => import('@/pages/ArenaAdmin'));
const OCR = lazy(() => import('@/pages/OCR'));
const OCRFlashcards = lazy(() => import('@/pages/OCRFlashcards'));
const Tutor = lazy(() => import('@/pages/Tutor'));
const GraphTutor = lazy(() => import('@/pages/GraphTutor'));
const QuorumDashboard = lazy(() => import('@/pages/QuorumDashboard'));
const Qualifications = lazy(() => import('@/pages/Qualifications'));
const LiveSessions = lazy(() => import('@/pages/LiveSessions'));
const LiveStudySessions = lazy(() => import('@/pages/LiveStudySessions'));
const StudyGroups = lazy(() => import('@/pages/StudyGroups'));
const PeerLearning = lazy(() => import('@/pages/PeerLearning'));
const CollaborativeNotes = lazy(() => import('@/pages/CollaborativeNotes'));
const CourseDetail = lazy(() => import('@/pages/CourseDetail'));
const CourseLearning = lazy(() => import('@/pages/CourseLearning'));
const CourseContent = lazy(() => import('@/pages/CourseContent'));
const AdaptiveQuiz = lazy(() => import('@/pages/AdaptiveQuiz'));
const Settings = lazy(() => import('@/pages/Settings'));
const ThemeSettings = lazy(() => import('@/pages/ThemeSettings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <SectionErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/learning" element={<CourseLearning />} />
            <Route path="/courses/:id/content" element={<CourseContent />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/flashcards/create" element={<CreateFlashcard />} />
            <Route path="/flashcards/edit/:id" element={<EditFlashcard />} />
            <Route path="/flashcards/review" element={<FlashcardReview />} />
            <Route path="/flashcards/analytics" element={<FlashcardAnalytics />} />
            <Route path="/flashcards/management" element={<FlashcardManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/arena/lobby" element={<ArenaLobby />} />
            <Route path="/arena/match/:id" element={<ArenaMatch />} />
            <Route path="/arena/admin" element={<ArenaAdmin />} />
            <Route path="/ocr" element={<OCR />} />
            <Route path="/ocr/flashcards" element={<OCRFlashcards />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/graph-tutor" element={<GraphTutor />} />
            <Route path="/quorum-dashboard" element={<QuorumDashboard />} />
            <Route path="/qualifications" element={<Qualifications />} />
            <Route path="/live-sessions" element={<LiveSessions />} />
            <Route path="/live-study-sessions" element={<LiveStudySessions />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/peer-learning" element={<PeerLearning />} />
            <Route path="/collaborative-notes" element={<CollaborativeNotes />} />
            <Route path="/adaptive-quiz" element={<AdaptiveQuiz />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/theme-settings" element={<ThemeSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </SectionErrorBoundary>
    </Router>
  );
}

export default App;
