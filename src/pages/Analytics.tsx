
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Learning Analytics</h1>
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
