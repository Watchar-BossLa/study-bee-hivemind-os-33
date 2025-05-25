
import { LearningPath, UserInteraction } from '../../types/agents';
import { QuantumStateManager } from './core/QuantumStateManager';
import { QuantumInsightsProcessor } from './core/QuantumInsightsProcessor';
import { QuantumPathOptimizer } from './core/QuantumPathOptimizer';

export interface QuantumState {
  superposition: number[];
  entanglement: Map<string, string[]>;
  coherence: number;
  timestamp: Date;
}

export interface QuantumLearningInsight {
  conceptId: string;
  quantumAdvantage: number;
  optimalPath: string[];
  confidenceLevel: number;
  recommendations: string[];
}

export interface ConceptData {
  concept: string;
  timeSpent: number;
  accuracy: number;
  attempts: number;
  difficulty: number;
}

export class QuantumLearningEngine {
  private stateManager: QuantumStateManager;
  private insightsProcessor: QuantumInsightsProcessor;
  private pathOptimizer: QuantumPathOptimizer;

  constructor() {
    this.stateManager = new QuantumStateManager();
    this.insightsProcessor = new QuantumInsightsProcessor();
    this.pathOptimizer = new QuantumPathOptimizer();
  }

  public initializeQuantumState(userId: string): QuantumState {
    return this.stateManager.initializeQuantumState(userId);
  }

  public getQuantumLearningInsights(userId: string, conceptData: ConceptData[]): QuantumLearningInsight[] {
    const state = this.stateManager.getQuantumState(userId) || this.stateManager.initializeQuantumState(userId);
    return this.insightsProcessor.generateQuantumInsights(userId, conceptData, state);
  }

  public optimizeLearningPath(
    currentPath: LearningPath,
    userInteractions: UserInteraction[]
  ): LearningPath {
    return this.pathOptimizer.optimizeLearningPath(currentPath, userInteractions);
  }

  public updateQuantumState(userId: string, interaction: UserInteraction): void {
    const satisfactionFactor = (interaction.satisfaction || 0.5) / 5;
    this.stateManager.updateQuantumState(userId, satisfactionFactor);
  }

  public getQuantumState(userId: string): QuantumState | undefined {
    return this.stateManager.getQuantumState(userId);
  }
}
