
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, BookOpen } from 'lucide-react';
import FlashcardAnalyticsDashboard from '@/components/flashcards/analytics/FlashcardAnalyticsDashboard';

const FlashcardAnalytics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container flex-grow py-8">
        <div className="flex items-center mb-8">
          <Link to="/flashcards" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart2 className="mr-2 h-6 w-6" /> Flashcard Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your learning progress and study habits
            </p>
          </div>
          <Link to="/flashcards/review">
            <Button className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Review Cards</span>
            </Button>
          </Link>
        </div>
        
        <FlashcardAnalyticsDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashcardAnalytics;
