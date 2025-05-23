
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AdaptiveQuizContainer } from '@/components/quiz/adaptive/AdaptiveQuizContainer';
import { Toaster } from '@/components/ui/toaster';

const AdaptiveQuiz = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 mb-8">
        <h1 className="text-3xl font-bold mb-6">Adaptive Quiz Platform</h1>
        <AdaptiveQuizContainer />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default AdaptiveQuiz;
