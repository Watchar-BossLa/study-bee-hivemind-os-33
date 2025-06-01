
import React from 'react';
import { ProductionDashboard as Dashboard } from '@/components/admin/ProductionDashboard';
import { isDevelopment } from '@/config/environment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProductionDashboard() {
  if (!isDevelopment()) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The production dashboard is only available in development mode.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />;
}
