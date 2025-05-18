
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import FlashcardsList from '@/components/shared/flashcards/FlashcardsList';

const Flashcards = () => {
  // Mock flashcards data - in a real application, this would come from an API or state management
  const [flashcards, setFlashcards] = useState([
    {
      id: '1',
      question: 'What is the capital of France?',
      answer: 'Paris'
    },
    {
      id: '2',
      question: 'What is the powerhouse of the cell?',
      answer: 'Mitochondria'
    },
    {
      id: '3',
      question: 'What is the chemical symbol for water?',
      answer: 'H₂O'
    }
  ]);

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
        <FlashcardsList flashcards={flashcards} />
      </main>
      <Footer />
    </div>
  );
};

export default Flashcards;
