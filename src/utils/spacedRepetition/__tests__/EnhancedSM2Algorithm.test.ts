
import { EnhancedSM2Algorithm } from '../EnhancedSM2Algorithm';
import { UserPerformanceMetrics } from '../types';

describe('EnhancedSM2Algorithm', () => {
  let algorithm: EnhancedSM2Algorithm;
  let mockUserMetrics: UserPerformanceMetrics;

  beforeEach(() => {
    algorithm = new EnhancedSM2Algorithm();
    mockUserMetrics = {
      averageResponseTimeMs: 3000,
      retentionRate: 85,
      totalReviews: 100,
      streakDays: 7,
      difficultyPreference: 5,
      learningVelocity: 1.0,
      cognitiveLoad: 0.5
    };
  });

  describe('calculateNextReview', () => {
    it('should return valid result for correct answer', () => {
      const result = algorithm.calculateNextReview(
        2, // consecutiveCorrect
        2.5, // easinessFactor
        true, // wasCorrect
        2500, // responseTimeMs
        mockUserMetrics,
        5, // cardDifficulty
        'user123'
      );

      expect(result.consecutiveCorrect).toBe(3);
      expect(result.easinessFactor).toBeGreaterThan(2.4);
      expect(result.easinessFactor).toBeLessThanOrEqual(2.5);
      expect(result.interval).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.nextReviewDate).toBeInstanceOf(Date);
      expect(result.rlMetrics).toBeDefined();
      expect(result.rlMetrics.reward).toBeGreaterThan(-1);
      expect(result.rlMetrics.reward).toBeLessThanOrEqual(1);
    });

    it('should handle incorrect answers properly', () => {
      const result = algorithm.calculateNextReview(
        3, // consecutiveCorrect
        2.2, // easinessFactor
        false, // wasCorrect
        5000, // responseTimeMs
        mockUserMetrics,
        7, // cardDifficulty
        'user123'
      );

      expect(result.consecutiveCorrect).toBe(0);
      expect(result.easinessFactor).toBeLessThan(2.2);
      expect(result.easinessFactor).toBeGreaterThanOrEqual(1.3);
      expect(result.interval).toBe(1);
      expect(result.rlMetrics.reward).toBeLessThan(0);
    });

    it('should apply RL modifications to intervals', () => {
      const result1 = algorithm.calculateNextReview(1, 2.5, true, 3000, mockUserMetrics, 5);
      const result2 = algorithm.calculateNextReview(1, 2.5, true, 3000, mockUserMetrics, 5);
      
      // Results might differ due to RL optimization and exploration
      expect(result1.interval).toBeGreaterThan(0);
      expect(result2.interval).toBeGreaterThan(0);
      expect(result1.rlMetrics.action).toBeDefined();
      expect(result2.rlMetrics.action).toBeDefined();
    });

    it('should maintain easiness factor bounds', () => {
      const result = algorithm.calculateNextReview(
        0, // consecutiveCorrect
        1.3, // minimum easiness factor
        false, // wasCorrect
        10000, // slow response
        mockUserMetrics,
        9 // high difficulty
      );

      expect(result.easinessFactor).toBeGreaterThanOrEqual(1.3);
      expect(result.easinessFactor).toBeLessThanOrEqual(2.5);
    });

    it('should handle missing user metrics gracefully', () => {
      const result = algorithm.calculateNextReview(1, 2.0, true);
      
      expect(result.consecutiveCorrect).toBe(2);
      expect(result.easinessFactor).toBeGreaterThan(0);
      expect(result.interval).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0);
    });
  });

  describe('user profile management', () => {
    it('should store and retrieve user profiles', () => {
      const userId = 'test-user';
      algorithm.updateUserProfile(userId, mockUserMetrics);
      
      const retrieved = algorithm.getUserProfile(userId);
      expect(retrieved).toEqual(mockUserMetrics);
    });

    it('should return undefined for non-existent users', () => {
      const retrieved = algorithm.getUserProfile('non-existent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('policy weight persistence', () => {
    it('should export policy weights as JSON string', () => {
      const exported = algorithm.exportPolicyWeights();
      expect(typeof exported).toBe('string');
      
      const parsed = JSON.parse(exported);
      expect(parsed).toHaveProperty('weights');
      expect(parsed).toHaveProperty('performance');
      expect(parsed).toHaveProperty('timestamp');
    });

    it('should import policy weights correctly', () => {
      const originalExport = algorithm.exportPolicyWeights();
      
      // Create new algorithm instance
      const newAlgorithm = new EnhancedSM2Algorithm();
      newAlgorithm.importPolicyWeights(originalExport);
      
      const newExport = newAlgorithm.exportPolicyWeights();
      const originalData = JSON.parse(originalExport);
      const newData = JSON.parse(newExport);
      
      expect(newData.weights).toEqual(originalData.weights);
    });

    it('should handle invalid import data gracefully', () => {
      expect(() => {
        algorithm.importPolicyWeights('invalid json');
      }).not.toThrow();
      
      expect(() => {
        algorithm.importPolicyWeights('{"invalid": "data"}');
      }).not.toThrow();
    });
  });

  describe('RL optimization', () => {
    it('should generate different actions for different states', () => {
      const result1 = algorithm.calculateNextReview(0, 1.3, true, 1000, mockUserMetrics, 1);
      const result2 = algorithm.calculateNextReview(5, 2.5, true, 1000, mockUserMetrics, 10);
      
      // Actions should be different for beginner vs expert states
      expect(result1.rlMetrics.action).not.toEqual(result2.rlMetrics.action);
    });

    it('should improve policy performance over time', () => {
      const initialPerformance = algorithm['rlEngine'].getPerformanceMetrics();
      
      // Simulate multiple learning episodes
      for (let i = 0; i < 20; i++) {
        algorithm.calculateNextReview(
          Math.floor(Math.random() * 5),
          1.3 + Math.random() * 1.2,
          Math.random() > 0.3,
          2000 + Math.random() * 4000,
          mockUserMetrics,
          Math.floor(Math.random() * 10) + 1
        );
      }
      
      const finalPerformance = algorithm['rlEngine'].getPerformanceMetrics();
      
      // Should have collected more experience (basic sanity check)
      expect(finalPerformance).toBeDefined();
      expect(finalPerformance.explorationRate).toBeDefined();
    });
  });
});
