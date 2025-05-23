
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { llmRouter } from '../../services/LLMRouter';
import { RouterRequest } from '../../types/router';
import { availableLLMs } from '../../services/models/llmModels';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const LLMRouterTab: React.FC = () => {
  const [sampleRequest, setSampleRequest] = useState<RouterRequest>({
    query: "Explain how photosynthesis works",
    task: "tutor",
    complexity: "medium",
    urgency: "medium",
    costSensitivity: "medium",
    contextLength: 2000
  });
  
  const [cacheEnabled, setCacheEnabled] = useState(true);
  
  // Fetch router metrics
  const { data: routerMetrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery({
    queryKey: ['llm-router-metrics'],
    queryFn: () => {
      const metrics = llmRouter.getPerformanceMetrics();
      const cacheStats = llmRouter.getCacheStats();
      const heuristics = llmRouter.getHeuristics();
      
      return { metrics, cacheStats, heuristics };
    }
  });
  
  // Fetch sample routing result
  const { data: routingResult, isLoading: routingLoading, refetch: refetchRouting } = useQuery({
    queryKey: ['llm-router-sample', sampleRequest],
    queryFn: () => {
      return llmRouter.getDetailedSelection(sampleRequest);
    }
  });
  
  // Reset metrics and cache
  const handleReset = () => {
    llmRouter.resetMetrics();
    refetchMetrics();
    refetchRouting();
  };
  
  // Toggle cache
  const handleToggleCache = (enabled: boolean) => {
    setCacheEnabled(enabled);
    // In a real implementation, this would call llmRouter.setCache(enabled)
  };
  
  // Prepare pie chart data for model usage
  const modelUsageData = React.useMemo(() => {
    if (!routerMetrics?.metrics) return [];
    
    const metricsArray = Array.from(routerMetrics.metrics.entries());
    return metricsArray.map(([modelId, metrics]) => ({
      name: availableLLMs.find(m => m.id === modelId)?.name || modelId,
      value: metrics.selectionCount
    })).filter(item => item.value > 0);
  }, [routerMetrics?.metrics]);
  
  // Prepare success rate data
  const successRateData = React.useMemo(() => {
    if (!routerMetrics?.metrics) return [];
    
    return Array.from(routerMetrics.metrics.entries())
      .map(([modelId, metrics]) => {
        const model = availableLLMs.find(m => m.id === modelId);
        return {
          name: model?.name || modelId,
          successRate: Math.round(metrics.successRate * 100),
          responseTime: Math.round(metrics.averageResponseTime),
          satisfaction: Math.round(metrics.userSatisfaction * 10) / 10
        };
      })
      .filter(item => item.successRate > 0);
  }, [routerMetrics?.metrics]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Smart LLM Router</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="cache-toggle"
              checked={cacheEnabled}
              onCheckedChange={handleToggleCache}
            />
            <Label htmlFor="cache-toggle">Enable Cache</Label>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Reset Metrics & Cache
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model Selection Rate</CardTitle>
            <CardDescription>
              Distribution of model usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Loading metrics...</p>
              </div>
            ) : modelUsageData.length === 0 ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">No model usage data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={modelUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {modelUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Model Performance</CardTitle>
            <CardDescription>
              Success rates and response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metricsLoading ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">Loading metrics...</p>
              </div>
            ) : successRateData.length === 0 ? (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">No performance data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    yAxisId="left"
                    dataKey="successRate" 
                    name="Success Rate (%)"
                    fill="#8884d8" 
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="responseTime" 
                    name="Avg Response (ms)"
                    fill="#82ca9d" 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="simulation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="simulation">Routing Simulation</TabsTrigger>
          <TabsTrigger value="heuristics">Heuristic Weights</TabsTrigger>
          <TabsTrigger value="cache">Cache Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="simulation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sample Request Routing</CardTitle>
              <CardDescription>
                See how the router would handle this request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task">Task</Label>
                    <select
                      id="task"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.task}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        task: e.target.value as any
                      })}
                    >
                      <option value="tutor">Tutoring</option>
                      <option value="qa">Question Answering</option>
                      <option value="summarization">Summarization</option>
                      <option value="code">Code Generation</option>
                      <option value="reasoning">Reasoning</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Complexity</Label>
                    <select
                      id="complexity"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.complexity}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        complexity: e.target.value as any
                      })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <select
                      id="urgency"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.urgency}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        urgency: e.target.value as any
                      })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="costSensitivity">Cost Sensitivity</Label>
                    <select
                      id="costSensitivity"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.costSensitivity}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        costSensitivity: e.target.value as any
                      })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contextLength">Context Length (tokens)</Label>
                    <input
                      id="contextLength"
                      type="number"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.contextLength || 0}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        contextLength: parseInt(e.target.value) || undefined
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="query">Query Sample</Label>
                    <input
                      id="query"
                      type="text"
                      className="w-full p-2 border rounded"
                      value={sampleRequest.query || ''}
                      onChange={(e) => setSampleRequest({
                        ...sampleRequest,
                        query: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <Button onClick={() => refetchRouting()}>
                  Simulate Route Selection
                </Button>
                
                {routingLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-muted-foreground">Running simulation...</p>
                  </div>
                ) : routingResult ? (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Selected Model: <span className="font-bold">{
                          availableLLMs.find(m => m.id === routingResult.modelId)?.name || routingResult.modelId
                        }</span></h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {Math.round(routingResult.confidence * 100)}%
                        </p>
                      </div>
                      <Badge>{routingResult.modelId}</Badge>
                    </div>
                    
                    {routingResult.estimatedCost !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Estimated Cost: ${routingResult.estimatedCost.toFixed(5)}</p>
                      </div>
                    )}
                    
                    {routingResult.estimatedLatency !== undefined && (
                      <div>
                        <p className="text-sm font-medium">Estimated Latency: {routingResult.estimatedLatency}ms</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Fallback Options:</p>
                      <div className="flex gap-2">
                        {routingResult.fallbackOptions.map((modelId) => (
                          <Badge key={modelId} variant="outline">
                            {availableLLMs.find(m => m.id === modelId)?.name || modelId}
                          </Badge>
                        ))}
                        {routingResult.fallbackOptions.length === 0 && (
                          <span className="text-sm text-muted-foreground">None available</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Reasoning:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
                        {routingResult.reasoningTrace.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heuristics">
          <Card>
            <CardHeader>
              <CardTitle>Routing Heuristics</CardTitle>
              <CardDescription>
                Weights and importance of different factors in model selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading heuristics...</p>
                </div>
              ) : !routerMetrics?.heuristics ? (
                <div className="h-60 flex items-center justify-center">
                  <p className="text-muted-foreground">No heuristics data available</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {routerMetrics.heuristics.map((heuristic, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{heuristic.name}</h4>
                        <span className="text-sm font-mono">Weight: {heuristic.weight.toFixed(1)}</span>
                      </div>
                      <Progress value={heuristic.weight * 20} className="h-2" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cache">
          <Card>
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
              <CardDescription>
                Performance of the router cache
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <div className="h-60 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading cache statistics...</p>
                </div>
              ) : !routerMetrics?.cacheStats ? (
                <div className="h-60 flex items-center justify-center">
                  <p className="text-muted-foreground">No cache statistics available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cache Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Cache Size</p>
                        <p className="text-2xl font-bold">{routerMetrics.cacheStats.size} entries</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hit Rate</p>
                        <p className="text-2xl font-bold">{(routerMetrics.cacheStats.hitRate * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cache Hits vs. Misses</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Hits', value: routerMetrics.cacheStats.hits },
                            { name: 'Misses', value: routerMetrics.cacheStats.misses }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          <Cell fill="#4ade80" />
                          <Cell fill="#f87171" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LLMRouterTab;
