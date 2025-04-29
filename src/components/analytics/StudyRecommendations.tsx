
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StudyRecommendation } from "@/types/analytics";

interface StudyRecommendationsProps {
  recommendations: StudyRecommendation[];
}

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
    default: return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  }
};

const StudyRecommendations: React.FC<StudyRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No study recommendations available yet. Complete some courses or assessments to get personalized recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Study Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <div 
            key={recommendation.id} 
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{recommendation.subject}</h3>
              <Badge className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-3">{recommendation.reason}</p>
            
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Recommended: {recommendation.recommended_time_minutes} minutes
              </span>
            </div>
            
            {recommendation.suggested_resources && recommendation.suggested_resources.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Suggested Resources:</p>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {recommendation.suggested_resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Start Studying</span>
              </Button>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudyRecommendations;
