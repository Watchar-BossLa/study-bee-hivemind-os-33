
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
  return (
    <div className="space-y-6">
      <ProductivityHeatmap data={focusIntervals || []} />
      <StudyHabitsChart data={studyMetrics || []} />
    </div>
  );
};

export default ProductivityTab;
