
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NavbarWithDashboard from '@/components/NavbarWithDashboard';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import Footer from '@/components/Footer';
import { PageHeader } from "@/components/ui/page-header";

/**
 * Analytics page that implements comprehensive metrics visualization as outlined in TSB section 16
 * Integrates with the monitoring and observability features mentioned in the specification.
 */
const Analytics = () => {
  return (
    <>
      <Helmet>
        <title>Analytics | Study Bee</title>
        <meta 
          name="description" 
          content="Track your learning progress, engagement metrics, and performance with Study Bee's comprehensive analytics suite." 
        />
      </Helmet>
      <NavbarWithDashboard />
      <main className="container py-8 space-y-8">
        <PageHeader 
          heading="Analytics Dashboard" 
          description="Visualize your learning patterns, mastery levels, and optimize your study approach" 
          className="mb-8"
        />
        <AnalyticsDashboard />
      </main>
      <Footer />
    </>
  );
};

export default Analytics;
