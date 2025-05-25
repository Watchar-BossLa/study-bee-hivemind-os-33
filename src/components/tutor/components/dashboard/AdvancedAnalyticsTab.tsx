
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Zap, AlertTriangle, TrendingUp, Activity, Atom } from 'lucide-react';
import { advancedLearningAnalytics, LearningVelocityMetrics, InterventionAlert, PredictiveModel } from '@/components/tutor/services/analytics/AdvancedLearningAnalytics';
import { quantumLearningEngine } from '@/components/tutor/services/quantum/QuantumLearningEngine';

const AdvancedAnalyticsTab: React.FC = () => {
  const [selectedUserId] = useState('demo-user-001');
  const [activeAlerts, setActiveAlerts] = useState<InterventionAlert[]>([]);
  const [learningMetrics, setLearningMetrics] = useState<LearningVelocityMetrics | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [quantumInsights, setQuantumInsights] = useState<any>(null);

  // Simulate real-time learning data
  useEffect(() => {
    const generateMockSessionData = () => {
      const concepts = ['algebra', 'calculus', 'statistics', 'geometry', 'trigonometry'];
      return concepts.map(concept => ({
        concept,
        timeSpent: Math.random() * 120000 + 30000, // 30s to 2min
        accuracy: Math.random() * 0.6 + 0.4, // 40% to 100%
        attempts: Math.floor(Math.random() * 5) + 1,
        difficulty: Math.random()
      }));
    };

    const interval = setInterval(() => {
      const sessionData = generateMockSessionData();
      
      // Generate learning analytics
      const metrics = advancedLearningAnalytics.analyzeLearningVelocity(selectedUserId, sessionData);
      setLearningMetrics(metrics);
      
      // Generate predictive model
      const prediction = advancedLearningAnalytics.generatePredictiveModel(
        selectedUserId,
        'algebra',
        metrics
      );
      setPredictiveModel(prediction);
      
      // Check for intervention alerts
      const alert = advancedLearningAnalytics.generateEarlyInterventionAlert(
        selectedUserId,
        'algebra',
        metrics,
        prediction
      );
      
      if (alert) {
        setActiveAlerts(prev => [...prev.filter(a => a.id !== alert.id), alert]);
      }
      
      // Initialize quantum learning if not exists
      const concepts = sessionData.map(s => s.concept);
      quantumLearningEngine.initializeQuantumLearner(selectedUserId, concepts);
      
      // Apply quantum gates based on session data
      sessionData.forEach(session => {
        quantumLearningEngine.applyQuantumLearningGate(
          selectedUserId,
          session.concept,
          'custom',
          {
            correct: session.accuracy > 0.7,
            timeSpent: session.timeSpent,
            difficulty: session.difficulty,
            confidence: session.accuracy
          }
        );
      });
      
      // Get quantum insights
      const insights = quantumLearningEngine.getQuantumLearningInsights(selectedUserId);
      setQuantumInsights(insights);
      
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedUserId]);

  const formatMetricsForChart = (metrics: LearningVelocityMetrics) => {
    return Object.entries(metrics.conceptMastery).map(([concept, mastery]) => ({
      concept,
      mastery: Math.round(mastery * 100),
      difficulty: Math.round(Math.random() * 100),
      engagement: Math.round((metrics.adaptationSpeed + metrics.learningRate) * 50)
    }));
  };

  const getAlertColor = (severity: InterventionAlert['severity']) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity];
  };

  const resolveAlert = (alertId: string) => {
    advancedLearningAnalytics.resolveAlert(alertId);
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Advanced Learning Analytics
        </h2>
        <Badge variant="outline" className="text-sm">
          Quantum-Enhanced AI Analytics
        </Badge>
      </div>

      {/* Alert System */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.slice(0, 3).map((alert) => (
            <Alert key={alert.id} className={`border-l-4 ${getAlertColor(alert.severity)}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <div>
                  <strong>{alert.concept}:</strong> {alert.description}
                  <div className="mt-1 text-xs">
                    Suggested: {alert.suggestedActions[0]}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="learning-velocity" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="learning-velocity">Learning Velocity</TabsTrigger>
          <TabsTrigger value="predictive-model">Predictive AI</TabsTrigger>
          <TabsTrigger value="quantum-insights">Quantum Insights</TabsTrigger>
          <TabsTrigger value="intervention-system">Interventions</TabsTrigger>
        </TabsList>

        <TabsContent value="learning-velocity" className="space-y-4">
          {learningMetrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Learning Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(learningMetrics.learningRate * 100)}%
                    </div>
                    <Progress value={learningMetrics.learningRate * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Retention Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(learningMetrics.retentionScore * 100)}%
                    </div>
                    <Progress value={learningMetrics.retentionScore * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Cognitive Load
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(learningMetrics.cognitiveLoadIndex * 100)}%
                    </div>
                    <Progress 
                      value={learningMetrics.cognitiveLoadIndex * 100} 
                      className="mt-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Adaptation Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(learningMetrics.adaptationSpeed * 100)}%
                    </div>
                    <Progress value={learningMetrics.adaptationSpeed * 100} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Concept Mastery Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={formatMetricsForChart(learningMetrics)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="concept" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar 
                        name="Mastery" 
                        dataKey="mastery" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        fillOpacity={0.3} 
                      />
                      <Radar 
                        name="Engagement" 
                        dataKey="engagement" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        fillOpacity={0.3} 
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="predictive-model" className="space-y-4">
          {predictiveModel && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Difficulty Prediction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {Math.round(predictiveModel.difficultyPrediction * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {Math.round(predictiveModel.confidenceLevel * 100)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Time to Mastery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(predictiveModel.timeToMastery)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">sessions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Struggling Concepts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {predictiveModel.strugglingConcepts.length}
                    </div>
                    <div className="mt-2 space-y-1">
                      {predictiveModel.strugglingConcepts.slice(0, 2).map((concept, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Intervention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={predictiveModel.recommendedIntervention === 'none' ? 'default' : 'destructive'}
                      className="capitalize"
                    >
                      {predictiveModel.recommendedIntervention.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Based on AI analysis of learning patterns and predictive modeling
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="quantum-insights" className="space-y-4">
          {quantumInsights && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Atom className="h-4 w-4" />
                      Quantum Coherence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.round(quantumInsights.coherenceScore * 100)}%
                    </div>
                    <Progress value={quantumInsights.coherenceScore * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Entanglement Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-indigo-600">
                      {Math.round(quantumInsights.entanglementLevel * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Concept interconnectedness
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Superposition States</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-cyan-600">
                      {quantumInsights.superpositionStates.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">active states</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Quantum Learning States</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {quantumInsights.superpositionStates.slice(0, 5).map((state: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm font-medium">{state}</span>
                        <Badge variant="outline" className="text-xs">
                          Quantum State
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="intervention-system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Early Intervention System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Active Monitoring</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Learning velocity tracking</li>
                    <li>• Cognitive load assessment</li>
                    <li>• Concept confusion detection</li>
                    <li>• Attention drift monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Intervention Triggers</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Difficulty prediction > 70%</li>
                    <li>• Cognitive load > 80%</li>
                    <li>• Learning plateau detected</li>
                    <li>• Rapid performance decline</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No active alerts. System monitoring in progress.
                </p>
              ) : (
                <div className="space-y-2">
                  {activeAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={getAlertColor(alert.severity)}>
                            {alert.alertType.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm mt-1">{alert.description}</p>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Suggested Actions:</p>
                            <ul className="text-xs text-muted-foreground mt-1">
                              {alert.suggestedActions.map((action, index) => (
                                <li key={index}>• {action}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsTab;
