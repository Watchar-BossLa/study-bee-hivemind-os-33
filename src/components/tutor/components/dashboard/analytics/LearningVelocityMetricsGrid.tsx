
import React from 'react';
import { TrendingUp, Brain, Zap, Activity } from 'lucide-react';
import { LearningVelocityMetrics } from '../../../services/analytics/AdvancedLearningAnalytics';
import MetricCard from './MetricCard';

interface LearningVelocityMetricsGridProps {
  metrics: LearningVelocityMetrics;
}

const LearningVelocityMetricsGrid: React.FC<LearningVelocityMetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <MetricCard
        title="Learning Rate"
        value={metrics.learningRate}
        icon={TrendingUp}
        color="text-green-500"
      />
      <MetricCard
        title="Retention Score"
        value={metrics.retentionScore}
        icon={Brain}
        color="text-blue-500"
      />
      <MetricCard
        title="Adaptation Speed"
        value={metrics.adaptationSpeed}
        icon={Zap}
        color="text-purple-500"
      />
      <MetricCard
        title="Cognitive Load"
        value={metrics.cognitiveLoadIndex}
        icon={Activity}
        color="text-orange-500"
      />
    </div>
  );
};

export default LearningVelocityMetricsGrid;
