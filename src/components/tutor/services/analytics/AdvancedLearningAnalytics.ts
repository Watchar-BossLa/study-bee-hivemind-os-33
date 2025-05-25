export interface LearningVelocityMetrics {
  conceptMastery: Record<string, number>;
  learningRate: number;
  retentionScore: number;
  difficultyProgression: number[];
  cognitiveLoadIndex: number;
  adaptationSpeed: number;
}

export interface PredictiveModel {
  difficultyPrediction: number;
  timeToMastery: number;
  strugglingConcepts: string[];
  recommendedIntervention: 'none' | 'review' | 'alternative_approach' | 'tutor_assistance';
  confidenceLevel: number;
}

export interface InterventionAlert {
  id: string;
  userId: string;
  alertType: 'learning_plateau' | 'concept_confusion' | 'rapid_decline' | 'attention_drift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  concept: string;
  description: string;
  suggestedActions: string[];
  timestamp: Date;
  resolved: boolean;
}

export class AdvancedLearningAnalytics {
  private learningHistory: Map<string, LearningVelocityMetrics[]> = new Map();
  private interventionAlerts: InterventionAlert[] = [];
  private quantumLearningStates: Map<string, number[]> = new Map();

  public analyzeLearningVelocity(
    userId: string,
    sessionData: {
      concept: string;
      timeSpent: number;
      accuracy: number;
      attempts: number;
      difficulty: number;
    }[]
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
    const retentionScore = this.calculateRetentionScore(userId, sessionData);
    const cognitiveLoadIndex = this.calculateCognitiveLoad(sessionData);
    const adaptationSpeed = this.calculateAdaptationSpeed(sessionData);

    const metrics: LearningVelocityMetrics = {
      conceptMastery,
      learningRate,
      retentionScore,
      difficultyProgression,
      cognitiveLoadIndex,
      adaptationSpeed
    };

    this.updateLearningHistory(userId, metrics);
    return metrics;
  }

  private calculateLearningRate(sessionData: any[]): number {
    if (sessionData.length < 2) return 0.5;
    
    const initialAccuracy = sessionData[0].accuracy;
    const finalAccuracy = sessionData[sessionData.length - 1].accuracy;
    const timeSpan = sessionData.length;
    
    return Math.min(1, Math.max(0, (finalAccuracy - initialAccuracy) / timeSpan + 0.5));
  }

  private calculateRetentionScore(userId: string, currentSession: any[]): number {
    const history = this.learningHistory.get(userId) || [];
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

  private calculateCognitiveLoad(sessionData: any[]): number {
    const avgAttempts = sessionData.reduce((sum, s) => sum + s.attempts, 0) / sessionData.length;
    const avgTime = sessionData.reduce((sum, s) => sum + s.timeSpent, 0) / sessionData.length;
    const avgDifficulty = sessionData.reduce((sum, s) => sum + s.difficulty, 0) / sessionData.length;
    
    // Normalize to 0-1 scale where 1 = high cognitive load
    return Math.min(1, (avgAttempts * 0.3 + avgTime * 0.0001 + avgDifficulty * 0.4));
  }

  private calculateAdaptationSpeed(sessionData: any[]): number {
    if (sessionData.length < 3) return 0.5;
    
    let improvementRate = 0;
    for (let i = 1; i < sessionData.length; i++) {
      const improvement = sessionData[i].accuracy - sessionData[i-1].accuracy;
      improvementRate += Math.max(0, improvement);
    }
    
    return Math.min(1, improvementRate / (sessionData.length - 1) + 0.3);
  }

  public generatePredictiveModel(
    userId: string, 
    targetConcept: string,
    currentMetrics: LearningVelocityMetrics
  ): PredictiveModel {
    const history = this.learningHistory.get(userId) || [];
    const conceptMastery = currentMetrics.conceptMastery[targetConcept] || 0;
    
    // Quantum-inspired prediction using superposition of learning states
    const quantumStates = this.getQuantumLearningStates(userId, targetConcept);
    const difficultyPrediction = this.predictDifficulty(quantumStates, currentMetrics);
    const timeToMastery = this.predictTimeToMastery(conceptMastery, currentMetrics.learningRate);
    
    const strugglingConcepts = Object.entries(currentMetrics.conceptMastery)
      .filter(([_, mastery]) => mastery < 0.6)
      .map(([concept, _]) => concept);
    
    const intervention = this.recommendIntervention(
      difficultyPrediction,
      currentMetrics.cognitiveLoadIndex,
      strugglingConcepts.length
    );
    
    return {
      difficultyPrediction,
      timeToMastery,
      strugglingConcepts,
      recommendedIntervention: intervention,
      confidenceLevel: this.calculatePredictionConfidence(history.length, currentMetrics)
    };
  }

  private getQuantumLearningStates(userId: string, concept: string): number[] {
    const key = `${userId}-${concept}`;
    if (!this.quantumLearningStates.has(key)) {
      // Initialize quantum superposition of learning states
      this.quantumLearningStates.set(key, [
        Math.random(), // understanding probability
        Math.random(), // confusion probability  
        Math.random(), // mastery probability
        Math.random()  // breakthrough probability
      ]);
    }
    return this.quantumLearningStates.get(key)!;
  }

  private predictDifficulty(quantumStates: number[], metrics: LearningVelocityMetrics): number {
    // Quantum-inspired calculation using entangled learning states
    const [understanding, confusion, mastery, breakthrough] = quantumStates;
    const cognitiveLoad = metrics.cognitiveLoadIndex;
    const adaptationSpeed = metrics.adaptationSpeed;
    
    // Superposition collapse based on observation
    const difficultyState = (confusion * cognitiveLoad - understanding * adaptationSpeed + mastery * 0.3) / 2;
    return Math.max(0.1, Math.min(0.9, difficultyState + 0.5));
  }

  private predictTimeToMastery(currentMastery: number, learningRate: number): number {
    if (currentMastery >= 0.8) return 1; // Already near mastery
    if (learningRate === 0) return 100; // No learning progress
    
    const remainingMastery = 0.8 - currentMastery;
    const estimatedSessions = remainingMastery / Math.max(0.01, learningRate);
    
    return Math.max(1, Math.min(50, estimatedSessions));
  }

  private recommendIntervention(
    difficulty: number,
    cognitiveLoad: number,
    strugglingConceptsCount: number
  ): PredictiveModel['recommendedIntervention'] {
    if (difficulty > 0.8 || cognitiveLoad > 0.7) return 'tutor_assistance';
    if (strugglingConceptsCount > 3) return 'alternative_approach';
    if (difficulty > 0.6) return 'review';
    return 'none';
  }

  private calculatePredictionConfidence(historyLength: number, metrics: LearningVelocityMetrics): number {
    const baseConfidence = Math.min(0.9, historyLength * 0.1 + 0.3);
    const consistencyBonus = metrics.adaptationSpeed > 0.7 ? 0.1 : 0;
    return Math.min(0.95, baseConfidence + consistencyBonus);
  }

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

  private updateLearningHistory(userId: string, metrics: LearningVelocityMetrics): void {
    const history = this.learningHistory.get(userId) || [];
    history.push(metrics);
    
    // Keep only last 20 sessions to prevent memory bloat
    if (history.length > 20) {
      history.shift();
    }
    
    this.learningHistory.set(userId, history);
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

  public getQuantumLearningInsights(userId: string): {
    coherenceScore: number;
    entanglementLevel: number;
    superpositionStates: string[];
  } {
    const userStates = Array.from(this.quantumLearningStates.entries())
      .filter(([key, _]) => key.startsWith(userId));
    
    if (userStates.length === 0) {
      return {
        coherenceScore: 0.5,
        entanglementLevel: 0,
        superpositionStates: []
      };
    }
    
    const allStates = userStates.flatMap(([_, states]) => states);
    const coherenceScore = this.calculateCoherence(allStates);
    const entanglementLevel = this.calculateEntanglement(userStates);
    const superpositionStates = this.analyzeSuperpositionStates(userStates);
    
    return {
      coherenceScore,
      entanglementLevel,
      superpositionStates
    };
  }

  private calculateCoherence(states: number[]): number {
    const mean = states.reduce((sum, state) => sum + state, 0) / states.length;
    const variance = states.reduce((sum, state) => sum + Math.pow(state - mean, 2), 0) / states.length;
    return Math.max(0, 1 - variance); // Higher coherence = lower variance
  }

  private calculateEntanglement(userStates: [string, number[]][]): number {
    if (userStates.length < 2) return 0;
    
    let totalCorrelation = 0;
    let pairs = 0;
    
    for (let i = 0; i < userStates.length; i++) {
      for (let j = i + 1; j < userStates.length; j++) {
        const correlation = this.calculateCorrelation(userStates[i][1], userStates[j][1]);
        totalCorrelation += Math.abs(correlation);
        pairs++;
      }
    }
    
    return pairs > 0 ? totalCorrelation / pairs : 0;
  }

  private calculateCorrelation(statesA: number[], statesB: number[]): number {
    const n = Math.min(statesA.length, statesB.length);
    if (n === 0) return 0;
    
    const meanA = statesA.slice(0, n).reduce((sum, x) => sum + x, 0) / n;
    const meanB = statesB.slice(0, n).reduce((sum, x) => sum + x, 0) / n;
    
    let numerator = 0;
    let sumSqA = 0;
    let sumSqB = 0;
    
    for (let i = 0; i < n; i++) {
      const diffA = statesA[i] - meanA;
      const diffB = statesB[i] - meanB;
      numerator += diffA * diffB;
      sumSqA += diffA * diffA;
      sumSqB += diffB * diffB;
    }
    
    const denominator = Math.sqrt(sumSqA * sumSqB);
    return denominator !== 0 ? numerator / denominator : 0;
  }

  private analyzeSuperpositionStates(userStates: [string, number[]][]): string[] {
    const states: string[] = [];
    
    userStates.forEach(([concept, quantumStates]) => {
      const [understanding, confusion, mastery, breakthrough] = quantumStates;
      const dominant = Math.max(understanding, confusion, mastery, breakthrough);
      
      if (dominant === understanding) states.push(`${concept}: Understanding Dominant`);
      else if (dominant === confusion) states.push(`${concept}: Confusion State`);
      else if (dominant === mastery) states.push(`${concept}: Mastery Achieved`);
      else states.push(`${concept}: Breakthrough Potential`);
    });
    
    return states;
  }
}

export const advancedLearningAnalytics = new AdvancedLearningAnalytics();
