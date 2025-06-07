
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { QuorumForgeAnalyticsDashboard } from '@/components/analytics/QuorumForgeAnalyticsDashboard';

const QuorumAnalytics = () => {
  return (
    <>
      <Helmet>
        <title>QuorumForge Analytics - Study Bee</title>
        <meta name="description" content="Real-time analytics dashboard for QuorumForge AI agent system performance, consensus patterns, and learning effectiveness." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-background">
          <div className="container mx-auto px-4 py-8">
            <QuorumForgeAnalyticsDashboard />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default QuorumAnalytics;
