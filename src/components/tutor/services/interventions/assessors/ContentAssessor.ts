
import { AdaptationAction, RealTimeMetrics, AdaptationThresholds } from '../types/AdaptationTypes';
import { LearningPattern } from '../../analytics/core/LearningPatternAnalyzer';

export class ContentAssessor {
  constructor(private thresholds: AdaptationThresholds) {}

  public assess(metrics: RealTimeMetrics, pattern: LearningPattern): AdaptationAction | null {
    const { engagementLevel, timeOnTask } = metrics;

    if (engagementLevel <= this.thresholds.contentSwitch.engagementLevel && 
        timeOnTask >= this.thresholds.contentSwitch.timeOnTask) {
      
      const newContentType = this.selectAlternativeContent(pattern);
      
      return {
        id: `content_switch_${Date.now()}`,
        type: 'content_switch',
        description: 'Switching content type to re-engage learner',
        parameters: {
          currentContent: 'text',
          newContent: newContentType,
          reason: 'low_engagement'
        },
        confidence: 0.65,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private selectAlternativeContent(pattern: LearningPattern): string {
    // Cycle through different content types based on what hasn't been tried recently
    const contentTypes = ['visual', 'interactive', 'video', 'audio', 'gamified'];
    
    // Simplified selection - in practice, would check user preferences and effectiveness
    return contentTypes[Math.floor(Math.random() * contentTypes.length)];
  }
}
