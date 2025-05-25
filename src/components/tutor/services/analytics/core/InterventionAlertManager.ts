
import { InterventionAlert, LearningVelocityMetrics, PredictiveModel } from '../types/AnalyticsTypes';

export class InterventionAlertManager {
  private interventionAlerts: InterventionAlert[] = [];

  public generateEarlyInterventionAlert(
    userId: string,
    concept: string,
    metrics: LearningVelocityMetrics,
    prediction: PredictiveModel
  ): InterventionAlert | null {
    const shouldAlert = this.shouldTriggerAlert(metrics, prediction);
    if (!shouldAlert) return null;

    const alert: InterventionAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      alertType: this.determineAlertType(metrics, prediction),
      severity: this.determineSeverity(prediction),
      concept,
      description: this.generateAlertDescription(metrics, prediction),
      suggestedActions: this.generateSuggestedActions(prediction),
      timestamp: new Date(),
      resolved: false
    };

    this.interventionAlerts.push(alert);
    return alert;
  }

  public getActiveAlerts(userId: string): InterventionAlert[] {
    return this.interventionAlerts.filter(alert => 
      alert.userId === userId && !alert.resolved
    );
  }

  public resolveAlert(alertId: string): void {
    const alert = this.interventionAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  private shouldTriggerAlert(metrics: LearningVelocityMetrics, prediction: PredictiveModel): boolean {
    return (
      prediction.difficultyPrediction > 0.7 ||
      metrics.cognitiveLoadIndex > 0.8 ||
      prediction.strugglingConcepts.length > 2 ||
      metrics.learningRate < 0.3
    );
  }

  private determineAlertType(
    metrics: LearningVelocityMetrics, 
    prediction: PredictiveModel
  ): InterventionAlert['alertType'] {
    if (metrics.learningRate < 0.2) return 'learning_plateau';
    if (prediction.strugglingConcepts.length > 3) return 'concept_confusion';
    if (metrics.retentionScore < 0.4) return 'rapid_decline';
    return 'attention_drift';
  }

  private determineSeverity(prediction: PredictiveModel): InterventionAlert['severity'] {
    if (prediction.difficultyPrediction > 0.8) return 'critical';
    if (prediction.difficultyPrediction > 0.7) return 'high';
    if (prediction.strugglingConcepts.length > 2) return 'medium';
    return 'low';
  }

  private generateAlertDescription(metrics: LearningVelocityMetrics, prediction: PredictiveModel): string {
    const strugglingCount = prediction.strugglingConcepts.length;
    const cognitiveLoad = Math.round(metrics.cognitiveLoadIndex * 100);
    
    return `Student showing ${strugglingCount} struggling concepts with ${cognitiveLoad}% cognitive load. Predicted difficulty: ${Math.round(prediction.difficultyPrediction * 100)}%`;
  }

  private generateSuggestedActions(prediction: PredictiveModel): string[] {
    const actions: string[] = [];
    
    if (prediction.recommendedIntervention === 'tutor_assistance') {
      actions.push('Connect with AI tutor for personalized guidance');
      actions.push('Schedule focused review session');
    }
    
    if (prediction.recommendedIntervention === 'alternative_approach') {
      actions.push('Try different learning modality (visual/auditory)');
      actions.push('Break down concepts into smaller chunks');
    }
    
    if (prediction.strugglingConcepts.length > 0) {
      actions.push(`Focus on: ${prediction.strugglingConcepts.slice(0, 3).join(', ')}`);
    }
    
    actions.push('Take a short break to reduce cognitive load');
    return actions;
  }
}
