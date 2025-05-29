
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFlashcardAnalyticsSummary } from '@/hooks/flashcards/useFlashcardAnalyticsSummary';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, CheckCheck, Clock, Calendar } from 'lucide-react';

const FlashcardAnalyticsOverview = () => {
  const { data: summary, isLoading } = useFlashcardAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No flashcard data available yet. Start reviewing cards to see your statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Retention Rate",
      value: `${summary.retention_rate.toFixed(1)}%`,
      icon: <Brain className="h-5 w-5 text-blue-500" />,
      description: "Overall memory retention"
    },
    {
      title: "Cards Mastered",
      value: summary.cards_mastered,
      total: summary.total_cards,
      icon: <CheckCheck className="h-5 w-5 text-green-500" />,
      description: "Cards you know well"
    },
    {
      title: "Study Streak",
      value: summary.streak_days,
      unit: "days",
      icon: <Calendar className="h-5 w-5 text-amber-500" />,
      description: "Consecutive days studying"
    },
    {
      title: "Today's Reviews",
      value: summary.reviewsToday,
      secondaryValue: summary.correctReviewsToday > 0 ? 
        `${(summary.correctReviewsToday / summary.reviewsToday * 100).toFixed(0)}% correct` : 
        undefined,
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      description: "Cards reviewed today"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              {card.unit && <span className="text-sm font-normal ml-1">{card.unit}</span>}
            </div>
            
            {card.total && (
              <div className="mt-2">
                <Progress 
                  value={card.total > 0 ? (Number(card.value) / card.total) * 100 : 0} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {card.value} of {card.total} cards
                </p>
              </div>
            )}
            
            {card.secondaryValue && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.secondaryValue}
              </p>
            )}
            
            {!card.total && !card.secondaryValue && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlashcardAnalyticsOverview;
