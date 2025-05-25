
import { QuantumLearningInsights } from '../types/AnalyticsTypes';

export class QuantumInsightsCalculator {
  private quantumLearningStates: Map<string, number[]> = new Map();

  public getQuantumLearningInsights(userId: string): QuantumLearningInsights {
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

  public updateQuantumStates(userId: string, concept: string): void {
    const key = `${userId}-${concept}`;
    if (!this.quantumLearningStates.has(key)) {
      this.quantumLearningStates.set(key, [
        Math.random(),
        Math.random(),
        Math.random(),
        Math.random()
      ]);
    }
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
