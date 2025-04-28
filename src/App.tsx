
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Qualifications from "./pages/Qualifications";
import CourseContent from "./pages/CourseContent";
import NotFound from "./pages/NotFound";
import NotImplemented from "./pages/NotImplemented";
import OCRFlashcards from "./pages/OCRFlashcards";
import GraphTutor from "./pages/GraphTutor";
import Arena from "./pages/Arena";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          
          {/* Placeholder routes for features mentioned in the spec */}
          <Route path="/flashcards" element={<NotImplemented />} />
          <Route path="/spaced-repetition" element={<NotImplemented />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
