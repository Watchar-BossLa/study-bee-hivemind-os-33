
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HeatmapData {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

export function useFlashcardActivityHeatmap(days: number = 365) {
  const { user } = useAuth();

  const { data: rawData, isLoading } = useQuery({
    queryKey: ['flashcard-activity-heatmap', user?.id, days],
    queryFn: async () => {
      if (!user?.id) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('flashcard_reviews')
        .select('review_time')
        .eq('user_id', user.id)
        .gte('review_time', startDate.toISOString())
        .order('review_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
    staleTime: 300000, // 5 minutes
  });

  const heatmapData = useMemo((): HeatmapData[] => {
    if (!rawData) return [];

    // Group reviews by date
    const reviewsByDate: Record<string, number> = {};
    
    rawData.forEach(review => {
      const date = new Date(review.review_time).toISOString().split('T')[0];
      reviewsByDate[date] = (reviewsByDate[date] || 0) + 1;
    });

    // Generate complete date range
    const result: HeatmapData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      const count = reviewsByDate[dateString] || 0;
      let level = 0;
      
      // Calculate intensity level (0-4)
      if (count > 0) {
        if (count >= 50) level = 4;
        else if (count >= 30) level = 3;
        else if (count >= 15) level = 2;
        else level = 1;
      }

      result.push({
        date: dateString,
        count,
        level,
      });
    }

    return result;
  }, [rawData, days]);

  return {
    data: heatmapData,
    isLoading,
  };
}
