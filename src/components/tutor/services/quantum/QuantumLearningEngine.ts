
export interface QuantumBit {
  concept: string;
  probabilityAmplitude: number;
  phase: number;
  entangled: boolean;
  entangledWith?: string[];
}

export interface QuantumCircuit {
  id: string;
  qubits: QuantumBit[];
  gates: QuantumGate[];
  measurementHistory: number[];
}

export interface QuantumGate {
  type: 'hadamard' | 'pauli-x' | 'pauli-y' | 'pauli-z' | 'cnot' | 'phase' | 'custom';
  targetQubit: number;
  controlQubit?: number;
  angle?: number;
  operation: string;
}

export interface QuantumLearningState {
  userId: string;
  conceptSuperposition: Map<string, number[]>;
  entanglementMatrix: number[][];
  coherenceTime: number;
  decoherenceRate: number;
  quantumAdvantage: number;
}

export class QuantumLearningEngine {
  private learningStates: Map<string, QuantumLearningState> = new Map();
  private quantumCircuits: Map<string, QuantumCircuit> = new Map();
  private readonly maxQubits = 16; // Practical limit for simulation

  public initializeQuantumLearner(userId: string, concepts: string[]): QuantumLearningState {
    const conceptSuperposition = new Map<string, number[]>();
    
    // Initialize each concept as a quantum superposition of learning states
    concepts.forEach(concept => {
      conceptSuperposition.set(concept, [
        Math.random(), // |0⟩ - Not understood
        Math.random(), // |1⟩ - Understood
        Math.random(), // |+⟩ - Partially understood
        Math.random()  // |-⟩ - Confused state
      ]);
    });

    const entanglementMatrix = this.createEntanglementMatrix(concepts.length);
    
    const state: QuantumLearningState = {
      userId,
      conceptSuperposition,
      entanglementMatrix,
      coherenceTime: 1000, // milliseconds
      decoherenceRate: 0.01,
      quantumAdvantage: this.calculateQuantumAdvantage(concepts.length)
    };

    this.learningStates.set(userId, state);
    return state;
  }

  private createEntanglementMatrix(conceptCount: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < conceptCount; i++) {
      matrix[i] = [];
      for (let j = 0; j < conceptCount; j++) {
        // Create quantum entanglement between related concepts
        matrix[i][j] = i === j ? 1 : Math.random() * 0.3;
      }
    }
    return matrix;
  }

  private calculateQuantumAdvantage(conceptCount: number): number {
    // Quantum advantage scales exponentially with number of concepts
    // But practical advantage diminishes due to decoherence
    const theoreticalAdvantage = Math.pow(2, Math.min(conceptCount, 10));
    const practicalAdvantage = theoreticalAdvantage / (1 + conceptCount * 0.1);
    return Math.min(100, practicalAdvantage);
  }

  public applyQuantumLearningGate(
    userId: string,
    concept: string,
    gateType: QuantumGate['type'],
    learningInteraction: {
      correct: boolean;
      timeSpent: number;
      difficulty: number;
      confidence: number;
    }
  ): void {
    const state = this.learningStates.get(userId);
    if (!state) return;

    const conceptStates = state.conceptSuperposition.get(concept);
    if (!conceptStates) return;

    // Apply quantum gate based on learning interaction
    let newStates: number[];
    
    switch (gateType) {
      case 'hadamard':
        newStates = this.applyHadamardGate(conceptStates);
        break;
      case 'pauli-x':
        newStates = this.applyPauliXGate(conceptStates, learningInteraction.correct);
        break;
      case 'phase':
        newStates = this.applyPhaseGate(conceptStates, learningInteraction.confidence);
        break;
      case 'custom':
        newStates = this.applyCustomLearningGate(conceptStates, learningInteraction);
        break;
      default:
        newStates = conceptStates;
    }

    // Normalize quantum states
    newStates = this.normalizeQuantumStates(newStates);
    
    // Apply decoherence
    newStates = this.applyDecoherence(newStates, state.decoherenceRate);
    
    state.conceptSuperposition.set(concept, newStates);
    
    // Update entanglements with related concepts
    this.updateQuantumEntanglements(state, concept, learningInteraction);
  }

  private applyHadamardGate(states: number[]): number[] {
    // Hadamard gate creates superposition
    const [s0, s1, s2, s3] = states;
    return [
      (s0 + s1) / Math.sqrt(2),
      (s0 - s1) / Math.sqrt(2),
      s2,
      s3
    ];
  }

  private applyPauliXGate(states: number[], correct: boolean): number[] {
    // Pauli-X gate flips understanding state based on correctness
    const [s0, s1, s2, s3] = states;
    if (correct) {
      return [s1, s0, s2, s3]; // Flip to understood state
    } else {
      return [s0, s1, s3, s2]; // Increase confusion
    }
  }

  private applyPhaseGate(states: number[], confidence: number): number[] {
    // Phase gate adjusts the phase based on confidence
    const phase = confidence * Math.PI / 2;
    return states.map((state, index) => 
      index % 2 === 1 ? state * Math.cos(phase) : state
    );
  }

  private applyCustomLearningGate(
    states: number[], 
    interaction: { correct: boolean; timeSpent: number; difficulty: number; confidence: number }
  ): number[] {
    const [s0, s1, s2, s3] = states;
    
    // Custom gate that considers all learning factors
    const correctnessFactor = interaction.correct ? 1.2 : 0.8;
    const timeFactor = Math.max(0.5, 2 - interaction.timeSpent / 60000); // Normalize time
    const difficultyFactor = 1 + (interaction.difficulty - 0.5) * 0.3;
    const confidenceFactor = interaction.confidence;
    
    return [
      s0 * (2 - correctnessFactor) * timeFactor,
      s1 * correctnessFactor * confidenceFactor,
      s2 * (1 + confidenceFactor) / difficultyFactor,
      s3 * (2 - correctnessFactor) * difficultyFactor
    ];
  }

  private normalizeQuantumStates(states: number[]): number[] {
    const magnitude = Math.sqrt(states.reduce((sum, state) => sum + state * state, 0));
    return magnitude > 0 ? states.map(state => state / magnitude) : states;
  }

  private applyDecoherence(states: number[], decoherenceRate: number): number[] {
    // Quantum decoherence reduces superposition over time
    return states.map(state => state * (1 - decoherenceRate) + (Math.random() - 0.5) * decoherenceRate * 0.1);
  }

  private updateQuantumEntanglements(
    state: QuantumLearningState,
    concept: string,
    interaction: any
  ): void {
    const concepts = Array.from(state.conceptSuperposition.keys());
    const conceptIndex = concepts.indexOf(concept);
    
    if (conceptIndex === -1) return;
    
    // Update entanglements based on learning correlation
    concepts.forEach((otherConcept, otherIndex) => {
      if (conceptIndex !== otherIndex) {
        const correlation = this.calculateConceptCorrelation(concept, otherConcept);
        const entanglementStrength = state.entanglementMatrix[conceptIndex][otherIndex];
        
        // Strengthen entanglement if concepts are learned together
        const newEntanglement = Math.min(1, entanglementStrength + correlation * 0.1);
        state.entanglementMatrix[conceptIndex][otherIndex] = newEntanglement;
        state.entanglementMatrix[otherIndex][conceptIndex] = newEntanglement;
      }
    });
  }

  private calculateConceptCorrelation(concept1: string, concept2: string): number {
    // Simple semantic similarity based on concept names
    const words1 = concept1.toLowerCase().split(/[\s-_]/);
    const words2 = concept2.toLowerCase().split(/[\s-_]/);
    
    let commonWords = 0;
    words1.forEach(word1 => {
      if (words2.some(word2 => word1.includes(word2) || word2.includes(word1))) {
        commonWords++;
      }
    });
    
    return commonWords / Math.max(words1.length, words2.length);
  }

  public measureQuantumLearningState(userId: string, concept: string): {
    understanding: number;
    confusion: number;
    mastery: number;
    uncertainty: number;
  } {
    const state = this.learningStates.get(userId);
    if (!state) {
      return { understanding: 0.5, confusion: 0.3, mastery: 0.2, uncertainty: 0.8 };
    }

    const conceptStates = state.conceptSuperposition.get(concept);
    if (!conceptStates) {
      return { understanding: 0.5, confusion: 0.3, mastery: 0.2, uncertainty: 0.8 };
    }

    // Quantum measurement collapses the superposition
    const [s0, s1, s2, s3] = conceptStates;
    const probabilities = conceptStates.map(state => state * state);
    const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
    
    if (totalProbability === 0) {
      return { understanding: 0.5, confusion: 0.3, mastery: 0.2, uncertainty: 0.8 };
    }

    const normalized = probabilities.map(p => p / totalProbability);
    
    return {
      understanding: normalized[1] + normalized[2] * 0.5, // |1⟩ and partial |+⟩
      confusion: normalized[3] + normalized[0] * 0.3,     // |-⟩ and some |0⟩
      mastery: normalized[1] * normalized[2],             // Coherent understanding
      uncertainty: 1 - Math.max(...normalized)           // Quantum uncertainty
    };
  }

  public generateQuantumLearningPath(
    userId: string,
    targetConcepts: string[]
  ): {
    optimalSequence: string[];
    quantumAdvantage: number;
    expectedImprovement: number;
    coherenceTime: number;
  } {
    const state = this.learningStates.get(userId);
    if (!state) {
      return {
        optimalSequence: targetConcepts,
        quantumAdvantage: 1,
        expectedImprovement: 0.1,
        coherenceTime: 0
      };
    }

    // Use quantum algorithm to find optimal learning sequence
    const sequence = this.quantumOptimizeLearningPath(state, targetConcepts);
    
    return {
      optimalSequence: sequence,
      quantumAdvantage: state.quantumAdvantage,
      expectedImprovement: this.calculateExpectedImprovement(state, sequence),
      coherenceTime: state.coherenceTime
    };
  }

  private quantumOptimizeLearningPath(
    state: QuantumLearningState,
    concepts: string[]
  ): string[] {
    // Quantum-inspired optimization using simulated annealing
    let currentSequence = [...concepts];
    let bestSequence = [...concepts];
    let bestScore = this.evaluateSequenceScore(state, currentSequence);
    let temperature = 1.0;
    const coolingRate = 0.95;
    
    for (let iteration = 0; iteration < 100; iteration++) {
      // Generate neighbor sequence by swapping two concepts
      const newSequence = [...currentSequence];
      const i = Math.floor(Math.random() * newSequence.length);
      const j = Math.floor(Math.random() * newSequence.length);
      [newSequence[i], newSequence[j]] = [newSequence[j], newSequence[i]];
      
      const newScore = this.evaluateSequenceScore(state, newSequence);
      const deltaScore = newScore - bestScore;
      
      // Quantum tunneling: accept worse solutions with probability
      const acceptanceProbability = deltaScore > 0 ? 1 : Math.exp(deltaScore / temperature);
      
      if (Math.random() < acceptanceProbability) {
        currentSequence = newSequence;
        if (newScore > bestScore) {
          bestSequence = newSequence;
          bestScore = newScore;
        }
      }
      
      temperature *= coolingRate;
    }
    
    return bestSequence;
  }

  private evaluateSequenceScore(state: QuantumLearningState, sequence: string[]): number {
    let score = 0;
    
    for (let i = 0; i < sequence.length - 1; i++) {
      const concept1 = sequence[i];
      const concept2 = sequence[i + 1];
      
      // Score based on quantum entanglement between consecutive concepts
      const concepts = Array.from(state.conceptSuperposition.keys());
      const index1 = concepts.indexOf(concept1);
      const index2 = concepts.indexOf(concept2);
      
      if (index1 >= 0 && index2 >= 0) {
        score += state.entanglementMatrix[index1][index2];
      }
      
      // Bonus for prerequisite relationships
      score += this.calculatePrerequisiteBonus(concept1, concept2);
    }
    
    return score;
  }

  private calculatePrerequisiteBonus(concept1: string, concept2: string): number {
    // Simple heuristic for prerequisite relationships
    const prerequisites: Record<string, string[]> = {
      'algebra': ['arithmetic'],
      'calculus': ['algebra', 'functions'],
      'statistics': ['probability', 'algebra'],
      'linear-algebra': ['algebra'],
      'differential-equations': ['calculus', 'linear-algebra']
    };
    
    const prereqs = prerequisites[concept2.toLowerCase()] || [];
    return prereqs.includes(concept1.toLowerCase()) ? 0.5 : 0;
  }

  private calculateExpectedImprovement(state: QuantumLearningState, sequence: string[]): number {
    const baseImprovement = 0.1;
    const quantumBonus = Math.min(0.3, state.quantumAdvantage / 100);
    const coherenceBonus = Math.min(0.2, state.coherenceTime / 5000);
    
    return baseImprovement + quantumBonus + coherenceBonus;
  }

  public performQuantumMeasurement(userId: string): {
    collapsedStates: Record<string, string>;
    measurementUncertainty: number;
    informationGain: number;
  } {
    const state = this.learningStates.get(userId);
    if (!state) {
      return {
        collapsedStates: {},
        measurementUncertainty: 1,
        informationGain: 0
      };
    }

    const collapsedStates: Record<string, string> = {};
    let totalUncertainty = 0;
    let informationGain = 0;
    
    state.conceptSuperposition.forEach((states, concept) => {
      const measurement = this.measureQuantumLearningState(userId, concept);
      
      // Collapse to most probable state
      if (measurement.mastery > 0.7) {
        collapsedStates[concept] = 'mastered';
      } else if (measurement.understanding > 0.6) {
        collapsedStates[concept] = 'understood';
      } else if (measurement.confusion > 0.5) {
        collapsedStates[concept] = 'confused';
      } else {
        collapsedStates[concept] = 'learning';
      }
      
      totalUncertainty += measurement.uncertainty;
      informationGain += 1 - measurement.uncertainty;
    });
    
    const conceptCount = state.conceptSuperposition.size;
    
    return {
      collapsedStates,
      measurementUncertainty: conceptCount > 0 ? totalUncertainty / conceptCount : 1,
      informationGain: conceptCount > 0 ? informationGain / conceptCount : 0
    };
  }

  public getQuantumCoherence(userId: string): number {
    const state = this.learningStates.get(userId);
    if (!state) return 0;
    
    let totalCoherence = 0;
    let conceptCount = 0;
    
    state.conceptSuperposition.forEach(states => {
      const purity = states.reduce((sum, state) => sum + state * state, 0);
      totalCoherence += purity;
      conceptCount++;
    });
    
    return conceptCount > 0 ? totalCoherence / conceptCount : 0;
  }
}

export const quantumLearningEngine = new QuantumLearningEngine();
