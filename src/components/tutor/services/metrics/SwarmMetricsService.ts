
import { RedisEventBus, redisEventBus } from "../core/RedisEventBus";

export interface SwarmMetricsRecord {
  id?: string;
  timestamp: Date;
  taskCount: number;
  durationMs: number;
  successRate: number;
  fanoutRatio: number;
  resourceUsage?: {
    cpu: number;
    memory: number;
    tokens: number;
  };
}

export interface AggregatedSwarmMetrics {
  period: string;
  avgFanoutRatio: number;
  avgSuccessRate: number;
  avgDurationMs: number;
  totalTasks: number;
  dataPoints: SwarmMetricsRecord[];
  startDate?: Date;
  endDate?: Date;
}

/**
 * SwarmMetricsService - Collects and aggregates metrics for OpenAI Swarm operations
 * Implements the swarm-metrics feature from QuorumForge OS spec
 */
export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];
  private eventBus: RedisEventBus;
  
  constructor(eventBus?: RedisEventBus) {
    this.eventBus = eventBus || redisEventBus;
    this.setupEventListeners();
    
    console.log('Swarm Metrics Service initialized');
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for swarm execution metrics
    this.eventBus.subscribe('swarm:metrics', (metrics: SwarmMetricsRecord) => {
      this.recordMetrics(metrics);
    });
  }
  
  /**
   * Record metrics from a swarm execution
   */
  public recordMetrics(metrics: SwarmMetricsRecord): void {
    // Add an ID if not present
    if (!metrics.id) {
      metrics.id = `swarm_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }
    
    // Convert timestamp to Date if it's a string
    if (typeof metrics.timestamp === 'string') {
      metrics.timestamp = new Date(metrics.timestamp);
    }
    
    this.metrics.push(metrics);
    
    // Limit metrics history to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
    
    // Publish metrics to event bus
    this.eventBus.publish('swarm:metrics', metrics).catch(err => {
      console.error('Error publishing swarm metrics:', err);
    });
    
    // Store latest metrics for dashboard
    this.eventBus.setValue('swarm:latest_metrics', this.getRecentMetrics()).catch(err => {
      console.error('Error storing latest metrics:', err);
    });
  }
  
  /**
   * Get all recorded metrics
   */
  public getAllMetrics(): SwarmMetricsRecord[] {
    return [...this.metrics];
  }
  
  /**
   * Get recent metrics (last N records)
   */
  public getRecentMetrics(count: number = 10): SwarmMetricsRecord[] {
    return this.metrics.slice(-count);
  }
  
  /**
   * Get metrics for a specific time period
   */
  public getMetricsForPeriod(startDate: Date, endDate: Date): SwarmMetricsRecord[] {
    return this.metrics.filter(metric => 
      metric.timestamp >= startDate && metric.timestamp <= endDate
    );
  }
  
  /**
   * Get aggregated metrics for a specific period
   */
  public getAggregatedMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ): AggregatedSwarmMetrics[] {
    const now = new Date();
    const result: AggregatedSwarmMetrics[] = [];
    
    // Calculate period duration in milliseconds
    const periodDuration = 
      period === 'hour' ? 60 * 60 * 1000 : 
      period === 'day' ? 24 * 60 * 60 * 1000 : 
      7 * 24 * 60 * 60 * 1000;
    
    // Generate periods
    for (let i = 0; i < limit; i++) {
      const endDate = new Date(now.getTime() - i * periodDuration);
      const startDate = new Date(endDate.getTime() - periodDuration);
      
      const periodMetrics = this.getMetricsForPeriod(startDate, endDate);
      
      const totalTasks = periodMetrics.reduce((sum, m) => sum + m.taskCount, 0);
      const avgSuccessRate = periodMetrics.length > 0 
        ? periodMetrics.reduce((sum, m) => sum + m.successRate, 0) / periodMetrics.length
        : 0;
      const avgDurationMs = periodMetrics.length > 0
        ? periodMetrics.reduce((sum, m) => sum + m.durationMs, 0) / periodMetrics.length
        : 0;
      const avgFanoutRatio = periodMetrics.length > 0
        ? periodMetrics.reduce((sum, m) => sum + m.fanoutRatio, 0) / periodMetrics.length
        : 0;
      
      result.push({
        period: this.formatPeriodLabel(startDate, endDate, period),
        avgFanoutRatio,
        avgSuccessRate,
        avgDurationMs,
        totalTasks,
        dataPoints: periodMetrics,
        startDate,
        endDate
      });
    }
    
    return result;
  }
  
  /**
   * Format a period label
   */
  private formatPeriodLabel(
    startDate: Date, 
    endDate: Date, 
    period: 'hour' | 'day' | 'week'
  ): string {
    const options: Intl.DateTimeFormatOptions = {};
    
    switch (period) {
      case 'hour':
        options.hour = '2-digit';
        return `${startDate.getHours()}:00 - ${endDate.getHours()}:00`;
      case 'day':
        options.month = 'short';
        options.day = 'numeric';
        return startDate.toLocaleDateString(undefined, options);
      case 'week':
        options.month = 'short';
        options.day = 'numeric';
        return `${startDate.toLocaleDateString(undefined, options)} - ${
          endDate.toLocaleDateString(undefined, options)
        }`;
      default:
        return `${startDate.toISOString()} - ${endDate.toISOString()}`;
    }
  }
  
  /**
   * Clear all metrics (for testing)
   */
  public clearMetrics(): void {
    this.metrics = [];
  }
}
