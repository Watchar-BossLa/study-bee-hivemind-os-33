import { LearningVelocityMetrics, SessionData } from '../analytics/types/AnalyticsTypes';
import { LearningPattern } from '../analytics/core/LearningPatternAnalyzer';

export interface AdaptationAction {
  id: string;
  type: 'difficulty_adjustment' | 'pacing_change' | 'content_switch' | 'break_suggestion' | 'hint_provision';
  description: string;
  parameters: Record<string, any>;
  confidence: number;
  appliedAt: Date;
  effectiveness?: number;
}

export interface RealTimeMetrics {
  currentAccuracy: number;
  responseTime: number;
  consecutiveCorrect: number;
  consecutiveIncorrect: number;
  timeOnTask: number;
  frustrationLevel: number;
  engagementLevel: number;
  cognitiveLoad: number;
}

export class RealTimeAdaptationService {
  private adaptationHistory: Map<string, AdaptationAction[]> = new Map();
  private thresholds = {
    difficultyIncrease: { accuracy: 0.8, consecutiveCorrect: 3 },
    difficultyDecrease: { accuracy: 0.4, consecutiveIncorrect: 3 },
    breakSuggestion: { timeOnTask: 45, frustrationLevel: 0.7 },
    hintProvision: { responseTime: 60000, cognitiveLoad: 0.8 },
    contentSwitch: { engagementLevel: 0.3, timeOnTask: 20 }
  };

  public analyzeAndAdapt(
    userId: string,
    currentMetrics: RealTimeMetrics,
    sessionData: SessionData,
    learningPattern: LearningPattern
  ): AdaptationAction[] {
    const adaptations: AdaptationAction[] = [];

    // Check for difficulty adjustments
    const difficultyAdaptation = this.assessDifficultyAdjustment(currentMetrics, sessionData);
    if (difficultyAdaptation) adaptations.push(difficultyAdaptation);

    // Check for pacing changes
    const pacingAdaptation = this.assessPacingChange(currentMetrics, learningPattern);
    if (pacingAdaptation) adaptations.push(pacingAdaptation);

    // Check for break suggestions
    const breakAdaptation = this.assessBreakSuggestion(currentMetrics);
    if (breakAdaptation) adaptations.push(breakAdaptation);

    // Check for hint provision
    const hintAdaptation = this.assessHintProvision(currentMetrics, sessionData);
    if (hintAdaptation) adaptations.push(hintAdaptation);

    // Check for content switching
    const contentAdaptation = this.assessContentSwitch(currentMetrics, learningPattern);
    if (contentAdaptation) adaptations.push(contentAdaptation);

    // Store adaptations
    this.storeAdaptations(userId, adaptations);

    return adaptations;
  }

  private assessDifficultyAdjustment(
    metrics: RealTimeMetrics, 
    sessionData: SessionData
  ): AdaptationAction | null {
    const { currentAccuracy, consecutiveCorrect, consecutiveIncorrect } = metrics;
    const { difficulty } = sessionData;

    // Increase difficulty if performing well
    if (currentAccuracy >= this.thresholds.difficultyIncrease.accuracy && 
        consecutiveCorrect >= this.thresholds.difficultyIncrease.consecutiveCorrect &&
        difficulty < 10) {
      return {
        id: `difficulty_up_${Date.now()}`,
        type: 'difficulty_adjustment',
        description: 'Increasing difficulty level due to high performance',
        parameters: {
          currentDifficulty: difficulty,
          newDifficulty: Math.min(10, difficulty + 1),
          reason: 'high_performance'
        },
        confidence: 0.8,
        appliedAt: new Date()
      };
    }

    // Decrease difficulty if struggling
    if (currentAccuracy <= this.thresholds.difficultyDecrease.accuracy && 
        consecutiveIncorrect >= this.thresholds.difficultyDecrease.consecutiveIncorrect &&
        difficulty > 1) {
      return {
        id: `difficulty_down_${Date.now()}`,
        type: 'difficulty_adjustment',
        description: 'Decreasing difficulty level due to struggling performance',
        parameters: {
          currentDifficulty: difficulty,
          newDifficulty: Math.max(1, difficulty - 1),
          reason: 'struggling_performance'
        },
        confidence: 0.85,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private assessPacingChange(
    metrics: RealTimeMetrics, 
    pattern: LearningPattern
  ): AdaptationAction | null {
    const avgResponseTime = metrics.responseTime;
    const historicalAverage = this.calculateHistoricalAverageResponseTime(pattern.userId);

    // Slow down if response time is significantly higher than usual
    if (avgResponseTime > historicalAverage * 1.5) {
      return {
        id: `pacing_slow_${Date.now()}`,
        type: 'pacing_change',
        description: 'Slowing down presentation pace due to increased response time',
        parameters: {
          currentPace: 'normal',
          newPace: 'slow',
          responseTimeRatio: avgResponseTime / historicalAverage,
          reason: 'slow_responses'
        },
        confidence: 0.7,
        appliedAt: new Date()
      };
    }

    // Speed up if response time is much faster than usual and accuracy is high
    if (avgResponseTime < historicalAverage * 0.7 && metrics.currentAccuracy > 0.8) {
      return {
        id: `pacing_fast_${Date.now()}`,
        type: 'pacing_change',
        description: 'Increasing presentation pace due to fast and accurate responses',
        parameters: {
          currentPace: 'normal',
          newPace: 'fast',
          responseTimeRatio: avgResponseTime / historicalAverage,
          accuracy: metrics.currentAccuracy,
          reason: 'fast_accurate_responses'
        },
        confidence: 0.75,
        appliedAt: new Date()
      };
    }

    return null;
  }

  private assessBreakSuggestion(metrics: RealTimeMetrics): AdaptationAction | null {
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

  private assessHintProvision(
    metrics: RealTimeMetrics, 
    sessionData: SessionData
  ): AdaptationAction | null {
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

  private assessContentSwitch(
    metrics: RealTimeMetrics, 
    pattern: LearningPattern
  ): AdaptationAction | null {
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

  private selectAlternativeContent(pattern: LearningPattern): string {
    // Cycle through different content types based on what hasn't been tried recently
    const contentTypes = ['visual', 'interactive', 'video', 'audio', 'gamified'];
    
    // Simplified selection - in practice, would check user preferences and effectiveness
    return contentTypes[Math.floor(Math.random() * contentTypes.length)];
  }

  private calculateHistoricalAverageResponseTime(userId: string): number {
    // Simplified - would normally query historical data
    return 15000; // 15 seconds average
  }

  private storeAdaptations(userId: string, adaptations: AdaptationAction[]): void {
    const history = this.adaptationHistory.get(userId) || [];
    history.push(...adaptations);
    
    // Keep only last 100 adaptations
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.adaptationHistory.set(userId, history);
  }

  public getAdaptationHistory(userId: string): AdaptationAction[] {
    return this.adaptationHistory.get(userId) || [];
  }

  public getAdaptationEffectiveness(type: AdaptationAction['type']): number {
    let totalEffectiveness = 0;
    let count = 0;
    
    this.adaptationHistory.forEach(history => {
      history.forEach(adaptation => {
        if (adaptation.type === type && adaptation.effectiveness !== undefined) {
          totalEffectiveness += adaptation.effectiveness;
          count++;
        }
      });
    });
    
    return count > 0 ? totalEffectiveness / count : 0;
  }

  public updateAdaptationEffectiveness(
    userId: string, 
    adaptationId: string, 
    effectiveness: number
  ): void {
    const history = this.adaptationHistory.get(userId) || [];
    const adaptation = history.find(a => a.id === adaptationId);
    if (adaptation) {
      adaptation.effectiveness = effectiveness;
    }
  }
}
