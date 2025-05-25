
import { LearningPattern } from '../analytics/core/LearningPatternAnalyzer';
import { InterventionAlert } from '../analytics/types/AnalyticsTypes';

export interface Intervention {
  id: string;
  userId: string;
  type: 'nudge' | 'content_adjustment' | 'tutor_assistance' | 'break_suggestion' | 'study_plan_modification';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionItems: string[];
  suggestedResources: Array<{
    title: string;
    type: 'video' | 'article' | 'practice' | 'tutor_session';
    url?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }>;
  triggerConditions: string[];
  deliveryMethod: 'notification' | 'in_app' | 'email' | 'sms';
  timing: 'immediate' | 'next_session' | 'scheduled';
  scheduledFor?: Date;
  effectiveness: number;
  delivered: boolean;
  deliveredAt?: Date;
  userResponse?: 'accepted' | 'dismissed' | 'snoozed';
  responseAt?: Date;
}

export class InterventionEngine {
  private activeInterventions: Map<string, Intervention[]> = new Map();
  private interventionHistory: Map<string, Intervention[]> = new Map();

  public generateInterventions(pattern: LearningPattern): Intervention[] {
    const interventions: Intervention[] = [];
    
    // High risk score - immediate intervention
    if (pattern.riskScore > 0.8) {
      interventions.push(this.createCriticalIntervention(pattern));
    }
    
    // Declining accuracy pattern
    if (this.hasDeclinePattern(pattern.accuracyTrend)) {
      interventions.push(this.createAccuracyIntervention(pattern));
    }
    
    // Velocity issues
    if (this.hasVelocityIssues(pattern.velocityTrend)) {
      interventions.push(this.createVelocityIntervention(pattern));
    }
    
    // Confidence building
    if (pattern.confidenceLevel < 0.5) {
      interventions.push(this.createConfidenceIntervention(pattern));
    }
    
    // Study pattern optimization
    if (this.hasIrregularPatterns(pattern)) {
      interventions.push(this.createStudyPatternIntervention(pattern));
    }

    // Store active interventions
    this.activeInterventions.set(pattern.userId, interventions);
    
    return interventions;
  }

  private createCriticalIntervention(pattern: LearningPattern): Intervention {
    return {
      id: `critical_${Date.now()}`,
      userId: pattern.userId,
      type: 'tutor_assistance',
      priority: 'critical',
      title: 'Learning Support Needed',
      message: 'Our AI has detected you might be struggling with some concepts. Let\'s get you back on track!',
      actionItems: [
        'Schedule a 1-on-1 AI tutor session',
        'Review fundamental concepts',
        'Take a short assessment to identify knowledge gaps'
      ],
      suggestedResources: [
        {
          title: 'AI Tutor Session',
          type: 'tutor_session',
          difficulty: 'beginner'
        },
        {
          title: 'Concept Review Practice',
          type: 'practice',
          difficulty: 'beginner'
        }
      ],
      triggerConditions: [`Risk score: ${pattern.riskScore.toFixed(2)}`, ...pattern.strugglingIndicators],
      deliveryMethod: 'in_app',
      timing: 'immediate',
      effectiveness: 0.85,
      delivered: false
    };
  }

  private createAccuracyIntervention(pattern: LearningPattern): Intervention {
    return {
      id: `accuracy_${Date.now()}`,
      userId: pattern.userId,
      type: 'content_adjustment',
      priority: 'high',
      title: 'Let\'s Strengthen Your Foundation',
      message: 'Your recent performance suggests we should review some key concepts before moving forward.',
      actionItems: [
        'Review previous material at a slower pace',
        'Focus on understanding rather than speed',
        'Use visual learning aids'
      ],
      suggestedResources: [
        {
          title: 'Interactive Concept Maps',
          type: 'article',
          difficulty: 'intermediate'
        },
        {
          title: 'Step-by-step Practice Problems',
          type: 'practice',
          difficulty: 'beginner'
        }
      ],
      triggerConditions: ['Declining accuracy trend detected'],
      deliveryMethod: 'notification',
      timing: 'next_session',
      effectiveness: 0.72,
      delivered: false
    };
  }

  private createVelocityIntervention(pattern: LearningPattern): Intervention {
    return {
      id: `velocity_${Date.now()}`,
      userId: pattern.userId,
      type: 'study_plan_modification',
      priority: 'medium',
      title: 'Optimize Your Learning Pace',
      message: 'Let\'s adjust your study approach to help you learn more efficiently.',
      actionItems: [
        'Break study sessions into smaller chunks',
        'Use active recall techniques',
        'Implement spaced repetition'
      ],
      suggestedResources: [
        {
          title: 'Effective Study Techniques',
          type: 'video',
          difficulty: 'beginner'
        },
        {
          title: 'Spaced Repetition Guide',
          type: 'article',
          difficulty: 'intermediate'
        }
      ],
      triggerConditions: ['Learning velocity decrease detected'],
      deliveryMethod: 'in_app',
      timing: 'scheduled',
      scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      effectiveness: 0.68,
      delivered: false
    };
  }

  private createConfidenceIntervention(pattern: LearningPattern): Intervention {
    return {
      id: `confidence_${Date.now()}`,
      userId: pattern.userId,
      type: 'nudge',
      priority: 'medium',
      title: 'You\'re Doing Great - Keep Going!',
      message: 'Learning takes time, and you\'re making progress. Let\'s build your confidence step by step.',
      actionItems: [
        'Practice with easier problems first',
        'Celebrate small wins',
        'Review your progress regularly'
      ],
      suggestedResources: [
        {
          title: 'Confidence Building Exercises',
          type: 'practice',
          difficulty: 'beginner'
        },
        {
          title: 'Growth Mindset Training',
          type: 'video',
          difficulty: 'beginner'
        }
      ],
      triggerConditions: [`Low confidence level: ${pattern.confidenceLevel.toFixed(2)}`],
      deliveryMethod: 'notification',
      timing: 'immediate',
      effectiveness: 0.75,
      delivered: false
    };
  }

  private createStudyPatternIntervention(pattern: LearningPattern): Intervention {
    return {
      id: `pattern_${Date.now()}`,
      userId: pattern.userId,
      type: 'study_plan_modification',
      priority: 'low',
      title: 'Let\'s Create a Better Study Schedule',
      message: 'Consistent study habits can significantly improve your learning outcomes.',
      actionItems: [
        'Set regular study times',
        'Create a dedicated study space',
        'Use study session reminders'
      ],
      suggestedResources: [
        {
          title: 'Study Schedule Planner',
          type: 'article',
          difficulty: 'beginner'
        },
        {
          title: 'Habit Formation Guide',
          type: 'video',
          difficulty: 'intermediate'
        }
      ],
      triggerConditions: ['Irregular study patterns detected'],
      deliveryMethod: 'email',
      timing: 'scheduled',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      effectiveness: 0.60,
      delivered: false
    };
  }

  private hasDeclinePattern(trend: number[]): boolean {
    if (trend.length < 3) return false;
    const recent = trend.slice(-3);
    return recent[0] > recent[recent.length - 1] + 0.1;
  }

  private hasVelocityIssues(trend: number[]): boolean {
    if (trend.length < 2) return false;
    const recent = trend.slice(-2);
    return recent[recent.length - 1] < recent[0] * 0.8;
  }

  private hasIrregularPatterns(pattern: LearningPattern): boolean {
    return pattern.strugglingIndicators.some(indicator => 
      indicator.includes('Inconsistent study schedule')
    );
  }

  public getActiveInterventions(userId: string): Intervention[] {
    return this.activeInterventions.get(userId) || [];
  }

  public markInterventionDelivered(interventionId: string, userId: string): void {
    const interventions = this.activeInterventions.get(userId) || [];
    const intervention = interventions.find(i => i.id === interventionId);
    if (intervention) {
      intervention.delivered = true;
      intervention.deliveredAt = new Date();
    }
  }

  public recordUserResponse(
    interventionId: string, 
    userId: string, 
    response: 'accepted' | 'dismissed' | 'snoozed'
  ): void {
    const interventions = this.activeInterventions.get(userId) || [];
    const intervention = interventions.find(i => i.id === interventionId);
    if (intervention) {
      intervention.userResponse = response;
      intervention.responseAt = new Date();
      
      // Move to history if not snoozed
      if (response !== 'snoozed') {
        this.moveToHistory(userId, intervention);
      }
    }
  }

  private moveToHistory(userId: string, intervention: Intervention): void {
    const history = this.interventionHistory.get(userId) || [];
    history.push(intervention);
    this.interventionHistory.set(userId, history);
    
    // Remove from active
    const active = this.activeInterventions.get(userId) || [];
    const filtered = active.filter(i => i.id !== intervention.id);
    this.activeInterventions.set(userId, filtered);
  }

  public getInterventionHistory(userId: string): Intervention[] {
    return this.interventionHistory.get(userId) || [];
  }

  public getInterventionEffectiveness(type: Intervention['type']): number {
    let totalEffectiveness = 0;
    let count = 0;
    
    this.interventionHistory.forEach(history => {
      history.forEach(intervention => {
        if (intervention.type === type && intervention.userResponse === 'accepted') {
          totalEffectiveness += intervention.effectiveness;
          count++;
        }
      });
    });
    
    return count > 0 ? totalEffectiveness / count : 0;
  }
}
