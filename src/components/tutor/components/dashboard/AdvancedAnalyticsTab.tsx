
import React, { useState, useEffect } from 'react';
import { 
  LearningVelocityMetrics, 
  PredictiveModel, 
  InterventionAlert, 
  advancedLearningAnalytics 
} from '../../services/analytics/AdvancedLearningAnalytics';
import { quantumLearningEngine } from '../../services/quantum/QuantumLearningEngineService';

// Import new components
import AnalyticsHeader from './analytics/AnalyticsHeader';
import AnalyticsLoadingState from './analytics/AnalyticsLoadingState';
import LearningVelocityMetricsGrid from './analytics/LearningVelocityMetricsGrid';
import PredictiveAnalysisCard from './analytics/PredictiveAnalysisCard';
import QuantumLearningStateCard from './analytics/QuantumLearningStateCard';
import LearningAlertsCard from './analytics/LearningAlertsCard';
import ConceptMasteryCard from './analytics/ConceptMasteryCard';

const AdvancedAnalyticsTab: React.FC = () => {
  const [learningMetrics, setLearningMetrics] = useState<LearningVelocityMetrics | null>(null);
  const [predictiveModel, setPredictiveModel] = useState<PredictiveModel | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<InterventionAlert[]>([]);
  const [quantumInsights, setQuantumInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      
      // Mock session data for demonstration
      const mockSessionData = [
        { concept: 'Linear Algebra', timeSpent: 1800, accuracy: 0.85, attempts: 3, difficulty: 0.7 },
        { concept: 'Calculus', timeSpent: 2400, accuracy: 0.72, attempts: 5, difficulty: 0.8 },
        { concept: 'Statistics', timeSpent: 1200, accuracy: 0.91, attempts: 2, difficulty: 0.5 },
        { concept: 'Probability', timeSpent: 1500, accuracy: 0.68, attempts: 4, difficulty: 0.9 }
      ];

      const userId = 'demo-user';
      const metrics = advancedLearningAnalytics.analyzeLearningVelocity(userId, mockSessionData);
      const prediction = advancedLearningAnalytics.generatePredictiveModel(userId, 'Linear Algebra', metrics);
      const alerts = advancedLearningAnalytics.getActiveAlerts(userId);
      const quantumState = quantumLearningEngine.getQuantumState ? quantumLearningEngine.getQuantumState(userId) : null;
      const quantum = quantumState?.coherence || 0.75;

      setLearningMetrics(metrics);
      setPredictiveModel(prediction);
      setActiveAlerts(alerts);
      setQuantumInsights({
        coherenceScore: quantum,
        entanglementLevel: 0.82,
        superpositionStates: ['Understanding Dominant', 'Mastery Achieved', 'Breakthrough Potential']
      });
      
      setIsLoading(false);
    };

    loadAnalytics();
  }, []);

  if (isLoading) {
    return <AnalyticsLoadingState />;
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader />

      {/* Learning Velocity Metrics */}
      {learningMetrics && (
        <LearningVelocityMetricsGrid metrics={learningMetrics} />
      )}

      {/* Predictive Model and Quantum Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictiveModel && (
          <PredictiveAnalysisCard predictiveModel={predictiveModel} />
        )}

        {quantumInsights && (
          <QuantumLearningStateCard quantumInsights={quantumInsights} />
        )}
      </div>

      {/* Active Alerts */}
      <LearningAlertsCard alerts={activeAlerts} />

      {/* Concept Mastery Breakdown */}
      {learningMetrics && (
        <ConceptMasteryCard conceptMastery={learningMetrics.conceptMastery} />
      )}
    </div>
  );
};

export default AdvancedAnalyticsTab;
