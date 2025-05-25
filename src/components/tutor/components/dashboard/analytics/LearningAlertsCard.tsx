
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Target, Clock } from 'lucide-react';
import { InterventionAlert } from '../../../services/analytics/AdvancedLearningAnalytics';

interface LearningAlertsCardProps {
  alerts: InterventionAlert[];
}

const LearningAlertsCard: React.FC<LearningAlertsCardProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Active Learning Alerts
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
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
  );
};

export default LearningAlertsCard;
