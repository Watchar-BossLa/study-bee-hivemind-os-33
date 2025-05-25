
import { LearningVelocityMetrics, SessionData } from '../types/AnalyticsTypes';

export class VelocityCalculator {
  public calculateLearningVelocity(
    userId: string,
    sessionData: SessionData[],
    learningHistory: Map<string, LearningVelocityMetrics[]>
  ): LearningVelocityMetrics {
    const conceptMastery: Record<string, number> = {};
    let totalAccuracy = 0;
    let totalTime = 0;
    const difficultyProgression: number[] = [];
    
    sessionData.forEach(session => {
      conceptMastery[session.concept] = session.accuracy;
      totalAccuracy += session.accuracy;
      totalTime += session.timeSpent;
      difficultyProgression.push(session.difficulty);
    });

    const learningRate = this.calculateLearningRate(sessionData);
    const retentionScore = this.calculateRetentionScore(userId, sessionData, learningHistory);
    const cognitiveLoadIndex = this.calculateCognitiveLoad(sessionData);
    const adaptationSpeed = this.calculateAdaptationSpeed(sessionData);

    return {
      conceptMastery,
      learningRate,
      retentionScore,
      difficultyProgression,
      cognitiveLoadIndex,
      adaptationSpeed
    };
  }

  private calculateLearningRate(sessionData: SessionData[]): number {
    if (sessionData.length < 2) return 0.5;
    
    const initialAccuracy = sessionData[0].accuracy;
    const finalAccuracy = sessionData[sessionData.length - 1].accuracy;
    const timeSpan = sessionData.length;
    
    return Math.min(1, Math.max(0, (finalAccuracy - initialAccuracy) / timeSpan + 0.5));
  }

  private calculateRetentionScore(
    userId: string, 
    currentSession: SessionData[], 
    learningHistory: Map<string, LearningVelocityMetrics[]>
  ): number {
    const history = learningHistory.get(userId) || [];
    if (history.length === 0) return 0.7;
    
    const previousMastery = history[history.length - 1]?.conceptMastery || {};
    let retentionSum = 0;
    let conceptCount = 0;
    
    currentSession.forEach(session => {
      if (previousMastery[session.concept]) {
        retentionSum += Math.min(session.accuracy / previousMastery[session.concept], 1);
        conceptCount++;
      }
    });
    
    return conceptCount > 0 ? retentionSum / conceptCount : 0.7;
  }

  private calculateCognitiveLoad(sessionData: SessionData[]): number {
    const avgAttempts = sessionData.reduce((sum, s) => sum + s.attempts, 0) / sessionData.length;
    const avgTime = sessionData.reduce((sum, s) => sum + s.timeSpent, 0) / sessionData.length;
    const avgDifficulty = sessionData.reduce((sum, s) => sum + s.difficulty, 0) / sessionData.length;
    
    // Normalize to 0-1 scale where 1 = high cognitive load
    return Math.min(1, (avgAttempts * 0.3 + avgTime * 0.0001 + avgDifficulty * 0.4));
  }

  private calculateAdaptationSpeed(sessionData: SessionData[]): number {
    if (sessionData.length < 3) return 0.5;
    
    let improvementRate = 0;
    for (let i = 1; i < sessionData.length; i++) {
      const improvement = sessionData[i].accuracy - sessionData[i-1].accuracy;
      improvementRate += Math.max(0, improvement);
    }
    
    return Math.min(1, improvementRate / (sessionData.length - 1) + 0.3);
  }
}
