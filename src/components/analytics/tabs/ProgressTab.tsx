
import React from 'react';
import SubjectProgressCards from '../SubjectProgressCards';
import PerformanceChart from '../PerformanceChart';
import type { PerformanceRecord, SubjectProgress } from '@/types/analytics';

interface ProgressTabProps {
  performanceRecords: PerformanceRecord[] | undefined;
  subjectProgress: SubjectProgress[] | undefined;
}

const ProgressTab: React.FC<ProgressTabProps> = ({ 
  performanceRecords,
  subjectProgress
}) => {
  return (
    <div className="space-y-6">
      <SubjectProgressCards data={subjectProgress || []} />
      <PerformanceChart data={performanceRecords || []} />
    </div>
  );
};

export default ProgressTab;
