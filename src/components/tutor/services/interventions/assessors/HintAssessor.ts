
import { AdaptationAction, RealTimeMetrics, AdaptationThresholds } from '../types/AdaptationTypes';
import { SessionData } from '../../analytics/types/AnalyticsTypes';

export class HintAssessor {
  constructor(private thresholds: AdaptationThresholds) {}

  public assess(metrics: RealTimeMetrics, sessionData: SessionData): AdaptationAction | null {
    const { responseTime, cognitiveLoad, consecutiveIncorrect } = metrics;

    if (responseTime > this.thresholds.hintProvision.responseTime || 
        cognitiveLoad > this.thresholds.hintProvision.cognitiveLoad ||
        consecutiveIncorrect >= 2) {
      
      const hintLevel = this.calculateHintLevel(metrics, sessionData);
      
      return {
        id: `hint_${Date.now()}`,
        type: 'hint_provision',
        description: 'Providing hint to support learning',
        parameters: {
          hintLevel,
          hintType: this.determineHintType(sessionData),
          reason: 'cognitive_support_needed'
        },
        confidence: 0.8,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private calculateHintLevel(metrics: RealTimeMetrics, sessionData: SessionData): 'subtle' | 'direct' | 'explicit' {
    const difficultyRatio = sessionData.difficulty / 10;
    const timeRatio = Math.min(metrics.responseTime / 60000, 1); // max 1 minute
    
    const hintScore = (difficultyRatio + timeRatio + metrics.cognitiveLoad) / 3;
    
    if (hintScore < 0.3) return 'subtle';
    if (hintScore < 0.7) return 'direct';
    return 'explicit';
  }

  private determineHintType(sessionData: SessionData): string {
    // Simplified logic based on concept
    const conceptLower = sessionData.concept.toLowerCase();
    
    if (conceptLower.includes('math') || conceptLower.includes('calculation')) {
      return 'step_by_step';
    }
    if (conceptLower.includes('reading') || conceptLower.includes('comprehension')) {
      return 'context_clue';
    }
    
    return 'guided_question';
  }
}
