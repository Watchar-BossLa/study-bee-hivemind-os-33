
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';

const StatisticsSection = () => {
  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container">
        <DashboardStats />
      </div>
    </section>
  );
};

export default StatisticsSection;
