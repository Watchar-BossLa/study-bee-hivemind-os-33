
import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { ChartLine } from 'lucide-react';

const AnalyticsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="mb-8 flex items-center">
          <div className="mr-3 bg-primary/10 p-2 rounded-full">
            <ChartLine className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Learning Analytics</h2>
            <p className="text-muted-foreground mt-1">Track your progress and get personalized insights</p>
          </div>
        </div>
        <AnalyticsDashboard />
      </div>
    </section>
  );
};

export default AnalyticsSection;
