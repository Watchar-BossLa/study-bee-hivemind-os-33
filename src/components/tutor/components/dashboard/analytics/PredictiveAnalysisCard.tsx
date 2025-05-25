
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';
import { PredictiveModel } from '../../../services/analytics/AdvancedLearningAnalytics';

interface PredictiveAnalysisCardProps {
  predictiveModel: PredictiveModel;
}

const PredictiveAnalysisCard: React.FC<PredictiveAnalysisCardProps> = ({ predictiveModel }) => {
  const getInterventionBadgeVariant = (intervention: string) => {
    switch (intervention) {
      case 'tutor_assistance': return 'destructive' as const;
      case 'alternative_approach': return 'secondary' as const;
      case 'review': return 'outline' as const;
      default: return 'default' as const;
    }
  };

  return (
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
  );
};

export default PredictiveAnalysisCard;
