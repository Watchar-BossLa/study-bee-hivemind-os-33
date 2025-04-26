
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TutorChat from '@/components/tutor/TutorChat';
import KnowledgeGraph from '@/components/tutor/KnowledgeGraph';
import TutorHeader from '@/components/tutor/TutorHeader';

const GraphTutor = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <TutorHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <KnowledgeGraph />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <TutorChat />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GraphTutor;
