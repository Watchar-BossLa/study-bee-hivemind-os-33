
import React from 'react';
import StudyRecommendations from '../StudyRecommendations';
import WeakAreasTable from '../WeakAreasTable';
import type { StudyRecommendation, WeakAreaRecommendation } from '@/types/analytics';

interface RecommendationsTabProps {
  studyRecommendations: StudyRecommendation[] | undefined;
  weakAreaRecommendations: WeakAreaRecommendation[] | undefined;
}

const RecommendationsTab: React.FC<RecommendationsTabProps> = ({ 
  studyRecommendations,
  weakAreaRecommendations
}) => {
  return (
    <div className="space-y-6">
      <StudyRecommendations recommendations={studyRecommendations || []} />
      <WeakAreasTable data={weakAreaRecommendations || []} />
    </div>
  );
};

export default RecommendationsTab;
