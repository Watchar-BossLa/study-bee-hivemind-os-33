
import { QuantumLearningInsight, ConceptData, QuantumState } from '../QuantumLearningEngine';

export class QuantumInsightsProcessor {
  public generateQuantumInsights(
    userId: string, 
    conceptData: ConceptData[], 
    quantumState: QuantumState
  ): QuantumLearningInsight[] {
    return conceptData.map(concept => ({
      conceptId: concept.concept,
      quantumAdvantage: this.calculateQuantumAdvantage(concept, quantumState),
      optimalPath: this.generateOptimalPath(concept, quantumState),
      confidenceLevel: quantumState.coherence,
      recommendations: this.generateQuantumRecommendations(concept)
    }));
  }

  private calculateQuantumAdvantage(concept: ConceptData, state: QuantumState): number {
    const difficultyFactor = 1 - (concept.difficulty / 10);
    const accuracyFactor = concept.accuracy;
    const coherenceFactor = state.coherence;
    
    return (difficultyFactor * accuracyFactor * coherenceFactor) * 100;
  }

  private generateOptimalPath(concept: ConceptData, state: QuantumState): string[] {
    const baseTopics = [concept.concept];
    const relatedTopics = this.findEntangledConcepts(concept.concept, state);
    
    return [...baseTopics, ...relatedTopics].slice(0, 5);
  }

  private findEntangledConcepts(concept: string, state: QuantumState): string[] {
    const entangled = state.entanglement.get(concept) || [];
    return entangled.slice(0, 3);
  }

  private generateQuantumRecommendations(concept: ConceptData): string[] {
    const recommendations = [];
    
    if (concept.accuracy < 0.7) {
      recommendations.push(`Focus on fundamentals of ${concept.concept}`);
    }
    
    if (concept.attempts > 5) {
      recommendations.push(`Consider alternative learning approach for ${concept.concept}`);
    }
    
    if (concept.difficulty > 7) {
      recommendations.push(`Break down ${concept.concept} into smaller components`);
    }
    
    return recommendations;
  }
}
