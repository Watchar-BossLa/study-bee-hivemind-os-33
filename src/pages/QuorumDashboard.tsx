
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SwarmVisualization } from '../components/tutor/components/dashboard/SwarmVisualization';
import { SwarmMetricsChart } from '../components/tutor/components/dashboard/SwarmMetricsChart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, Brain, Gauge, MonitorPlay, Network } from 'lucide-react';
import { swarmMetricsService, SwarmMetricsRecord } from '../components/tutor/services/metrics/SwarmMetricsService';

const QuorumDashboard: React.FC = () => {
  const { toast } = useToast();
  const [metricsData, setMetricsData] = useState<SwarmMetricsRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Generate some mock data for demonstration purposes
    generateMockMetricsData();
    setIsLoading(false);
  }, []);

  const generateMockMetricsData = () => {
    // Add a few sample metrics if none exist
    if (swarmMetricsService.getMetricsRecords().length === 0) {
      const now = Date.now();
      for (let i = 0; i < 5; i++) {
        const taskCount = Math.floor(Math.random() * 20) + 5;
        const agentCount = Math.floor(Math.random() * 5) + 1;
        swarmMetricsService.recordSwarmExecution(
          taskCount,
          agentCount,
          Math.floor(Math.random() * 2000) + 500, // execution time between 500-2500ms
          taskCount * 150, // estimated token usage
          `council-${i % 3 + 1}`,
          `topic-${i % 4 + 1}`
        );
      }
    }
    setMetricsData(swarmMetricsService.getMetricsRecords());
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    generateMockMetricsData();
    setIsLoading(false);
    
    toast({
      title: "Dashboard Refreshed",
      description: "The QuorumForge dashboard data has been refreshed.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <Helmet>
        <title>QuorumForge Dashboard | Study Bee</title>
        <meta name="description" content="Monitor and control the QuorumForge agent orchestration system" />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">QuorumForge Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor and manage the autonomous agent system</p>
        </div>
        <Button onClick={handleRefresh}>Refresh Data</Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span className="hidden md:inline">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="swarms" className="flex items-center gap-1">
            <Network className="w-4 h-4" />
            <span className="hidden md:inline">Swarms</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden md:inline">Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <MonitorPlay className="w-4 h-4" />
            <span className="hidden md:inline">Logs</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current state of QuorumForge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Active Councils:</span>
                    <span className="font-semibold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Agents:</span>
                    <span className="font-semibold">16</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Tasks:</span>
                    <span className="font-semibold">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Load:</span>
                    <span className="font-semibold text-green-600">Low</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <SwarmVisualization metrics={metricsData} isLoading={isLoading} />
          </div>
          
          <SwarmMetricsChart hoursBack={12} />
        </TabsContent>
        
        <TabsContent value="swarms" className="space-y-6">
          <SwarmVisualization metrics={metricsData} isLoading={isLoading} className="h-[400px]" />
          <SwarmMetricsChart />
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6">
          <SwarmMetricsChart hoursBack={24} limit={100} />
        </TabsContent>
        
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
              <CardDescription>Performance and status of specialized agents</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Agent information will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest agent and council activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Activity information will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>QuorumForge execution logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p>System logs will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuorumDashboard;
