
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FlashcardsList from '@/components/shared/flashcards/FlashcardsList';

const Flashcards = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Flashcards</h1>
          <div className="flex gap-3">
            <Link to="/flashcards/review">
              <Button>Start Review</Button>
            </Link>
            <Link to="/flashcards/analytics">
              <Button variant="outline">View Analytics</Button>
            </Link>
          </div>
        </div>
        <FlashcardsList />
      </main>
      <Footer />
    </div>
  );
};

export default Flashcards;
