
import { LearningPath, UserInteraction } from '../../../types/agents';

export class QuantumPathOptimizer {
  public optimizeLearningPath(
    currentPath: LearningPath,
    userInteractions: UserInteraction[]
  ): LearningPath {
    const quantumOptimization = this.applyQuantumOptimization(currentPath, userInteractions);
    
    return {
      ...currentPath,
      topics: quantumOptimization.optimizedSequence,
      estimatedDuration: quantumOptimization.estimatedTime,
      difficulty: quantumOptimization.adaptiveDifficulty
    };
  }

  private applyQuantumOptimization(
    path: LearningPath,
    interactions: UserInteraction[]
  ): {
    optimizedSequence: string[];
    estimatedTime: number;
    adaptiveDifficulty: 'beginner' | 'intermediate' | 'advanced';
  } {
    const averageAccuracy = this.calculateAverageAccuracy(interactions);
    const adaptiveDifficulty = this.determineDifficulty(averageAccuracy);
    
    return {
      optimizedSequence: this.optimizeTopicSequence(path.topics, interactions),
      estimatedTime: Math.round(path.estimatedDuration * (2 - averageAccuracy)),
      adaptiveDifficulty
    };
  }

  private calculateAverageAccuracy(interactions: UserInteraction[]): number {
    if (interactions.length === 0) return 0.5;
    
    const totalSatisfaction = interactions.reduce((sum, interaction) => {
      return sum + (interaction.satisfaction || 0.5);
    }, 0);
    
    return totalSatisfaction / interactions.length / 5; // Assuming satisfaction is 1-5
  }

  private determineDifficulty(accuracy: number): 'beginner' | 'intermediate' | 'advanced' {
    if (accuracy < 0.4) return 'beginner';
    if (accuracy < 0.7) return 'intermediate';
    return 'advanced';
  }

  private optimizeTopicSequence(topics: string[], interactions: UserInteraction[]): string[] {
    // Simple optimization based on interaction patterns
    const topicPerformance = new Map<string, number>();
    
    interactions.forEach(interaction => {
      const topic = interaction.context?.topicId;
      if (topic) {
        const current = topicPerformance.get(topic) || 0;
        topicPerformance.set(topic, current + (interaction.satisfaction || 0.5));
      }
    });
    
    return topics.sort((a, b) => {
      const aPerf = topicPerformance.get(a) || 0;
      const bPerf = topicPerformance.get(b) || 0;
      return bPerf - aPerf;
    });
  }
}
