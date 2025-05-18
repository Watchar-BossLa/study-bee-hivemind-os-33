
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OCRCamera from '@/components/ocr/OCRCamera';

const OCR = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Create Flashcards with OCR</h1>
        <OCRCamera />
      </main>
      <Footer />
    </div>
  );
};

export default OCR;
