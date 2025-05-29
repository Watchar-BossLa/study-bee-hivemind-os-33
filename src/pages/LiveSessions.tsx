
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveSessionsContainer from '@/components/livesessions/LiveSessionsContainer';

const LiveSessions = () => {
  return (
    <>
      <Helmet>
        <title>Live Sessions - Study Bee</title>
        <meta name="description" content="Join collaborative learning sessions with real-time chat, polls, and whiteboard features" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Live Learning Sessions</h1>
              <p className="text-muted-foreground">
                Join collaborative study sessions with real-time chat, interactive polls, and shared whiteboards
              </p>
            </div>
            <LiveSessionsContainer />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LiveSessions;
