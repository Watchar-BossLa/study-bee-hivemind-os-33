
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AgentPerformanceTab from '@/components/tutor/components/dashboard/AgentPerformanceTab';
import SwarmMetricsTab from '@/components/tutor/components/dashboard/SwarmMetricsTab';
import AdvancedAnalyticsTab from '@/components/tutor/components/dashboard/AdvancedAnalyticsTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Brain, BarChart3, Zap, Atom } from 'lucide-react';

const QuorumDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              QuorumForge Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Advanced multi-agent AI orchestration with quantum-enhanced learning analytics, 
              real-time performance monitoring, and predictive intervention systems.
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Atom className="h-3 w-3" />
                Quantum-Enhanced
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Real-time
              </Badge>
            </div>
          </div>

          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  Active Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">7</div>
                <p className="text-xs text-muted-foreground">Specialized AI agents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                  Quantum Coherence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <p className="text-xs text-muted-foreground">Learning state stability</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">94%</div>
                <p className="text-xs text-muted-foreground">Overall efficiency</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="advanced-analytics" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto">
              <TabsTrigger value="advanced-analytics" className="flex items-center gap-2">
                <Atom className="h-4 w-4" />
                Advanced Analytics
              </TabsTrigger>
              <TabsTrigger value="agent-performance" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Agent Performance
              </TabsTrigger>
              <TabsTrigger value="swarm-metrics" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Swarm Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advanced-analytics" className="mt-6">
              <AdvancedAnalyticsTab />
            </TabsContent>

            <TabsContent value="agent-performance" className="mt-6">
              <AgentPerformanceTab />
            </TabsContent>

            <TabsContent value="swarm-metrics" className="mt-6">
              <SwarmMetricsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuorumDashboard;
