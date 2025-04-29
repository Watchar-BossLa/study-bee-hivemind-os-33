
import React from 'react';
import StudyHabitsChart from '../StudyHabitsChart';
import PerformanceChart from '../PerformanceChart';
import SubjectProgressCards from '../SubjectProgressCards';
import type { StudyMetrics, PerformanceRecord, SubjectProgress } from '@/types/analytics';

interface OverviewTabProps {
  studyMetrics: StudyMetrics[] | undefined;
  performanceRecords: PerformanceRecord[] | undefined;
  subjectProgress: SubjectProgress[] | undefined;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  studyMetrics,
  performanceRecords,
  subjectProgress
}) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <StudyHabitsChart data={studyMetrics || []} />
        <PerformanceChart data={performanceRecords || []} />
      </div>
      <SubjectProgressCards data={subjectProgress || []} />
    </div>
  );
};

export default OverviewTab;
