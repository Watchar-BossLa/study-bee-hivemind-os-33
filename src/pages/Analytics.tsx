
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NavbarWithDashboard from '@/components/NavbarWithDashboard';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import Footer from '@/components/Footer';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoCircle } from "lucide-react";

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
        
        <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 mb-6">
          <InfoCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            This dashboard integrates with OTEL spans and Grafana Cloud for observability as specified in TSB section 16.
          </AlertDescription>
        </Alert>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Analytics data is collected and processed according to the Study Bee Technical Specification. 
              Your data privacy is protected in compliance with GDPR/FERPA/COPPA regulations. 
              The synthetic k6 journeys feature ensures accurate performance measurement.
            </p>
          </CardContent>
        </Card>
        
        <AnalyticsDashboard />
      </main>
      <Footer />
    </>
  );
};

export default Analytics;
