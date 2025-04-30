
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SwarmVisualization } from '@/components/tutor/components/dashboard/SwarmVisualization';
import { quorumForge } from '@/components/tutor/services/QuorumForge';
import { Toaster } from '@/components/ui/toaster';
import { SwarmMetricsRecord } from '@/components/tutor/services/metrics/SwarmMetricsService';

const QuorumDashboard = () => {
  const [swarmMetrics, setSwarmMetrics] = useState<SwarmMetricsRecord[]>([]);
  const [langchainQuotaStats, setLangchainQuotaStats] = useState<Record<string, any>>({});
  const [activeAutogenSessions, setActiveAutogenSessions] = useState<string[]>([]);
  
  useEffect(() => {
    // This would normally fetch real data from the services
    // For now, we'll generate mock data
    
    const mockSwarmMetrics: SwarmMetricsRecord[] = Array.from({ length: 8 }, (_, i) => ({
      timestamp: new Date(Date.now() - (i * 3600000)),
      taskCount: Math.floor(Math.random() * 12) + 4,
      durationMs: Math.floor(Math.random() * 800) + 200,
      successRate: 0.7 + (Math.random() * 0.3),
      fanoutRatio: Math.random() * 3 + 1
    }));
    
    setSwarmMetrics(mockSwarmMetrics);
    
    setLangchainQuotaStats({
      'tutor-chain': { current: 42, limit: 150, percentage: 0.28 },
      'assessment-chain': { current: 18, limit: 75, percentage: 0.24 },
      'cot-reasoning': { current: 36, limit: 50, percentage: 0.72 }
    });
    
    setActiveAutogenSessions(['session-123', 'session-456']);
    
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8 mb-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold">QuorumForge OS Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage agent frameworks, services, and performance metrics.</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="swarm">Swarm Metrics</TabsTrigger>
            <TabsTrigger value="quotas">Framework Quotas</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <span>OpenAI Swarm</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>LangChain Integration</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Autogen</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>CrewAI Planner</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>A2A Hub</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Autogen Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeAutogenSessions.length > 0 ? (
                    <ul className="space-y-2">
                      {activeAutogenSessions.map(sessionId => (
                        <li key={sessionId} className="flex items-center justify-between">
                          <span>{sessionId}</span>
                          <span className="text-blue-500 font-medium">Running</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No active sessions</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">OAuth Status</p>
                      <p className="text-green-500">Connected</p>
                    </div>
                    <div>
                      <p className="font-medium">Schema Validator</p>
                      <p className="text-green-500">Online</p>
                    </div>
                    <div>
                      <p className="font-medium">Storage</p>
                      <p className="text-green-500">Operational</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="swarm">
            <div className="space-y-6">
              <SwarmVisualization metrics={swarmMetrics} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Swarm Task Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60 flex items-center justify-center">
                    <p className="text-muted-foreground">Task distribution chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quotas">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>LangChain Quota Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(langchainQuotaStats).map(([chainId, stats]) => (
                      <div key={chainId}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{chainId}</p>
                          <p className="text-sm">{stats.current}/{stats.limit} ({Math.round(stats.percentage * 100)}%)</p>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${stats.percentage > 0.8 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ width: `${stats.percentage * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="config">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Framework Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Configure framework integrations and thresholds</p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-2">A2A OAuth Configuration</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Domain:</span> studybee-dev.us.auth0.com</div>
                        <div><span className="text-muted-foreground">Audience:</span> a2a-api</div>
                        <div><span className="text-muted-foreground">Client ID:</span> agent-to-agent-client</div>
                        <div><span className="text-muted-foreground">Grant Type:</span> client_credentials</div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Autogen Turn Guard</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Default Max Turns:</span> 6</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default QuorumDashboard;
