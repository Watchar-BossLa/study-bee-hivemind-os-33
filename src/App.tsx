
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "./components/auth/AuthContext";
import { AuthGuard } from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Qualifications from "./pages/Qualifications";
import CourseContent from "./pages/CourseContent";
import NotFound from "./pages/NotFound";
import NotImplemented from "./pages/NotImplemented";
import OCRFlashcards from "./pages/OCRFlashcards";
import GraphTutor from "./pages/GraphTutor";
import Arena from "./pages/Arena";
import CourseLearning from "./pages/CourseLearning";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="study-bee-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          {/* Theme change announcer for screen readers */}
          <div 
            id="theme-change-announcer" 
            className="sr-only" 
            aria-live="polite" 
            aria-atomic="true"
          />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <AuthGuard>
                  <Index />
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/courses" element={
                <AuthGuard>
                  <Courses />
                </AuthGuard>
              } />
              <Route path="/ocr" element={
                <AuthGuard>
                  <OCRFlashcards />
                </AuthGuard>
              } />
              <Route path="/tutor" element={
                <AuthGuard>
                  <GraphTutor />
                </AuthGuard>
              } />
              <Route path="/arena" element={
                <AuthGuard>
                  <Arena />
                </AuthGuard>
              } />
              <Route path="/qualifications" element={
                <AuthGuard>
                  <Qualifications />
                </AuthGuard>
              } />
              <Route path="/course/:subjectId/:moduleId" element={
                <AuthGuard>
                  <CourseContent />
                </AuthGuard>
              } />
              <Route path="/learn/:subjectId/:moduleId/:courseId" element={
                <AuthGuard>
                  <CourseLearning />
                </AuthGuard>
              } />
              
              {/* Placeholder routes for features mentioned in the spec */}
              <Route path="/flashcards" element={
                <AuthGuard>
                  <NotImplemented />
                </AuthGuard>
              } />
              <Route path="/spaced-repetition" element={
                <AuthGuard>
                  <NotImplemented />
                </AuthGuard>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
