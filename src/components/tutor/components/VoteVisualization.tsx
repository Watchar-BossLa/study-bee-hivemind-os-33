
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CouncilVote } from '../types/councils';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle } from 'lucide-react';

interface VoteVisualizationProps {
  votes: CouncilVote[];
  consensus?: string;
  confidenceScore?: number;
  isActive?: boolean;
  title?: string;
}

export const VoteVisualization = ({
  votes,
  consensus,
  confidenceScore = 0,
  isActive = false,
  title = "Council Deliberation"
}: VoteVisualizationProps) => {
  // Group votes by suggestion
  const suggestionGroups: Record<string, CouncilVote[]> = {};
  votes.forEach(vote => {
    if (!suggestionGroups[vote.suggestion]) {
      suggestionGroups[vote.suggestion] = [];
    }
    suggestionGroups[vote.suggestion].push(vote);
  });
  
  // Sort suggestions by vote count
  const sortedSuggestions = Object.entries(suggestionGroups)
    .sort(([, votesA], [, votesB]) => votesB.length - votesA.length)
    .map(([suggestion, votes]) => ({
      suggestion,
      count: votes.length,
      percentage: (votes.length / Math.max(1, votes.length)) * 100,
      isConsensus: suggestion === consensus,
      votes
    }));
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {isActive ? (
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              Active
            </Badge>
          ) : consensus ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Consensus Reached
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800">
              No Consensus
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Overall consensus confidence */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Consensus Confidence</span>
            <span>{Math.round(confidenceScore * 100)}%</span>
          </div>
          <Progress value={confidenceScore * 100} className="h-2" />
        </div>
        
        {/* Vote distribution */}
        <div className="space-y-3">
          {sortedSuggestions.map(({ suggestion, count, percentage, isConsensus }) => (
            <div key={suggestion} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  {isConsensus && <Check className="h-4 w-4 text-green-500" />}
                  <span className={isConsensus ? "font-medium" : ""}>
                    {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                  </span>
                </div>
                <span>{count} vote{count !== 1 ? 's' : ''}</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isConsensus ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {votes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-2 opacity-20" />
            <p>No votes have been cast yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
