
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SwarmMetricsTab from '@/components/tutor/components/dashboard/SwarmMetricsTab';
import { SwarmVisualization } from '@/components/tutor/components/dashboard/SwarmVisualization';
import { quorumForge } from '@/components/tutor/services/QuorumForge';

const QuorumDashboard = () => {
  const [activeTab, setActiveTab] = useState('swarm');
  
  // Example swarm metrics data
  const exampleSwarmMetrics = [
    {
      timestamp: new Date(Date.now() - 3600000),
      taskCount: 12,
      durationMs: 450,
      successRate: 0.92,
      fanoutRatio: 3.5
    },
    {
      timestamp: new Date(Date.now() - 2400000),
      taskCount: 18,
      durationMs: 520,
      successRate: 0.89,
      fanoutRatio: 4.0
    },
    {
      timestamp: new Date(Date.now() - 1200000),
      taskCount: 15,
      durationMs: 380,
      successRate: 0.95,
      fanoutRatio: 3.8
    },
    {
      timestamp: new Date(),
      taskCount: 22,
      durationMs: 490,
      successRate: 0.91,
      fanoutRatio: 4.2
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">QuorumForge Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 councils active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Swarm Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 in last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.3%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.1% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.87</div>
            <p className="text-xs text-muted-foreground mt-1">
              72% of daily budget
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="swarm">Swarm Performance</TabsTrigger>
          <TabsTrigger value="councils">Council Activity</TabsTrigger>
          <TabsTrigger value="a2a">A2A Network</TabsTrigger>
          <TabsTrigger value="plans">Plans & Execution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="swarm">
          <SwarmMetricsTab />
        </TabsContent>
        
        <TabsContent value="councils">
          <Card>
            <CardHeader>
              <CardTitle>Council Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Security Council</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">3 Agents</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        12 decisions in last 24h
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Learning Council</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">4 Agents</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        24 decisions in last 24h
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Assessment Council</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">3 Agents</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        8 decisions in last 24h
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 bg-muted/20 rounded-lg border p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Council activity visualization will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="a2a">
          <Card>
            <CardHeader>
              <CardTitle>A2A Network Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        6 direct, 2 relay
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">127</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ~4.2/min rate
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">14</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        5 unique providers
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 bg-muted/20 rounded-lg border p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">A2A network graph will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Plan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        1 critical, 2 normal
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Completed Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">21</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        7 in last 24h
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">94.7%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        21/22 successful
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="h-96 bg-muted/20 rounded-lg border p-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Plan execution timeline will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Swarm Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <SwarmVisualization metrics={exampleSwarmMetrics} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>MCP-Core:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Redis EventBus:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                  Simulated
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>A2A P2P Protocol:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>OpenAI Swarm:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>LangChain Quote Guard:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Autogen TurnGuard:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>SeniorManagerGPT:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Online
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuorumDashboard;
