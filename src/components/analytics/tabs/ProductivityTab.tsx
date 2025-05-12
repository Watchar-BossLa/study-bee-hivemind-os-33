
import React from 'react';
import ProductivityHeatmap from '../ProductivityHeatmap';
import StudyHabitsChart from '../StudyHabitsChart';
import type { FocusInterval, StudyMetrics } from '@/types/analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from 'lucide-react';

interface ProductivityTabProps {
  focusIntervals: FocusInterval[] | undefined;
  studyMetrics: StudyMetrics[] | undefined;
}

const ProductivityTab: React.FC<ProductivityTabProps> = ({ 
  focusIntervals,
  studyMetrics
}) => {
  // Transform the data to match the expected format
  const heatmapData = focusIntervals?.map(interval => ({
    date: interval.date,
    hour: interval.hour,
    intensity: interval.productivity_score / 100 // Convert productivity score to intensity (0-1 range)
  })) || [];
  
  // Calculate productivity metrics for summary
  const calculateProductivityMetrics = () => {
    if (!studyMetrics || studyMetrics.length === 0) {
      return { totalTime: 0, avgFocus: 0, mostProductiveDay: 'N/A' };
    }

    const totalTime = studyMetrics.reduce((sum, day) => sum + day.total_study_time_minutes, 0);
    const avgFocus = studyMetrics.reduce((sum, day) => sum + day.focus_score, 0) / studyMetrics.length;
    
    // Find most productive day (highest focus score)
    const mostProductiveMetric = studyMetrics.reduce((prev, current) => 
      (prev.focus_score > current.focus_score) ? prev : current
    );
    const mostProductiveDay = new Date(mostProductiveMetric.date).toLocaleDateString('en-US', {
      weekday: 'long'
    });
    
    return { totalTime, avgFocus, mostProductiveDay };
  };
  
  const metrics = calculateProductivityMetrics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Productivity Summary</CardTitle>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>SM-2+ RL Policy</span>
            </Badge>
          </div>
          <CardDescription>
            Analysis based on the reinforcement-tuned spaced-repetition algorithm mentioned in TSB section 6
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Total Study Time</span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-2xl font-bold">{metrics.totalTime} min</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Average Focus Score</span>
              <span className="text-2xl font-bold">{metrics.avgFocus.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Most Productive Day</span>
              <span className="text-2xl font-bold">{metrics.mostProductiveDay}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductivityHeatmap data={heatmapData} />
      <StudyHabitsChart data={studyMetrics || []} />
    </div>
  );
};

export default ProductivityTab;
