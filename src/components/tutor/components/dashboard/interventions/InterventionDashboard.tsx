
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Brain, Target, TrendingUp, Users, Activity } from 'lucide-react';
import InterventionOverview from './InterventionOverview';
import ActiveInterventions from './ActiveInterventions';
import InterventionAnalytics from './InterventionAnalytics';
import RiskAssessment from './RiskAssessment';

const InterventionDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');

  // Mock data for demonstration - in real implementation, this would come from the intervention services
  const { data: interventionData, isLoading } = useQuery({
    queryKey: ['intervention-dashboard', selectedTimeframe],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        summary: {
          totalStudents: 1247,
          atRiskStudents: 89,
          activeInterventions: 156,
          successRate: 78.5,
          avgResponseTime: 2.3
        },
        interventions: [
          {
            id: '1',
            userId: 'user_1',
            studentName: 'Alex Johnson',
            type: 'tutor_assistance',
            priority: 'high',
            status: 'active',
            description: 'Struggling with calculus derivatives',
            createdAt: new Date('2024-01-15T10:30:00'),
            estimatedImpact: 0.85
          },
          {
            id: '2',
            userId: 'user_2',
            studentName: 'Sarah Wilson',
            type: 'content_adjustment',
            priority: 'medium',
            status: 'pending',
            description: 'Needs review of linear algebra basics',
            createdAt: new Date('2024-01-15T09:15:00'),
            estimatedImpact: 0.72
          },
          {
            id: '3',
            userId: 'user_3',
            studentName: 'Mike Chen',
            type: 'study_plan_modification',
            priority: 'low',
            status: 'completed',
            description: 'Irregular study patterns detected',
            createdAt: new Date('2024-01-14T16:45:00'),
            estimatedImpact: 0.68
          }
        ],
        riskAssessment: {
          highRisk: 12,
          mediumRisk: 34,
          lowRisk: 43,
          trends: {
            improving: 23,
            stable: 45,
            declining: 21
          }
        },
        analytics: {
          interventionTypes: [
            { type: 'tutor_assistance', count: 45, successRate: 82 },
            { type: 'content_adjustment', count: 67, successRate: 76 },
            { type: 'study_plan_modification', count: 34, successRate: 71 },
            { type: 'break_suggestion', count: 23, successRate: 89 }
          ],
          effectivenessOverTime: [
            { date: '2024-01-08', effectiveness: 76 },
            { date: '2024-01-09', effectiveness: 78 },
            { date: '2024-01-10', effectiveness: 75 },
            { date: '2024-01-11', effectiveness: 81 },
            { date: '2024-01-12', effectiveness: 79 },
            { date: '2024-01-13', effectiveness: 83 },
            { date: '2024-01-14', effectiveness: 78 },
            { date: '2024-01-15', effectiveness: 82 }
          ]
        }
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Intervention Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

  const { summary } = interventionData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Intervention Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and management of learning interventions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Button>
            ))}
          </div>
          <Badge variant="outline" className="text-sm">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{summary?.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-orange-600">{summary?.atRiskStudents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Interventions</p>
                <p className="text-2xl font-bold text-green-600">{summary?.activeInterventions}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-purple-600">{summary?.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-indigo-600">{summary?.avgResponseTime}h</p>
              </div>
              <Brain className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <InterventionOverview data={interventionData} />
        </TabsContent>

        <TabsContent value="active">
          <ActiveInterventions interventions={interventionData?.interventions || []} />
        </TabsContent>

        <TabsContent value="analytics">
          <InterventionAnalytics analytics={interventionData?.analytics} />
        </TabsContent>

        <TabsContent value="risk">
          <RiskAssessment riskData={interventionData?.riskAssessment} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InterventionDashboard;
