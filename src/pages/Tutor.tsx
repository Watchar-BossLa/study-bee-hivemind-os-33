
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TutorChat from '@/components/tutor/TutorChat';
import KnowledgeGraph from '@/components/tutor/KnowledgeGraph';

const Tutor = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
        <TutorChat />
        <KnowledgeGraph />
      </main>
      <Footer />
    </div>
  );
};

export default Tutor;
