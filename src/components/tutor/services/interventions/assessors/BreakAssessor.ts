
import { AdaptationAction, RealTimeMetrics, AdaptationThresholds } from '../types/AdaptationTypes';

export class BreakAssessor {
  constructor(private thresholds: AdaptationThresholds) {}

  public assess(metrics: RealTimeMetrics): AdaptationAction | null {
    const { timeOnTask, frustrationLevel, cognitiveLoad } = metrics;

    if (timeOnTask >= this.thresholds.breakSuggestion.timeOnTask || 
        frustrationLevel >= this.thresholds.breakSuggestion.frustrationLevel ||
        cognitiveLoad > 0.85) {
      
      const breakDuration = this.calculateOptimalBreakDuration(metrics);
      
      return {
        id: `break_${Date.now()}`,
        type: 'break_suggestion',
        description: 'Suggesting a break to prevent cognitive overload',
        parameters: {
          breakDuration,
          reason: this.determineBreakReason(metrics),
          activities: this.suggestBreakActivities(metrics)
        },
        confidence: 0.9,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private calculateOptimalBreakDuration(metrics: RealTimeMetrics): number {
    const baseDuration = 5; // minutes
    const loadFactor = metrics.cognitiveLoad;
    const timeFactor = Math.min(metrics.timeOnTask / 60, 2); // max 2x multiplier
    
    return Math.round(baseDuration * (1 + loadFactor + timeFactor * 0.5));
  }

  private determineBreakReason(metrics: RealTimeMetrics): string {
    if (metrics.frustrationLevel > 0.7) return 'high_frustration';
    if (metrics.cognitiveLoad > 0.8) return 'cognitive_overload';
    if (metrics.timeOnTask > 45) return 'extended_session';
    return 'preventive_break';
  }

  private suggestBreakActivities(metrics: RealTimeMetrics): string[] {
    const activities = ['stretch', 'deep_breathing', 'walk'];
    
    if (metrics.frustrationLevel > 0.7) {
      activities.push('meditation', 'listen_to_music');
    }
    
    if (metrics.cognitiveLoad > 0.8) {
      activities.push('eye_rest', 'hydrate');
    }
    
    return activities;
  }
}
