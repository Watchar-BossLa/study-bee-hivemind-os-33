
import { v4 as uuidv4 } from '@/lib/uuid';

export interface SwarmMetricsRecord {
  timestamp: Date;
  taskCount: number;
  durationMs: number;
  successRate: number;
  fanoutRatio: number;
}

/**
 * Swarm Metrics Service - Collects and exposes metrics for the OpenAI Swarm
 * Implements the swarm-metrics feature from QuorumForge OS spec
 */
export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[];
  private maxStoredRecords: number;
  
  constructor(maxStoredRecords: number = 100) {
    this.metrics = [];
    this.maxStoredRecords = maxStoredRecords;
    
    // Load existing metrics from storage if available
    this.loadMetricsFromStorage();
    
    console.log('Swarm Metrics Service initialized');
  }
  
  /**
   * Record a new metrics entry
   */
  public recordMetrics(record: SwarmMetricsRecord): void {
    this.metrics.push(record);
    
    // Trim if we have too many records
    if (this.metrics.length > this.maxStoredRecords) {
      this.metrics = this.metrics.slice(-this.maxStoredRecords);
    }
    
    // Save to storage
    this.saveMetricsToStorage();
  }
  
  /**
   * Get all metrics records
   */
  public getAllMetrics(): SwarmMetricsRecord[] {
    return [...this.metrics];
  }
  
  /**
   * Get metrics aggregated by time period
   */
  public getAggregatedMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ): SwarmMetricsRecord[] {
    const now = new Date();
    const periodInMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[period];
    
    // Group metrics by period
    const groupedMetrics: Map<string, SwarmMetricsRecord[]> = new Map();
    
    for (const metric of this.metrics) {
      const periodStart = new Date(
        Math.floor(metric.timestamp.getTime() / periodInMs) * periodInMs
      );
      const key = periodStart.toISOString();
      
      if (!groupedMetrics.has(key)) {
        groupedMetrics.set(key, []);
      }
      
      groupedMetrics.get(key)!.push(metric);
    }
    
    // Aggregate metrics in each period
    const aggregated = Array.from(groupedMetrics.entries()).map(([key, metrics]) => {
      const totalTasks = metrics.reduce((sum, m) => sum + m.taskCount, 0);
      const weightedDuration = metrics.reduce(
        (sum, m) => sum + m.durationMs * m.taskCount, 0
      );
      const weightedSuccessRate = metrics.reduce(
        (sum, m) => sum + m.successRate * m.taskCount, 0
      );
      const weightedFanoutRatio = metrics.reduce(
        (sum, m) => sum + m.fanoutRatio * m.taskCount, 0
      );
      
      return {
        timestamp: new Date(key),
        taskCount: totalTasks,
        durationMs: totalTasks > 0 ? weightedDuration / totalTasks : 0,
        successRate: totalTasks > 0 ? weightedSuccessRate / totalTasks : 1.0,
        fanoutRatio: totalTasks > 0 ? weightedFanoutRatio / totalTasks : 1.0
      };
    });
    
    // Sort by timestamp (newest first) and limit
    return aggregated
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  /**
   * Save metrics to local storage
   */
  private saveMetricsToStorage(): void {
    try {
      localStorage.setItem('swarm_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Failed to save metrics to storage:', error);
    }
  }
  
  /**
   * Load metrics from local storage
   */
  private loadMetricsFromStorage(): void {
    try {
      const stored = localStorage.getItem('swarm_metrics');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Convert string timestamps back to Date objects
        this.metrics = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load metrics from storage:', error);
      this.metrics = [];
    }
  }
  
  /**
   * Clear all stored metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
    this.saveMetricsToStorage();
  }
}
