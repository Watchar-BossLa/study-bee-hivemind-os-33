import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import OCRFlashcards from './pages/OCRFlashcards';
import FlashcardReview from './pages/FlashcardReview';
import FlashcardAnalytics from './pages/FlashcardAnalytics';
import ArenaLobby from './pages/ArenaLobby';
import ArenaMatch from './pages/ArenaMatch';
import { supabase } from './integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ocr" element={<OCRFlashcards />} />
          <Route path="/flashcards/review" element={<FlashcardReview />} />
          <Route path="/flashcards/analytics" element={<FlashcardAnalytics />} />
          <Route path="/arena" element={<ArenaLobby />} />
          <Route path="/arena/:matchId" element={<ArenaMatch />} />
        </Routes>
        <Toaster />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
