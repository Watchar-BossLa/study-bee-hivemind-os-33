
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveSessionsContainer from '@/components/livesessions/LiveSessionsContainer';

const LiveSessions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Live Study Sessions</h1>
        <LiveSessionsContainer />
      </main>
      <Footer />
    </div>
  );
};

export default LiveSessions;
