
import { UserPerformanceMetrics } from '../types';

export interface RLState {
  easinessFactor: number;
  consecutiveCorrect: number;
  responseTimeRatio: number;
  retentionRate: number;
  streakDays: number;
  difficultyLevel: number;
}

export interface RLAction {
  intervalMultiplier: number;
  difficultyAdjustment: number;
  confidenceBoost: number;
}

export interface PolicyParameters {
  learningRate: number;
  explorationRate: number;
  rewardDecay: number;
  gradientClipping: number;
}

export class PolicyGradientEngine {
  private parameters: PolicyParameters;
  private policyWeights: Map<string, number[]>;
  private actionHistory: Array<{ state: RLState; action: RLAction; reward: number }>;
  private readonly stateSize = 6;
  private readonly actionSize = 3;

  constructor(parameters: PolicyParameters = {
    learningRate: 0.001,
    explorationRate: 0.1,
    rewardDecay: 0.95,
    gradientClipping: 1.0
  }) {
    this.parameters = parameters;
    this.policyWeights = new Map();
    this.actionHistory = [];
    this.initializePolicyWeights();
  }

  private initializePolicyWeights(): void {
    // Initialize small random weights for policy network
    const weights: number[] = [];
    for (let i = 0; i < this.stateSize * this.actionSize; i++) {
      weights.push((Math.random() - 0.5) * 0.1);
    }
    this.policyWeights.set('main', weights);
  }

  public generateAction(state: RLState): RLAction {
    const stateVector = this.stateToVector(state);
    const actionProbabilities = this.computeActionProbabilities(stateVector);
    
    // Add exploration noise
    const explorationNoise = Math.random() < this.parameters.explorationRate;
    
    if (explorationNoise) {
      return this.generateRandomAction();
    }
    
    return this.vectorToAction(actionProbabilities);
  }

  private stateToVector(state: RLState): number[] {
    return [
      Math.min(state.easinessFactor / 3.0, 1.0),
      Math.min(state.consecutiveCorrect / 10.0, 1.0),
      Math.min(state.responseTimeRatio, 2.0) / 2.0,
      state.retentionRate / 100.0,
      Math.min(state.streakDays / 30.0, 1.0),
      Math.min(state.difficultyLevel / 10.0, 1.0)
    ];
  }

  private computeActionProbabilities(stateVector: number[]): number[] {
    const weights = this.policyWeights.get('main') || [];
    const logits: number[] = [];
    
    for (let action = 0; action < this.actionSize; action++) {
      let logit = 0;
      for (let state = 0; state < this.stateSize; state++) {
        const weightIndex = action * this.stateSize + state;
        logit += stateVector[state] * (weights[weightIndex] || 0);
      }
      logits.push(logit);
    }
    
    return this.softmax(logits);
  }

  private softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits);
    const expLogits = logits.map(x => Math.exp(x - maxLogit));
    const sumExp = expLogits.reduce((sum, exp) => sum + exp, 0);
    return expLogits.map(exp => exp / sumExp);
  }

  private vectorToAction(probabilities: number[]): RLAction {
    return {
      intervalMultiplier: 0.5 + probabilities[0] * 2.0, // 0.5 to 2.5
      difficultyAdjustment: (probabilities[1] - 0.5) * 0.4, // -0.2 to 0.2
      confidenceBoost: probabilities[2] * 0.3 // 0 to 0.3
    };
  }

  private generateRandomAction(): RLAction {
    return {
      intervalMultiplier: 0.5 + Math.random() * 2.0,
      difficultyAdjustment: (Math.random() - 0.5) * 0.4,
      confidenceBoost: Math.random() * 0.3
    };
  }

  public updatePolicy(state: RLState, action: RLAction, reward: number): void {
    this.actionHistory.push({ state, action, reward });
    
    // Perform policy gradient update every 10 experiences
    if (this.actionHistory.length >= 10) {
      this.performPolicyUpdate();
      this.actionHistory = this.actionHistory.slice(-5); // Keep some history
    }
  }

  private performPolicyUpdate(): void {
    const weights = this.policyWeights.get('main') || [];
    const gradients = new Array(weights.length).fill(0);
    
    // Calculate policy gradients
    for (let i = 0; i < this.actionHistory.length; i++) {
      const { state, action, reward } = this.actionHistory[i];
      const stateVector = this.stateToVector(state);
      
      // Calculate discounted reward
      let discountedReward = 0;
      for (let j = i; j < this.actionHistory.length; j++) {
        const discount = Math.pow(this.parameters.rewardDecay, j - i);
        discountedReward += discount * this.actionHistory[j].reward;
      }
      
      // Compute gradients
      this.computeGradients(stateVector, action, discountedReward, gradients);
    }
    
    // Apply gradients with clipping
    for (let i = 0; i < weights.length; i++) {
      const clippedGradient = Math.max(-this.parameters.gradientClipping,
        Math.min(this.parameters.gradientClipping, gradients[i]));
      weights[i] += this.parameters.learningRate * clippedGradient;
    }
    
    this.policyWeights.set('main', weights);
  }

  private computeGradients(
    stateVector: number[], 
    action: RLAction, 
    reward: number, 
    gradients: number[]
  ): void {
    // Simplified gradient computation for demo
    // In practice, this would use proper policy gradient calculation
    const actionVector = [
      action.intervalMultiplier / 2.5,
      (action.difficultyAdjustment + 0.2) / 0.4,
      action.confidenceBoost / 0.3
    ];
    
    for (let actionIdx = 0; actionIdx < this.actionSize; actionIdx++) {
      for (let stateIdx = 0; stateIdx < this.stateSize; stateIdx++) {
        const gradientIndex = actionIdx * this.stateSize + stateIdx;
        gradients[gradientIndex] += reward * stateVector[stateIdx] * actionVector[actionIdx];
      }
    }
  }

  public getPerformanceMetrics(): {
    averageReward: number;
    explorationRate: number;
    policyEntropy: number;
  } {
    const avgReward = this.actionHistory.length > 0
      ? this.actionHistory.reduce((sum, exp) => sum + exp.reward, 0) / this.actionHistory.length
      : 0;

    return {
      averageReward: avgReward,
      explorationRate: this.parameters.explorationRate,
      policyEntropy: this.calculatePolicyEntropy()
    };
  }

  private calculatePolicyEntropy(): number {
    // Simplified entropy calculation
    return Math.log(this.actionSize) * 0.8; // Placeholder
  }
}
