
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductionTester } from '@/utils/productionTesting';
import { ENVIRONMENT } from '@/config/environment';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export const ProductionDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const results = await ProductionTester.runComprehensiveTests();
      setTestResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Test run failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Run tests on component mount
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status.toUpperCase()}</Badge>;
  };

  const stats = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'pass').length,
    failed: testResults.filter(r => r.status === 'fail').length,
    warnings: testResults.filter(r => r.status === 'warning').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Production Dashboard</h1>
          <p className="text-muted-foreground">Monitor system health and run production tests</p>
        </div>
        <Button onClick={runTests} disabled={isRunning}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Passed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                {lastRun ? `Last updated: ${lastRun.toLocaleString()}` : 'No tests run yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Environment:</span>
                  <Badge variant="outline">{ENVIRONMENT.NODE_ENV}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <Badge variant="outline">{ENVIRONMENT.APP_VERSION}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Overall Health:</span>
                  {stats.failed > 0 ? (
                    <Badge variant="destructive">Critical Issues</Badge>
                  ) : stats.warnings > 0 ? (
                    <Badge variant="secondary">Warnings Present</Badge>
                  ) : (
                    <Badge variant="default">Healthy</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.name}
                  </CardTitle>
                  {getStatusBadge(result.status)}
                </div>
                <CardDescription>{result.message}</CardDescription>
              </CardHeader>
              {result.details && (
                <CardContent>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment Configuration</CardTitle>
              <CardDescription>Current environment settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Node Environment:</span>
                    <Badge variant="outline">{ENVIRONMENT.NODE_ENV}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">App Version:</span>
                    <Badge variant="outline">{ENVIRONMENT.APP_VERSION}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">CSP Enabled:</span>
                    <Badge variant={ENVIRONMENT.ENABLE_CSP ? "default" : "secondary"}>
                      {ENVIRONMENT.ENABLE_CSP ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Performance Monitoring:</span>
                    <Badge variant={ENVIRONMENT.ENABLE_PERFORMANCE_MONITORING ? "default" : "secondary"}>
                      {ENVIRONMENT.ENABLE_PERFORMANCE_MONITORING ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Error Tracking:</span>
                    <Badge variant={ENVIRONMENT.ENABLE_ERROR_TRACKING ? "default" : "secondary"}>
                      {ENVIRONMENT.ENABLE_ERROR_TRACKING ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Currently enabled features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(ENVIRONMENT.FEATURES).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">{feature}</span>
                    <Badge variant={enabled ? "default" : "secondary"}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
