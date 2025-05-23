
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAISwarmWrapper } from '../components/tutor/services/frameworks/OpenAISwarmWrapper';
import { AutogenTurnGuard } from '../components/tutor/services/frameworks/AutogenTurnGuard';
import { LangChainQuotaGuard } from '../components/tutor/services/frameworks/LangChainQuotaGuard';
import { SwarmMetricsService } from '../components/tutor/services/metrics/SwarmMetricsService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('OpenAISwarmWrapper', () => {
  let swarm: OpenAISwarmWrapper;
  
  beforeEach(() => {
    swarm = new OpenAISwarmWrapper();
    localStorage.clear();
  });
  
  it('should execute tasks in parallel', async () => {
    const tasks = ['task1', 'task2', 'task3'];
    const results = await swarm.runSwarm(tasks);
    
    expect(results.length).toBe(tasks.length);
    results.forEach(result => {
      expect(typeof result).toBe('string');
    });
  });
  
  it('should track metrics', async () => {
    const tasks = ['task1', 'task2'];
    await swarm.runSwarm(tasks);
    
    const metrics = swarm.getMetrics();
    expect(metrics.taskCount).toBeGreaterThan(0);
    expect(metrics.averageTimeMs).toBeGreaterThan(0);
    expect(metrics.successRate).toBeGreaterThanOrEqual(0);
    expect(metrics.successRate).toBeLessThanOrEqual(1);
  });
});

describe('AutogenTurnGuard', () => {
  let turnGuard: AutogenTurnGuard;
  
  beforeEach(() => {
    turnGuard = new AutogenTurnGuard(5);
  });
  
  it('should register threads with correct limits', () => {
    turnGuard.registerThread('thread1');
    turnGuard.registerThread('thread2', 10);
    
    expect(turnGuard.getTurnLimit('thread1')).toBe(5);
    expect(turnGuard.getTurnLimit('thread2')).toBe(10);
  });
  
  it('should track turns and detect when limit is reached', () => {
    turnGuard.registerThread('thread1', 3);
    
    expect(turnGuard.recordTurn('thread1')).toBe(false);  // 1/3
    expect(turnGuard.recordTurn('thread1')).toBe(false);  // 2/3
    expect(turnGuard.recordTurn('thread1')).toBe(true);   // 3/3 - limit reached
    
    expect(turnGuard.getTurnCount('thread1')).toBe(3);
  });
  
  it('should handle unregistered threads', () => {
    expect(turnGuard.recordTurn('unknown')).toBe(false);
    expect(turnGuard.getTurnCount('unknown')).toBe(1);
    expect(turnGuard.getTurnLimit('unknown')).toBe(5);
  });
});

describe('LangChainQuotaGuard', () => {
  let quotaGuard: LangChainQuotaGuard;
  
  beforeEach(() => {
    quotaGuard = new LangChainQuotaGuard();
    vi.useFakeTimers();
  });
  
  it('should track chain usage against quota limits', () => {
    expect(quotaGuard.guardChain('test-chain')).toBe(true);
    
    // Set a very low limit and verify it gets enforced
    quotaGuard.setQuotaLimit('test-chain', 2);
    
    expect(quotaGuard.guardChain('test-chain')).toBe(true);  // 2/2
    expect(quotaGuard.guardChain('test-chain')).toBe(false); // Over quota
  });
  
  it('should reset quotas after the reset period', () => {
    quotaGuard.setQuotaLimit('reset-test', 1);
    expect(quotaGuard.guardChain('reset-test')).toBe(true);
    expect(quotaGuard.guardChain('reset-test')).toBe(false); // Over quota
    
    // Advance time by 1 hour to trigger quota reset
    vi.advanceTimersByTime(60 * 60 * 1000 + 1000);
    
    // Should be allowed again after reset
    expect(quotaGuard.guardChain('reset-test')).toBe(true);
  });
  
  it('should provide quota usage information', () => {
    quotaGuard.guardChain('usage-test');
    quotaGuard.guardChain('usage-test');
    quotaGuard.setQuotaLimit('usage-test', 10);
    
    const usage = quotaGuard.getQuotaUsage();
    expect(usage['usage-test'].current).toBe(2);
    expect(usage['usage-test'].limit).toBe(10);
    expect(usage['usage-test'].percentage).toBe(0.2);
  });
});

describe('SwarmMetricsService', () => {
  let metricsService: SwarmMetricsService;
  
  beforeEach(() => {
    localStorage.clear();
    metricsService = new SwarmMetricsService();
  });
  
  it('should store and retrieve metrics records', () => {
    const testRecord = {
      timestamp: new Date(),
      taskCount: 5,
      durationMs: 1200,
      successRate: 0.8,
      fanoutRatio: 2.5
    };
    
    metricsService.recordMetrics(testRecord);
    const allMetrics = metricsService.getAllMetrics();
    
    expect(allMetrics.length).toBe(1);
    expect(allMetrics[0].taskCount).toBe(5);
    expect(allMetrics[0].successRate).toBe(0.8);
  });
  
  it('should aggregate metrics by time period', () => {
    // Add metrics for two different hours
    const hour1 = new Date('2023-06-01T10:15:00');
    const hour2 = new Date('2023-06-01T11:30:00');
    
    metricsService.recordMetrics({
      timestamp: hour1,
      taskCount: 10,
      durationMs: 500,
      successRate: 0.9,
      fanoutRatio: 2
    });
    
    metricsService.recordMetrics({
      timestamp: hour1,
      taskCount: 5,
      durationMs: 300,
      successRate: 1.0,
      fanoutRatio: 1.5
    });
    
    metricsService.recordMetrics({
      timestamp: hour2,
      taskCount: 8,
      durationMs: 400,
      successRate: 0.75,
      fanoutRatio: 2.2
    });
    
    const hourlyMetrics = metricsService.getAggregatedMetrics('hour');
    expect(hourlyMetrics.length).toBe(2);
    
    // Find the hour1 aggregate
    const hour1Aggregate = hourlyMetrics.find(
      m => m.timestamp.getHours() === hour1.getHours()
    );
    expect(hour1Aggregate).toBeDefined();
    expect(hour1Aggregate!.taskCount).toBe(15); // 10 + 5
    
    // Weighted average calculation checks
    // For duration: (500*10 + 300*5) / 15 = 5000/15 ≈ 433.33
    expect(Math.round(hour1Aggregate!.durationMs)).toBeCloseTo(433, 0);
    
    // For success rate: (0.9*10 + 1.0*5) / 15 = 9/15 + 5/15 = 14/15 ≈ 0.933
    expect(hour1Aggregate!.successRate).toBeCloseTo(0.933, 2);
  });
});
