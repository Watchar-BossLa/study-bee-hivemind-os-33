
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, AlertTriangle } from 'lucide-react';
import InterventionDashboard from './interventions/InterventionDashboard';

const PredictiveInterventionTab: React.FC = () => {
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['intervention-system-status'],
    queryFn: async () => {
      // Simulate checking system status
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        isActive: true,
        lastAnalysis: new Date(),
        studentsMonitored: 1247,
        predictionAccuracy: 87.3,
        interventionsTriggered: 156,
        systemHealth: 'optimal'
      };
    },
    refetchInterval: 60000 // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Predictive Learning Intervention System</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Predictive Learning Intervention System</h2>
          <p className="text-muted-foreground">
            AI-powered early detection and personalized intervention platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={systemStatus?.systemHealth === 'optimal' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${
              systemStatus?.systemHealth === 'optimal' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            System {systemStatus?.systemHealth}
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students Monitored</p>
                <p className="text-2xl font-bold">{systemStatus?.studentsMonitored.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time learning pattern analysis
                </p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{systemStatus?.predictionAccuracy}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Model performance score
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Interventions</p>
                <p className="text-2xl font-bold text-orange-600">{systemStatus?.interventionsTriggered}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently being delivered
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Intervention Dashboard */}
      <InterventionDashboard />
    </div>
  );
};

export default PredictiveInterventionTab;
