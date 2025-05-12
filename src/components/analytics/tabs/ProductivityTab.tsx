
import React from 'react';
import ProductivityHeatmap from '../ProductivityHeatmap';
import StudyHabitsChart from '../StudyHabitsChart';
import type { FocusInterval, StudyMetrics } from '@/types/analytics';

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

  return (
    <div className="space-y-6">
      <ProductivityHeatmap data={heatmapData} />
      <StudyHabitsChart data={studyMetrics || []} />
    </div>
  );
};

export default ProductivityTab;
