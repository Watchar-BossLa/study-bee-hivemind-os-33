
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ConceptMasteryCardProps {
  conceptMastery: Record<string, number>;
}

const ConceptMasteryCard: React.FC<ConceptMasteryCardProps> = ({ conceptMastery }) => {
  if (Object.keys(conceptMastery).length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept Mastery Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(conceptMastery).map(([concept, mastery]) => (
            <div key={concept} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{concept}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(Number(mastery) * 100)}%
                </span>
              </div>
              <Progress value={Number(mastery) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConceptMasteryCard;
