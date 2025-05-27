
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, Target, Zap, Clock, Award } from 'lucide-react';
import { exportRLPolicy } from '@/utils/spacedRepetition';

interface RLMetrics {
  averageReward: number;
  explorationRate: number;
  policyEntropy: number;
  learningProgress: Array<{
    session: number;
    reward: number;
    accuracy: number;
    efficiency: number;
  }>;
  userPerformance: {
    retentionRate: number;
    learningVelocity: number;
    cognitiveLoad: number;
    streakDays: number;
  };
  algorithmComparison: {
    basicSM2: { accuracy: number; efficiency: number };
    enhancedRL: { accuracy: number; efficiency: number };
    improvement: number;
  };
}

const SpacedRepetitionAnalytics: React.FC = () => {
  const { data: rlMetrics, isLoading } = useQuery({
    queryKey: ['rl-spaced-repetition-metrics'],
    queryFn: async (): Promise<RLMetrics> => {
      // In production, this would fetch from backend analytics service
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        averageReward: 0.72,
        explorationRate: 0.1,
        policyEntropy: 1.85,
        learningProgress: Array.from({ length: 20 }, (_, i) => ({
          session: i + 1,
          reward: 0.3 + (i * 0.025) + (Math.random() - 0.5) * 0.1,
          accuracy: 0.6 + (i * 0.015) + (Math.random() - 0.5) * 0.05,
          efficiency: 0.7 + (i * 0.01) + (Math.random() - 0.5) * 0.08
        })),
        userPerformance: {
          retentionRate: 87.3,
          learningVelocity: 1.24,
          cognitiveLoad: 0.45,
          streakDays: 12
        },
        algorithmComparison: {
          basicSM2: { accuracy: 78.2, efficiency: 65.8 },
          enhancedRL: { accuracy: 87.3, efficiency: 82.1 },
          improvement: 15.7
        }
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; excellent: number }) => {
    if (value >= thresholds.excellent) return 'text-green-600';
    if (value >= thresholds.good) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Spaced Repetition Analytics</h2>
          <p className="text-muted-foreground">
            Reinforcement Learning optimization performance and user metrics
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Brain className="h-3 w-3 mr-1" />
          RL-Optimized
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Reward</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(rlMetrics?.averageReward || 0, { good: 0.5, excellent: 0.7 })}`}>
                  {rlMetrics?.averageReward.toFixed(3)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Policy performance score
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(rlMetrics?.userPerformance.retentionRate || 0, { good: 80, excellent: 85 })}`}>
                  {rlMetrics?.userPerformance.retentionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Long-term memory retention
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Velocity</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(rlMetrics?.userPerformance.learningVelocity || 0, { good: 1.0, excellent: 1.2 })}`}>
                  {rlMetrics?.userPerformance.learningVelocity.toFixed(2)}x
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rate of skill acquisition
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cognitive Load</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(1 - (rlMetrics?.userPerformance.cognitiveLoad || 0), { good: 0.5, excellent: 0.7 })}`}>
                  {((1 - (rlMetrics?.userPerformance.cognitiveLoad || 0)) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mental effort efficiency
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            RL Policy Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={rlMetrics?.learningProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis domain={[0, 1]} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  value.toFixed(3),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="reward" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Average Reward"
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Accuracy"
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Efficiency"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Algorithm Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Basic SM-2 Accuracy</span>
                  <span className="text-sm text-muted-foreground">
                    {rlMetrics?.algorithmComparison.basicSM2.accuracy.toFixed(1)}%
                  </span>
                </div>
                <Progress value={rlMetrics?.algorithmComparison.basicSM2.accuracy} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Enhanced RL Accuracy</span>
                  <span className="text-sm text-muted-foreground">
                    {rlMetrics?.algorithmComparison.enhancedRL.accuracy.toFixed(1)}%
                  </span>
                </div>
                <Progress value={rlMetrics?.algorithmComparison.enhancedRL.accuracy} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Improvement</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    +{rlMetrics?.algorithmComparison.improvement.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Study Streak & Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Current Streak</span>
                  <span className="text-lg font-bold text-blue-600">
                    {rlMetrics?.userPerformance.streakDays} days
                  </span>
                </div>
                <Progress value={(rlMetrics?.userPerformance.streakDays || 0) / 30 * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Progress toward 30-day milestone
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Exploration Rate</span>
                  <span className="text-sm text-muted-foreground">
                    {((rlMetrics?.explorationRate || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress value={(rlMetrics?.explorationRate || 0) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  RL policy exploration vs exploitation
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Policy Entropy</span>
                  <span className="text-sm text-muted-foreground">
                    {rlMetrics?.policyEntropy.toFixed(2)}
                  </span>
                </div>
                <Progress value={(rlMetrics?.policyEntropy || 0) / 3 * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Action diversity (higher = more adaptive)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpacedRepetitionAnalytics;
