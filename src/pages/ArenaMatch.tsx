
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'react-router-dom';

const ArenaMatch = () => {
  const { matchId } = useParams();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container flex-grow py-8">
        <h1 className="text-3xl font-bold">Arena Match</h1>
        <p className="mt-4">Match ID: {matchId}</p>
        <p className="mt-2">Arena match functionality will be implemented in a future sprint.</p>
      </main>
      <Footer />
    </div>
  );
};

export default ArenaMatch;
