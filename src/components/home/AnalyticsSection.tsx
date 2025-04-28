
import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const AnalyticsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Learning Analytics</h2>
          <p className="text-muted-foreground mt-2">Track your learning progress and performance</p>
        </div>
        <AnalyticsDashboard />
      </div>
    </section>
  );
};

export default AnalyticsSection;
