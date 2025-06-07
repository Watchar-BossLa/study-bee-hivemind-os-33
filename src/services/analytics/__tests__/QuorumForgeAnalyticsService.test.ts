
import { quorumForgeAnalyticsService } from '../QuorumForgeAnalyticsService';

describe('QuorumForgeAnalyticsService', () => {
  beforeEach(() => {
    // Reset the service state before each test
    jest.clearAllMocks();
  });

  describe('fetchAnalyticsData', () => {
    it('should return analytics data with all required metrics', async () => {
      const data = await quorumForgeAnalyticsService.fetchAnalyticsData();

      expect(data).toHaveProperty('agentMetrics');
      expect(data).toHaveProperty('consensusMetrics');
      expect(data).toHaveProperty('learningPathMetrics');
      expect(data).toHaveProperty('systemHealth');
      expect(data).toHaveProperty('lastUpdated');

      expect(Array.isArray(data.agentMetrics)).toBe(true);
      expect(Array.isArray(data.consensusMetrics)).toBe(true);
      expect(Array.isArray(data.learningPathMetrics)).toBe(true);
      expect(typeof data.systemHealth).toBe('object');
      expect(typeof data.lastUpdated).toBe('number');
    });

    it('should generate agent metrics with expected structure', async () => {
      const data = await quorumForgeAnalyticsService.fetchAnalyticsData();
      
      expect(data.agentMetrics.length).toBeGreaterThan(0);
      
      const agent = data.agentMetrics[0];
      expect(agent).toHaveProperty('agentId');
      expect(agent).toHaveProperty('agentName');
      expect(agent).toHaveProperty('responseTime');
      expect(agent).toHaveProperty('accuracyScore');
      expect(agent).toHaveProperty('consensusParticipation');
      expect(agent).toHaveProperty('tasksCompleted');
      expect(agent).toHaveProperty('timestamp');

      expect(typeof agent.responseTime).toBe('number');
      expect(agent.accuracyScore).toBeGreaterThanOrEqual(0);
      expect(agent.accuracyScore).toBeLessThanOrEqual(1);
      expect(agent.consensusParticipation).toBeGreaterThanOrEqual(0);
      expect(agent.consensusParticipation).toBeLessThanOrEqual(1);
    });

    it('should generate consensus metrics with valid data ranges', async () => {
      const data = await quorumForgeAnalyticsService.fetchAnalyticsData();
      
      expect(data.consensusMetrics.length).toBeGreaterThan(0);
      
      const consensus = data.consensusMetrics[0];
      expect(consensus).toHaveProperty('sessionId');
      expect(consensus).toHaveProperty('participantCount');
      expect(consensus).toHaveProperty('consensusReached');
      expect(consensus).toHaveProperty('convergenceTime');
      expect(consensus).toHaveProperty('finalConfidence');

      expect(consensus.participantCount).toBeGreaterThanOrEqual(3);
      expect(consensus.participantCount).toBeLessThanOrEqual(7);
      expect(typeof consensus.consensusReached).toBe('boolean');
      expect(consensus.finalConfidence).toBeGreaterThanOrEqual(0);
      expect(consensus.finalConfidence).toBeLessThanOrEqual(1);
    });

    it('should generate system health metrics within expected ranges', async () => {
      const data = await quorumForgeAnalyticsService.fetchAnalyticsData();
      
      const health = data.systemHealth;
      expect(health.cpuUsage).toBeGreaterThanOrEqual(0);
      expect(health.cpuUsage).toBeLessThanOrEqual(100);
      expect(health.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(health.memoryUsage).toBeLessThanOrEqual(100);
      expect(health.errorRate).toBeGreaterThanOrEqual(0);
      expect(health.errorRate).toBeLessThanOrEqual(1);
      expect(health.activeAgents).toBeGreaterThan(0);
      expect(health.queuedTasks).toBeGreaterThanOrEqual(0);
    });
  });

  describe('startRealTimeUpdates', () => {
    it('should call callback with updated data', (done) => {
      const callback = jest.fn((data) => {
        expect(data).toHaveProperty('agentMetrics');
        expect(data).toHaveProperty('systemHealth');
        cleanup();
        done();
      });

      const cleanup = quorumForgeAnalyticsService.startRealTimeUpdates(callback);
      expect(typeof cleanup).toBe('function');
    });

    it('should return cleanup function that stops updates', () => {
      const callback = jest.fn();
      const cleanup = quorumForgeAnalyticsService.startRealTimeUpdates(callback);
      
      expect(typeof cleanup).toBe('function');
      cleanup();
      
      // After cleanup, callback should not be called again
      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
      }, 100);
    });
  });

  describe('getCachedData', () => {
    it('should return null initially', () => {
      const cachedData = quorumForgeAnalyticsService.getCachedData();
      expect(cachedData).toBeNull();
    });

    it('should return cached data after fetch', async () => {
      await quorumForgeAnalyticsService.fetchAnalyticsData();
      const cachedData = quorumForgeAnalyticsService.getCachedData();
      
      expect(cachedData).not.toBeNull();
      expect(cachedData).toHaveProperty('agentMetrics');
      expect(cachedData).toHaveProperty('lastUpdated');
    });
  });
});
