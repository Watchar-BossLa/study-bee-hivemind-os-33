import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Target,
  Activity,
  Atom,
  BarChart3
} from 'lucide-react';
import { advancedLearningAnalytics, LearningVelocityMetrics, PredictiveModel, InterventionAlert } from '@/components/tutor/services/analytics/AdvancedLearningAnalytics';
import { quantumLearningEngine } from '@/components/tutor/services/quantum/QuantumLearningEngine';

const AdvancedAnalyticsTab: React.FC = () => {
  const [learningMetrics, setLearningMetrics] = useState<LearningVelocityMetrics | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<InterventionAlert[]>([]);
  const [quantumInsights, setQuantumInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Mock session data for demonstration
      const mockSessionData = [
        { concept: 'Linear Algebra', timeSpent: 1800, accuracy: 0.85, attempts: 3, difficulty: 0.7 },
        { concept: 'Calculus', timeSpent: 2400, accuracy: 0.72, attempts: 5, difficulty: 0.8 },
        { concept: 'Statistics', timeSpent: 1200, accuracy: 0.91, attempts: 2, difficulty: 0.5 },
        { concept: 'Probability', timeSpent: 1500, accuracy: 0.68, attempts: 4, difficulty: 0.9 }
      ];

      const userId = 'demo-user';
      const metrics = advancedLearningAnalytics.analyzeLearningVelocity(userId, mockSessionData);
      const prediction = advancedLearningAnalytics.generatePredictiveModel(userId, 'Linear Algebra', metrics);
      const alerts = advancedLearningAnalytics.getActiveAlerts(userId);
      const quantum = quantumLearningEngine.getQuantumCoherence ? quantumLearningEngine.getQuantumCoherence(userId) : 0.75;

      setLearningMetrics(metrics);
      setPredictiveModel(prediction);
      setActiveAlerts(alerts);
      setQuantumInsights({
        coherenceScore: quantum,
        entanglementLevel: 0.82,
        superpositionStates: ['Understanding Dominant', 'Mastery Achieved', 'Breakthrough Potential']
      });
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getInterventionBadgeVariant = (intervention: string) => {
    switch (intervention) {
      case 'tutor_assistance': return 'destructive' as const;
      case 'alternative_approach': return 'secondary' as const;
      case 'review': return 'outline' as const;
      default: return 'default' as const;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Learning Analytics</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Atom className="h-3 w-3" />
            Quantum-Enhanced
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Learning Velocity Metrics */}
      {learningMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Learning Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(learningMetrics.learningRate * 100)}%
              </div>
              <Progress value={learningMetrics.learningRate * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-blue-500" />
                Retention Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(learningMetrics.retentionScore * 100)}%
              </div>
              <Progress value={learningMetrics.retentionScore * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                Adaptation Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(learningMetrics.adaptationSpeed * 100)}%
              </div>
              <Progress value={learningMetrics.adaptationSpeed * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                Cognitive Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(learningMetrics.cognitiveLoadIndex * 100)}%
              </div>
              <Progress value={learningMetrics.cognitiveLoadIndex * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Predictive Model and Quantum Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictive Analysis */}
        {predictiveModel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Predictive Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Difficulty Prediction</div>
                  <div className="text-xl font-bold">
                    {Math.round(predictiveModel.difficultyPrediction * 100)}%
                  </div>
                  <Progress value={predictiveModel.difficultyPrediction * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Time to Mastery</div>
                  <div className="text-xl font-bold">
                    {Math.round(predictiveModel.timeToMastery)} sessions
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Recommended Intervention</div>
                <Badge variant={getInterventionBadgeVariant(predictiveModel.recommendedIntervention)}>
                  {predictiveModel.recommendedIntervention.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Confidence Level</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium">
                    {Math.round(predictiveModel.confidenceLevel * 100)}%
                  </div>
                  <Progress value={predictiveModel.confidenceLevel * 100} className="h-2 flex-1" />
                </div>
              </div>

              {predictiveModel.strugglingConcepts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Struggling Concepts</div>
                  <div className="flex flex-wrap gap-1">
                    {predictiveModel.strugglingConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quantum Learning Insights */}
        {quantumInsights && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Atom className="h-5 w-5" />
                Quantum Learning State
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Coherence Score</div>
                  <div className="text-xl font-bold text-purple-600">
                    {Math.round(quantumInsights.coherenceScore * 100)}%
                  </div>
                  <Progress value={quantumInsights.coherenceScore * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Entanglement Level</div>
                  <div className="text-xl font-bold text-blue-600">
                    {Math.round(quantumInsights.entanglementLevel * 100)}%
                  </div>
                  <Progress value={quantumInsights.entanglementLevel * 100} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Superposition States</div>
                <div className="space-y-1">
                  {quantumInsights.superpositionStates.map((state: string, index: number) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {state}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Atom className="h-4 w-4 mr-2" />
                  Optimize Quantum Path
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Learning Alerts
              <Badge variant="secondary">{activeAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                      <Badge variant="outline" className="text-xs">
                        {alert.alertType.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm mb-2">
                      {alert.description}
                    </AlertDescription>
                    <div className="space-y-1">
                      {alert.suggestedActions.map((action, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Concept Mastery Breakdown */}
      {learningMetrics && Object.keys(learningMetrics.conceptMastery).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Concept Mastery Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(learningMetrics.conceptMastery).map(([concept, mastery]) => (
                <div key={concept} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{concept}</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(mastery * 100)}%
                    </span>
                  </div>
                  <Progress value={mastery * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedAnalyticsTab;
