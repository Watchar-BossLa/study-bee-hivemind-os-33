
import { Intervention } from './InterventionEngine';
import { LearningPattern } from '../analytics/core/LearningPatternAnalyzer';

export interface NudgeTemplate {
  id: string;
  type: 'motivational' | 'instructional' | 'reminder' | 'achievement';
  content: string;
  tone: 'encouraging' | 'neutral' | 'urgent' | 'celebratory';
  triggers: string[];
  personalizable: boolean;
}

export interface PersonalizedNudge {
  id: string;
  userId: string;
  template: NudgeTemplate;
  personalizedContent: string;
  deliveryTime: Date;
  channel: 'push' | 'in_app' | 'email';
  priority: number;
  effectiveness: number;
  delivered: boolean;
  opened: boolean;
  actedUpon: boolean;
}

export class PersonalizedNudgeService {
  private nudgeTemplates: NudgeTemplate[] = [
    {
      id: 'motivation_streak',
      type: 'motivational',
      content: 'You\'re on a {streak_days} day study streak! Keep the momentum going with just 15 minutes today.',
      tone: 'encouraging',
      triggers: ['study_streak'],
      personalizable: true
    },
    {
      id: 'struggle_support',
      type: 'instructional',
      content: 'Having trouble with {concept}? Try breaking it down into smaller parts. Our AI tutor can help!',
      tone: 'encouraging',
      triggers: ['declining_accuracy', 'concept_struggle'],
      personalizable: true
    },
    {
      id: 'optimal_time',
      type: 'reminder',
      content: 'Your best study time is usually {preferred_time}. Ready for today\'s session?',
      tone: 'neutral',
      triggers: ['optimal_study_time'],
      personalizable: true
    },
    {
      id: 'achievement_unlock',
      type: 'achievement',
      content: 'Congratulations! You\'ve mastered {concept}. Time to celebrate and move to the next challenge!',
      tone: 'celebratory',
      triggers: ['concept_mastery'],
      personalizable: true
    },
    {
      id: 'comeback_motivation',
      type: 'motivational',
      content: 'We missed you! Getting back into studying can be tough, but you\'ve got this. Start with just 10 minutes?',
      tone: 'encouraging',
      triggers: ['study_gap'],
      personalizable: false
    },
    {
      id: 'technique_suggestion',
      type: 'instructional',
      content: 'Try the Pomodoro technique: 25 minutes focused study, then a 5-minute break. Perfect for {concept}!',
      tone: 'neutral',
      triggers: ['attention_issues', 'long_sessions'],
      personalizable: true
    }
  ];

  private userNudgeHistory: Map<string, PersonalizedNudge[]> = new Map();

  public generatePersonalizedNudge(
    userId: string,
    pattern: LearningPattern,
    intervention: Intervention
  ): PersonalizedNudge | null {
    const relevantTemplate = this.selectBestTemplate(pattern, intervention);
    if (!relevantTemplate) return null;

    const personalizedContent = this.personalizeContent(relevantTemplate, pattern, userId);
    const deliveryTime = this.calculateOptimalDeliveryTime(pattern, intervention.timing);
    const channel = this.selectOptimalChannel(intervention.deliveryMethod, pattern);

    const nudge: PersonalizedNudge = {
      id: `nudge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      template: relevantTemplate,
      personalizedContent,
      deliveryTime,
      channel: channel as 'push' | 'in_app' | 'email',
      priority: this.calculatePriority(intervention.priority),
      effectiveness: this.predictEffectiveness(relevantTemplate, pattern),
      delivered: false,
      opened: false,
      actedUpon: false
    };

    this.storeNudge(userId, nudge);
    return nudge;
  }

  private selectBestTemplate(pattern: LearningPattern, intervention: Intervention): NudgeTemplate | null {
    const relevantTemplates = this.nudgeTemplates.filter(template => {
      return template.triggers.some(trigger => {
        switch (trigger) {
          case 'declining_accuracy':
            return pattern.accuracyTrend.slice(-2).every((acc, i, arr) => i === 0 || acc < arr[i - 1]);
          case 'concept_struggle':
            return pattern.strugglingIndicators.length > 0;
          case 'study_streak':
            return this.hasStudyStreak(pattern.userId);
          case 'optimal_study_time':
            return pattern.timeOfDay !== 'unknown';
          case 'concept_mastery':
            return pattern.confidenceLevel > 0.8;
          case 'study_gap':
            return this.hasStudyGap(pattern.userId);
          case 'attention_issues':
            return pattern.strugglingIndicators.includes('Taking longer to answer questions');
          case 'long_sessions':
            return pattern.sessionLength > 60; // minutes
          default:
            return false;
        }
      });
    });

    if (relevantTemplates.length === 0) return null;

    // Select template based on intervention type and effectiveness
    return relevantTemplates.reduce((best, current) => {
      const currentScore = this.calculateTemplateScore(current, pattern, intervention);
      const bestScore = this.calculateTemplateScore(best, pattern, intervention);
      return currentScore > bestScore ? current : best;
    });
  }

  private personalizeContent(template: NudgeTemplate, pattern: LearningPattern, userId: string): string {
    if (!template.personalizable) return template.content;

    let content = template.content;
    
    // Replace placeholders with personalized data
    content = content.replace('{concept}', pattern.conceptId);
    content = content.replace('{preferred_time}', pattern.timeOfDay);
    content = content.replace('{streak_days}', this.getStreakDays(userId).toString());
    
    return content;
  }

  private calculateOptimalDeliveryTime(pattern: LearningPattern, timing: Intervention['timing']): Date {
    const now = new Date();
    
    switch (timing) {
      case 'immediate':
        return now;
      case 'next_session':
        return this.getNextOptimalStudyTime(pattern);
      case 'scheduled':
        return new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      default:
        return now;
    }
  }

  private selectOptimalChannel(
    preferredMethod: Intervention['deliveryMethod'], 
    pattern: LearningPattern
  ): string {
    // Consider user's historical engagement with different channels
    const channelEffectiveness = this.getChannelEffectiveness(pattern.userId);
    
    switch (preferredMethod) {
      case 'notification':
        return channelEffectiveness.push > channelEffectiveness.email ? 'push' : 'email';
      case 'in_app':
        return 'in_app';
      case 'email':
        return 'email';
      case 'sms':
        return 'push'; // Fallback to push notification
      default:
        return 'in_app';
    }
  }

  private calculatePriority(interventionPriority: Intervention['priority']): number {
    const priorityMap = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4
    };
    return priorityMap[interventionPriority];
  }

  private predictEffectiveness(template: NudgeTemplate, pattern: LearningPattern): number {
    let baseEffectiveness = 0.6; // Base effectiveness

    // Adjust based on template type
    switch (template.type) {
      case 'motivational':
        baseEffectiveness += pattern.confidenceLevel < 0.5 ? 0.2 : 0.1;
        break;
      case 'instructional':
        baseEffectiveness += pattern.strugglingIndicators.length > 2 ? 0.15 : 0.05;
        break;
      case 'achievement':
        baseEffectiveness += pattern.confidenceLevel > 0.7 ? 0.25 : 0.1;
        break;
      case 'reminder':
        baseEffectiveness += 0.1;
        break;
    }

    // Adjust based on personalization
    if (template.personalizable) {
      baseEffectiveness += 0.1;
    }

    return Math.min(0.95, baseEffectiveness);
  }

  private calculateTemplateScore(
    template: NudgeTemplate, 
    pattern: LearningPattern, 
    intervention: Intervention
  ): number {
    let score = 0;

    // Type alignment
    if (template.type === 'motivational' && pattern.confidenceLevel < 0.5) score += 0.3;
    if (template.type === 'instructional' && pattern.strugglingIndicators.length > 0) score += 0.3;
    if (template.type === 'achievement' && pattern.confidenceLevel > 0.8) score += 0.4;

    // Historical effectiveness
    score += this.getTemplateHistoricalEffectiveness(template.id, pattern.userId) * 0.3;

    // Personalization bonus
    if (template.personalizable) score += 0.1;

    return score;
  }

  private storeNudge(userId: string, nudge: PersonalizedNudge): void {
    const history = this.userNudgeHistory.get(userId) || [];
    history.push(nudge);
    this.userNudgeHistory.set(userId, history);
  }

  public getPendingNudges(userId: string): PersonalizedNudge[] {
    const history = this.userNudgeHistory.get(userId) || [];
    return history.filter(nudge => 
      !nudge.delivered && nudge.deliveryTime <= new Date()
    ).sort((a, b) => b.priority - a.priority);
  }

  public markNudgeDelivered(nudgeId: string, userId: string): void {
    const history = this.userNudgeHistory.get(userId) || [];
    const nudge = history.find(n => n.id === nudgeId);
    if (nudge) {
      nudge.delivered = true;
    }
  }

  public markNudgeOpened(nudgeId: string, userId: string): void {
    const history = this.userNudgeHistory.get(userId) || [];
    const nudge = history.find(n => n.id === nudgeId);
    if (nudge) {
      nudge.opened = true;
    }
  }

  public markNudgeActedUpon(nudgeId: string, userId: string): void {
    const history = this.userNudgeHistory.get(userId) || [];
    const nudge = history.find(n => n.id === nudgeId);
    if (nudge) {
      nudge.actedUpon = true;
    }
  }

  // Helper methods (simplified implementations)
  private hasStudyStreak(userId: string): boolean {
    return Math.random() > 0.5; // Simplified
  }

  private hasStudyGap(userId: string): boolean {
    return Math.random() > 0.7; // Simplified
  }

  private getStreakDays(userId: string): number {
    return Math.floor(Math.random() * 30) + 1; // Simplified
  }

  private getNextOptimalStudyTime(pattern: LearningPattern): Date {
    const now = new Date();
    // Simplified: add some hours based on preferred time
    return new Date(now.getTime() + 4 * 60 * 60 * 1000);
  }

  private getChannelEffectiveness(userId: string): { push: number; email: number; in_app: number } {
    // Simplified: return default effectiveness
    return { push: 0.7, email: 0.6, in_app: 0.8 };
  }

  private getTemplateHistoricalEffectiveness(templateId: string, userId: string): number {
    // Simplified: return average effectiveness
    return 0.65;
  }
}
