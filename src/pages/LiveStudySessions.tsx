
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveSessionsContainer from '@/components/livesessions/LiveSessionsContainer';

const LiveStudySessions = () => {
  return (
    <>
      <Helmet>
        <title>Live Study Sessions | StudyBee</title>
        <meta name="description" content="Join live collaborative study sessions with peers" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <LiveSessionsContainer />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LiveStudySessions;
