
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import FlashcardAnalyticsDashboard from '@/components/flashcards/analytics/FlashcardAnalyticsDashboard';

const FlashcardAnalytics = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container flex-grow py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Learning Analytics</h1>
              <p className="text-muted-foreground mt-2">
                Track your progress, identify patterns, and optimize your learning journey
              </p>
            </div>
            <FlashcardAnalyticsDashboard />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default FlashcardAnalytics;
