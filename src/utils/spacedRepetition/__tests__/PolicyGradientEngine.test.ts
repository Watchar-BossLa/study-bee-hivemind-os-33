
import { PolicyGradientEngine, RLState, RLAction } from '../rlEngine/PolicyGradientEngine';

describe('PolicyGradientEngine', () => {
  let engine: PolicyGradientEngine;
  let mockState: RLState;

  beforeEach(() => {
    engine = new PolicyGradientEngine();
    mockState = {
      easinessFactor: 2.0,
      consecutiveCorrect: 2,
      responseTimeRatio: 1.2,
      retentionRate: 80,
      streakDays: 5,
      difficultyLevel: 5
    };
  });

  describe('generateAction', () => {
    it('should generate valid actions', () => {
      const action = engine.generateAction(mockState);
      
      expect(action.intervalMultiplier).toBeGreaterThan(0.5);
      expect(action.intervalMultiplier).toBeLessThanOrEqual(2.5);
      expect(action.difficultyAdjustment).toBeGreaterThanOrEqual(-0.2);
      expect(action.difficultyAdjustment).toBeLessThanOrEqual(0.2);
      expect(action.confidenceBoost).toBeGreaterThanOrEqual(0);
      expect(action.confidenceBoost).toBeLessThanOrEqual(0.3);
    });

    it('should generate different actions for different states', () => {
      const action1 = engine.generateAction(mockState);
      
      const differentState: RLState = {
        ...mockState,
        easinessFactor: 1.3,
        consecutiveCorrect: 0,
        retentionRate: 50
      };
      
      const action2 = engine.generateAction(differentState);
      
      // With exploration, actions should eventually differ
      let actionsDiffer = false;
      for (let i = 0; i < 10; i++) {
        const a1 = engine.generateAction(mockState);
        const a2 = engine.generateAction(differentState);
        if (JSON.stringify(a1) !== JSON.stringify(a2)) {
          actionsDiffer = true;
          break;
        }
      }
      expect(actionsDiffer).toBe(true);
    });
  });

  describe('updatePolicy', () => {
    it('should accept policy updates without errors', () => {
      const action: RLAction = {
        intervalMultiplier: 1.5,
        difficultyAdjustment: 0.1,
        confidenceBoost: 0.2
      };
      
      expect(() => {
        engine.updatePolicy(mockState, action, 0.5);
      }).not.toThrow();
    });

    it('should trigger policy updates after sufficient experiences', () => {
      const action: RLAction = {
        intervalMultiplier: 1.5,
        difficultyAdjustment: 0.1,
        confidenceBoost: 0.2
      };
      
      // Add multiple experiences to trigger update
      for (let i = 0; i < 15; i++) {
        engine.updatePolicy(mockState, action, Math.random() * 2 - 1);
      }
      
      // Should not throw and should have processed experiences
      const metrics = engine.getPerformanceMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return valid performance metrics', () => {
      const metrics = engine.getPerformanceMetrics();
      
      expect(metrics.averageReward).toBeGreaterThanOrEqual(-1);
      expect(metrics.averageReward).toBeLessThanOrEqual(1);
      expect(metrics.explorationRate).toBeGreaterThan(0);
      expect(metrics.explorationRate).toBeLessThanOrEqual(1);
      expect(metrics.policyEntropy).toBeGreaterThan(0);
    });

    it('should update metrics after policy updates', () => {
      const initialMetrics = engine.getPerformanceMetrics();
      
      const action: RLAction = {
        intervalMultiplier: 1.0,
        difficultyAdjustment: 0.0,
        confidenceBoost: 0.1
      };
      
      // Add some experiences
      for (let i = 0; i < 5; i++) {
        engine.updatePolicy(mockState, action, 0.8);
      }
      
      const updatedMetrics = engine.getPerformanceMetrics();
      expect(updatedMetrics.averageReward).toBeGreaterThan(initialMetrics.averageReward);
    });
  });

  describe('exploration vs exploitation', () => {
    it('should sometimes generate random actions for exploration', () => {
      const actions: RLAction[] = [];
      
      // Generate many actions, some should be exploratory
      for (let i = 0; i < 100; i++) {
        actions.push(engine.generateAction(mockState));
      }
      
      // Check for action diversity (indicating exploration)
      const uniqueIntervalMultipliers = new Set(
        actions.map(a => Math.round(a.intervalMultiplier * 10))
      );
      
      expect(uniqueIntervalMultipliers.size).toBeGreaterThan(3);
    });
  });
});
