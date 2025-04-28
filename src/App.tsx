import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Qualifications from "./pages/Qualifications";
import CourseContent from "./pages/CourseContent";
import NotFound from "./pages/NotFound";
import NotImplemented from "./pages/NotImplemented";
import OCRFlashcards from "./pages/OCRFlashcards";
import FlashcardReviewPage from "./pages/FlashcardReview";
import GraphTutor from "./pages/GraphTutor";
import Arena from "./pages/Arena";
import CourseLearning from "./pages/CourseLearning";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="study-bee-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/ocr" element={<OCRFlashcards />} />
            <Route path="/tutor" element={<GraphTutor />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/qualifications" element={<Qualifications />} />
            <Route path="/course/:subjectId/:moduleId" element={<CourseContent />} />
            <Route path="/learn/:subjectId/:moduleId/:courseId" element={<CourseLearning />} />
            
            {/* Updated route for spaced repetition */}
            <Route path="/spaced-repetition" element={<FlashcardReviewPage />} />
            
            {/* Keep flashcards route as NotImplemented for now */}
            <Route path="/flashcards" element={<NotImplemented />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
