
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface InterventionOverviewProps {
  data: any;
}

const InterventionOverview: React.FC<InterventionOverviewProps> = ({ data }) => {
  const recentInterventions = data?.interventions?.slice(0, 5) || [];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Interventions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentInterventions.map((intervention: any) => (
            <div key={intervention.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(intervention.priority)}`} />
                <div>
                  <p className="font-medium">{intervention.studentName}</p>
                  <p className="text-sm text-muted-foreground">{intervention.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(intervention.status)}
                    <Badge variant="outline" className="text-xs">
                      {intervention.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {intervention.createdAt.toLocaleDateString()}
                </p>
                <p className="text-sm font-medium">
                  {Math.round(intervention.estimatedImpact * 100)}% impact
                </p>
              </div>
            </div>
          ))}
          
          <Button variant="outline" className="w-full mt-4">
            View All Interventions
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Intervention Statistics */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Intervention Effectiveness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tutor Assistance</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Content Adjustment</span>
                <span className="text-sm font-medium">76%</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Plan Modification</span>
                <span className="text-sm font-medium">71%</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Break Suggestion</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review High-Risk Students
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Pending Interventions
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Batch Interventions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterventionOverview;
