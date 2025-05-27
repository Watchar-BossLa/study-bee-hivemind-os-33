
import { RewardCalculator, ReviewOutcome } from '../rlEngine/RewardCalculator';

describe('RewardCalculator', () => {
  let calculator: RewardCalculator;
  let baseOutcome: ReviewOutcome;

  beforeEach(() => {
    calculator = new RewardCalculator();
    baseOutcome = {
      wasCorrect: true,
      responseTimeMs: 3000,
      expectedResponseTime: 3000,
      difficultyLevel: 5,
      previousInterval: 6 * 24 * 60 * 60 * 1000, // 6 days in ms
      actualInterval: 15 * 24 * 60 * 60 * 1000 // 15 days in ms
    };
  });

  describe('calculateReward', () => {
    it('should return positive reward for correct answers', () => {
      const reward = calculator.calculateReward(baseOutcome);
      expect(reward).toBeGreaterThan(0);
      expect(reward).toBeLessThanOrEqual(1);
    });

    it('should return negative reward for incorrect answers', () => {
      const incorrectOutcome = { ...baseOutcome, wasCorrect: false };
      const reward = calculator.calculateReward(incorrectOutcome);
      expect(reward).toBeLessThan(0);
      expect(reward).toBeGreaterThanOrEqual(-1);
    });

    it('should reward optimal response times', () => {
      const optimalOutcome = { ...baseOutcome, responseTimeMs: 3000 };
      const slowOutcome = { ...baseOutcome, responseTimeMs: 10000 };
      const fastOutcome = { ...baseOutcome, responseTimeMs: 1000 };
      
      const optimalReward = calculator.calculateReward(optimalOutcome);
      const slowReward = calculator.calculateReward(slowOutcome);
      const fastReward = calculator.calculateReward(fastOutcome);
      
      expect(optimalReward).toBeGreaterThan(slowReward);
      expect(optimalReward).toBeGreaterThan(fastReward);
    });

    it('should reward longer retention intervals for correct answers', () => {
      const shortIntervalOutcome = {
        ...baseOutcome,
        actualInterval: 1 * 24 * 60 * 60 * 1000 // 1 day
      };
      const longIntervalOutcome = {
        ...baseOutcome,
        actualInterval: 30 * 24 * 60 * 60 * 1000 // 30 days
      };
      
      const shortReward = calculator.calculateReward(shortIntervalOutcome);
      const longReward = calculator.calculateReward(longIntervalOutcome);
      
      expect(longReward).toBeGreaterThan(shortReward);
    });

    it('should penalize forgetting after long intervals', () => {
      const shortForgetOutcome = {
        ...baseOutcome,
        wasCorrect: false,
        actualInterval: 1 * 24 * 60 * 60 * 1000 // 1 day
      };
      const longForgetOutcome = {
        ...baseOutcome,
        wasCorrect: false,
        actualInterval: 30 * 24 * 60 * 60 * 1000 // 30 days
      };
      
      const shortReward = calculator.calculateReward(shortForgetOutcome);
      const longReward = calculator.calculateReward(longForgetOutcome);
      
      expect(longReward).toBeLessThan(shortReward);
    });

    it('should reward appropriate engagement time based on difficulty', () => {
      const easyQuickOutcome = {
        ...baseOutcome,
        difficultyLevel: 2,
        responseTimeMs: 2000
      };
      const hardSlowOutcome = {
        ...baseOutcome,
        difficultyLevel: 8,
        responseTimeMs: 8000
      };
      
      const easyReward = calculator.calculateReward(easyQuickOutcome);
      const hardReward = calculator.calculateReward(hardSlowOutcome);
      
      expect(easyReward).toBeGreaterThan(0);
      expect(hardReward).toBeGreaterThan(0);
    });

    it('should clamp rewards between -1 and 1', () => {
      const extremeOutcome = {
        ...baseOutcome,
        responseTimeMs: 100000, // extremely slow
        actualInterval: 365 * 24 * 60 * 60 * 1000 // 1 year
      };
      
      const reward = calculator.calculateReward(extremeOutcome);
      expect(reward).toBeGreaterThanOrEqual(-1);
      expect(reward).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateLongTermReward', () => {
    it('should return zero for insufficient history', () => {
      const shortHistory = [{ wasCorrect: true, interval: 1, timestamp: Date.now() }];
      const reward = calculator.calculateLongTermReward(shortHistory);
      expect(reward).toBe(0);
    });

    it('should reward high accuracy patterns', () => {
      const highAccuracyHistory = Array.from({ length: 10 }, (_, i) => ({
        wasCorrect: i < 9, // 90% accuracy
        interval: 7 * (i + 1),
        timestamp: Date.now() - i * 7 * 24 * 60 * 60 * 1000
      }));
      
      const reward = calculator.calculateLongTermReward(highAccuracyHistory);
      expect(reward).toBeGreaterThan(0);
    });

    it('should reward growing intervals (spaced repetition working)', () => {
      const growingHistory = Array.from({ length: 5 }, (_, i) => ({
        wasCorrect: true,
        interval: Math.pow(2, i), // Exponential growth
        timestamp: Date.now() - i * 24 * 60 * 60 * 1000
      }));
      
      const reward = calculator.calculateLongTermReward(growingHistory);
      expect(reward).toBeGreaterThan(0);
    });

    it('should reward consistency in performance', () => {
      const consistentHistory = Array.from({ length: 8 }, (_, i) => ({
        wasCorrect: true,
        interval: 7, // Consistent interval
        timestamp: Date.now() - i * 7 * 24 * 60 * 60 * 1000
      }));
      
      const inconsistentHistory = Array.from({ length: 8 }, (_, i) => ({
        wasCorrect: i % 2 === 0, // Alternating performance
        interval: 7,
        timestamp: Date.now() - i * 7 * 24 * 60 * 60 * 1000
      }));
      
      const consistentReward = calculator.calculateLongTermReward(consistentHistory);
      const inconsistentReward = calculator.calculateLongTermReward(inconsistentHistory);
      
      expect(consistentReward).toBeGreaterThan(inconsistentReward);
    });

    it('should return values between -1 and 1', () => {
      const randomHistory = Array.from({ length: 10 }, (_, i) => ({
        wasCorrect: Math.random() > 0.5,
        interval: Math.random() * 30,
        timestamp: Date.now() - i * 24 * 60 * 60 * 1000
      }));
      
      const reward = calculator.calculateLongTermReward(randomHistory);
      expect(reward).toBeGreaterThanOrEqual(-1);
      expect(reward).toBeLessThanOrEqual(1);
    });
  });
});
