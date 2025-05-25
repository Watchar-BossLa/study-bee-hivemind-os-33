import { LearningVelocityMetrics, PredictiveModel, InterventionAlert, SessionData } from '../types/AnalyticsTypes';
import { VelocityCalculator } from './VelocityCalculator';
import { PredictiveModelGenerator } from './PredictiveModelGenerator';
import { InterventionAlertManager } from './InterventionAlertManager';
import { QuantumInsightsCalculator } from './QuantumInsightsCalculator';

export class AdvancedLearningAnalytics {
  private learningHistory: Map<string, LearningVelocityMetrics[]> = new Map();
  private velocityCalculator: VelocityCalculator;
  private predictiveGenerator: PredictiveModelGenerator;
  private alertManager: InterventionAlertManager;
  private quantumCalculator: QuantumInsightsCalculator;

  constructor() {
    this.velocityCalculator = new VelocityCalculator();
    this.predictiveGenerator = new PredictiveModelGenerator();
    this.alertManager = new InterventionAlertManager();
    this.quantumCalculator = new QuantumInsightsCalculator();
  }

  public analyzeLearningVelocity(userId: string, sessionData: SessionData[]): LearningVelocityMetrics {
    const metrics = this.velocityCalculator.calculateLearningVelocity(userId, sessionData, this.learningHistory);
    this.updateLearningHistory(userId, metrics);
    return metrics;
  }

  public generatePredictiveModel(
    userId: string, 
    targetConcept: string,
    currentMetrics: LearningVelocityMetrics
  ): PredictiveModel {
    return this.predictiveGenerator.generatePredictiveModel(userId, targetConcept, currentMetrics, this.learningHistory);
  }

  public generateEarlyInterventionAlert(
    userId: string,
    concept: string,
    metrics: LearningVelocityMetrics,
    prediction: PredictiveModel
  ): InterventionAlert | null {
    return this.alertManager.generateEarlyInterventionAlert(userId, concept, metrics, prediction);
  }

  public getActiveAlerts(userId: string): InterventionAlert[] {
    return this.alertManager.getActiveAlerts(userId);
  }

  public resolveAlert(alertId: string): void {
    this.alertManager.resolveAlert(alertId);
  }

  public getQuantumLearningInsights(userId: string) {
    return this.quantumCalculator.getQuantumLearningInsights(userId);
  }

  private updateLearningHistory(userId: string, metrics: LearningVelocityMetrics): void {
    const history = this.learningHistory.get(userId) || [];
    history.push(metrics);
    
    // Keep only last 20 sessions to prevent memory bloat
    if (history.length > 20) {
      history.shift();
    }
    
    this.learningHistory.set(userId, history);
  }
}

// Create and export singleton instance
export const advancedLearningAnalytics = new AdvancedLearningAnalytics();
