
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SwarmVisualization } from '../components/tutor/components/dashboard/SwarmVisualization';
import { SwarmMetricsChart } from '../components/tutor/components/dashboard/SwarmMetricsChart';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, Brain, Gauge, MonitorPlay, Network } from 'lucide-react';

const QuorumDashboard: React.FC = () => {
  const { toast } = useToast();
  
  const handleRefresh = () => {
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
        <PageHeader
          heading="QuorumForge Dashboard"
          subheading="Monitor and manage the autonomous agent system"
        />
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
            
            <SwarmVisualization />
          </div>
          
          <SwarmMetricsChart hoursBack={12} />
        </TabsContent>
        
        <TabsContent value="swarms" className="space-y-6">
          <SwarmVisualization className="h-[400px]" />
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
