import { LearningVelocityMetrics, SessionData } from '../types/AnalyticsTypes';

export interface LearningPattern {
  userId: string;
  conceptId: string;
  timeOfDay: string;
  sessionLength: number;
  accuracyTrend: number[];
  velocityTrend: number[];
  strugglingIndicators: string[];
  confidenceLevel: number;
  riskScore: number;
}

export interface RiskFactors {
  decreasingAccuracy: boolean;
  slowingVelocity: boolean;
  increasingTimePerQuestion: boolean;
  frequentIncorrectAttempts: boolean;
  avoidingDifficultTopics: boolean;
  irregularStudyPatterns: boolean;
}

export class LearningPatternAnalyzer {
  private patterns: Map<string, LearningPattern[]> = new Map();
  private riskThresholds = {
    accuracyDrop: 0.15,
    velocityDrop: 0.20,
    timeIncrease: 1.5,
    consecutiveErrors: 3,
    riskScore: 0.7
  };

  public analyzeLearningPattern(
    userId: string,
    sessionHistory: SessionData[],
    currentMetrics: LearningVelocityMetrics
  ): LearningPattern {
    const recentSessions = sessionHistory.slice(-10);
    const accuracyTrend = this.calculateAccuracyTrend(recentSessions);
    const velocityTrend = this.calculateVelocityTrend(recentSessions);
    const riskFactors = this.identifyRiskFactors(recentSessions, currentMetrics);
    
    const pattern: LearningPattern = {
      userId,
      conceptId: this.extractPrimaryConcept(recentSessions),
      timeOfDay: this.getPreferredStudyTime(recentSessions),
      sessionLength: this.getAverageSessionLength(recentSessions),
      accuracyTrend,
      velocityTrend,
      strugglingIndicators: this.extractStrugglingIndicators(riskFactors),
      confidenceLevel: this.calculateConfidenceLevel(recentSessions),
      riskScore: this.calculateRiskScore(riskFactors, accuracyTrend, velocityTrend)
    };

    this.updatePatternHistory(userId, pattern);
    return pattern;
  }

  private calculateAccuracyTrend(sessions: SessionData[]): number[] {
    return sessions.map(session => session.accuracy);
  }

  private calculateVelocityTrend(sessions: SessionData[]): number[] {
    return sessions.map(session => session.timeSpent > 0 ? session.attempts / session.timeSpent : 0);
  }

  private identifyRiskFactors(sessions: SessionData[], metrics: LearningVelocityMetrics): RiskFactors {
    const recentAccuracy = sessions.slice(-3).map(s => s.accuracy);
    const accuracyDrop = recentAccuracy.length > 1 && 
      recentAccuracy[0] - recentAccuracy[recentAccuracy.length - 1] > this.riskThresholds.accuracyDrop;

    const velocityDrop = metrics.learningRate < 0.3;
    const increasingTime = this.detectIncreasingTimePattern(sessions);
    const frequentErrors = this.detectFrequentErrors(sessions);

    return {
      decreasingAccuracy: accuracyDrop,
      slowingVelocity: velocityDrop,
      increasingTimePerQuestion: increasingTime,
      frequentIncorrectAttempts: frequentErrors,
      avoidingDifficultTopics: this.detectTopicAvoidance(sessions),
      irregularStudyPatterns: this.detectIrregularPatterns(sessions)
    };
  }

  private detectIncreasingTimePattern(sessions: SessionData[]): boolean {
    if (sessions.length < 3) return false;
    const timePerAttempt = sessions.map(s => s.attempts > 0 ? s.timeSpent / s.attempts : 0);
    const recent = timePerAttempt.slice(-3);
    return recent.length >= 2 && recent[recent.length - 1] > recent[0] * this.riskThresholds.timeIncrease;
  }

  private detectFrequentErrors(sessions: SessionData[]): boolean {
    const recentSessions = sessions.slice(-5);
    const consecutiveErrors = recentSessions.filter(s => s.accuracy < 0.5).length;
    return consecutiveErrors >= this.riskThresholds.consecutiveErrors;
  }

  private detectTopicAvoidance(sessions: SessionData[]): boolean {
    const concepts = sessions.map(s => s.concept);
    const uniqueConcepts = new Set(concepts);
    const difficultConcepts = sessions.filter(s => s.difficulty > 7).map(s => s.concept);
    return difficultConcepts.length > 0 && uniqueConcepts.size < difficultConcepts.length;
  }

  private detectIrregularPatterns(sessions: SessionData[]): boolean {
    // Simplified: check if study times vary significantly
    const studyTimes = sessions.map(s => s.timeSpent);
    const avgTime = studyTimes.reduce((a, b) => a + b, 0) / studyTimes.length;
    const variance = studyTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / studyTimes.length;
    return Math.sqrt(variance) > avgTime * 0.5;
  }

  private extractStrugglingIndicators(riskFactors: RiskFactors): string[] {
    const indicators: string[] = [];
    if (riskFactors.decreasingAccuracy) indicators.push('Declining accuracy over recent sessions');
    if (riskFactors.slowingVelocity) indicators.push('Learning velocity has decreased');
    if (riskFactors.increasingTimePerQuestion) indicators.push('Taking longer to answer questions');
    if (riskFactors.frequentIncorrectAttempts) indicators.push('Multiple incorrect attempts recently');
    if (riskFactors.avoidingDifficultTopics) indicators.push('Avoiding challenging topics');
    if (riskFactors.irregularStudyPatterns) indicators.push('Inconsistent study schedule');
    return indicators;
  }

  private calculateRiskScore(riskFactors: RiskFactors, accuracyTrend: number[], velocityTrend: number[]): number {
    let score = 0;
    const weights = {
      decreasingAccuracy: 0.25,
      slowingVelocity: 0.20,
      increasingTime: 0.15,
      frequentErrors: 0.20,
      avoidingTopics: 0.10,
      irregularPatterns: 0.10
    };

    if (riskFactors.decreasingAccuracy) score += weights.decreasingAccuracy;
    if (riskFactors.slowingVelocity) score += weights.slowingVelocity;
    if (riskFactors.increasingTimePerQuestion) score += weights.increasingTime;
    if (riskFactors.frequentIncorrectAttempts) score += weights.frequentErrors;
    if (riskFactors.avoidingDifficultTopics) score += weights.avoidingTopics;
    if (riskFactors.irregularStudyPatterns) score += weights.irregularPatterns;

    return Math.min(1.0, score);
  }

  private extractPrimaryConcept(sessions: SessionData[]): string {
    const conceptCounts = new Map<string, number>();
    sessions.forEach(session => {
      conceptCounts.set(session.concept, (conceptCounts.get(session.concept) || 0) + 1);
    });
    
    return Array.from(conceptCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';
  }

  private getPreferredStudyTime(sessions: SessionData[]): string {
    // This would normally extract timestamps, simplified for demo
    return 'evening';
  }

  private getAverageSessionLength(sessions: SessionData[]): number {
    return sessions.reduce((sum, s) => sum + s.timeSpent, 0) / sessions.length;
  }

  private calculateConfidenceLevel(sessions: SessionData[]): number {
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
    const consistency = this.calculateConsistency(sessions.map(s => s.accuracy));
    return (avgAccuracy + consistency) / 2;
  }

  private calculateConsistency(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.max(0, 1 - Math.sqrt(variance));
  }

  private updatePatternHistory(userId: string, pattern: LearningPattern): void {
    const userPatterns = this.patterns.get(userId) || [];
    userPatterns.push(pattern);
    
    // Keep only last 20 patterns
    if (userPatterns.length > 20) {
      userPatterns.shift();
    }
    
    this.patterns.set(userId, userPatterns);
  }

  public getUserPatternHistory(userId: string): LearningPattern[] {
    return this.patterns.get(userId) || [];
  }

  public getHighRiskUsers(): string[] {
    const highRiskUsers: string[] = [];
    
    this.patterns.forEach((patterns, userId) => {
      const latestPattern = patterns[patterns.length - 1];
      if (latestPattern && latestPattern.riskScore > this.riskThresholds.riskScore) {
        highRiskUsers.push(userId);
      }
    });
    
    return highRiskUsers;
  }
}
