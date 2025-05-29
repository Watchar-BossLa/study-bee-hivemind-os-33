
import React from 'react';
import { useFlashcardAnalyticsSummary } from '@/hooks/flashcards/useFlashcardAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, CheckCheck, Clock, Calendar } from 'lucide-react';
import { OverviewMetricCard } from './components/OverviewMetricCard';

const FlashcardAnalyticsOverview = () => {
  const { data: summary, isLoading } = useFlashcardAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No flashcard data available yet. Start reviewing cards to see your statistics.
      </div>
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
        <OverviewMetricCard key={i} {...card} />
      ))}
    </div>
  );
};

export default FlashcardAnalyticsOverview;
