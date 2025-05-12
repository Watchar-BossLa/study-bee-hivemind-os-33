
/**
 * Service for collecting and analyzing swarm metrics from QuorumForge
 * Implements requirement from v2.0 TSB section 16 - "Streamlit dashboard (port 8501) 
 * shows council heat-map, token spend, SBOM diff"
 */

export interface SwarmMetric {
  timestamp: number;
  taskCount: number;
  agentCount: number;
  executionTimeMs: number;
  tokenUsage?: number;
  councilId?: string;
  topic?: string;
}

export interface SwarmMetricsRecord {
  timestamp: number;
  taskCount: number;
  durationMs: number;
  successRate: number;
  fanoutRatio: number;
}

export class SwarmMetricsService {
  private static instance: SwarmMetricsService;
  private metrics: SwarmMetric[] = [];
  private readonly MAX_STORED_METRICS = 1000;
  
  private constructor() {
    // Private constructor for singleton
    console.log('SwarmMetricsService initialized');
  }
  
  public static getInstance(): SwarmMetricsService {
    if (!SwarmMetricsService.instance) {
      SwarmMetricsService.instance = new SwarmMetricsService();
    }
    return SwarmMetricsService.instance;
  }
  
  /**
   * Record a new swarm execution metric
   */
  public recordSwarmExecution(
    taskCount: number, 
    agentCount: number, 
    executionTimeMs: number,
    tokenUsage?: number,
    councilId?: string,
    topic?: string
  ): void {
    const metric: SwarmMetric = {
      timestamp: Date.now(),
      taskCount,
      agentCount,
      executionTimeMs,
      tokenUsage,
      councilId,
      topic
    };
    
    this.metrics.push(metric);
    
    // Limit the size of metrics array to prevent memory issues
    if (this.metrics.length > this.MAX_STORED_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_STORED_METRICS);
    }
    
    console.log(`Swarm metrics recorded: ${taskCount} tasks, ${executionTimeMs}ms execution time`);
  }
  
  /**
   * Get all metrics within a time range
   * @param startTime Optional start time in milliseconds
   * @param endTime Optional end time in milliseconds
   * @returns Array of metrics within the time range
   */
  public getMetrics(startTime?: number, endTime?: number): SwarmMetric[] {
    if (!startTime && !endTime) {
      return [...this.metrics];
    }
    
    const now = Date.now();
    const start = startTime || 0;
    const end = endTime || now;
    
    return this.metrics.filter(metric => 
      metric.timestamp >= start && metric.timestamp <= end
    );
  }
  
  /**
   * Get metrics for visualization in the dashboard
   * @param limit Maximum number of metrics to return
   * @param hoursBack Number of hours to look back
   * @returns Recent metrics formatted for visualization
   */
  public getMetricsForVisualization(limit = 50, hoursBack = 24): {
    times: string[];
    taskCounts: number[];
    executionTimes: number[];
    agentCounts: number[];
  } {
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    const recentMetrics = this.metrics
      .filter(metric => metric.timestamp >= cutoffTime)
      .slice(-limit);
    
    return {
      times: recentMetrics.map(m => new Date(m.timestamp).toLocaleTimeString()),
      taskCounts: recentMetrics.map(m => m.taskCount),
      executionTimes: recentMetrics.map(m => m.executionTimeMs),
      agentCounts: recentMetrics.map(m => m.agentCount)
    };
  }
  
  /**
   * Get metrics records for visualization components
   * @param limit Maximum number of records to return
   * @param hoursBack Number of hours to look back
   */
  public getMetricsRecords(limit = 8, hoursBack = 24): SwarmMetricsRecord[] {
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    return this.metrics
      .filter(metric => metric.timestamp >= cutoffTime)
      .slice(-limit)
      .map(metric => ({
        timestamp: metric.timestamp,
        taskCount: metric.taskCount,
        durationMs: metric.executionTimeMs,
        successRate: Math.random() * 0.3 + 0.7, // Simulated success rate between 70-100%
        fanoutRatio: metric.taskCount / Math.max(1, metric.agentCount)
      }));
  }
  
  /**
   * Get performance statistics about swarm executions
   */
  public getPerformanceStats(hoursBack = 24): {
    totalExecutions: number;
    averageTaskCount: number;
    averageExecutionTime: number;
    maxExecutionTime: number;
    totalTokenUsage: number;
  } {
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(metric => metric.timestamp >= cutoffTime);
    
    if (recentMetrics.length === 0) {
      return {
        totalExecutions: 0,
        averageTaskCount: 0,
        averageExecutionTime: 0,
        maxExecutionTime: 0,
        totalTokenUsage: 0
      };
    }
    
    const totalExecutions = recentMetrics.length;
    const averageTaskCount = recentMetrics.reduce((sum, m) => sum + m.taskCount, 0) / totalExecutions;
    const averageExecutionTime = recentMetrics.reduce((sum, m) => sum + m.executionTimeMs, 0) / totalExecutions;
    const maxExecutionTime = Math.max(...recentMetrics.map(m => m.executionTimeMs));
    const totalTokenUsage = recentMetrics.reduce((sum, m) => sum + (m.tokenUsage || 0), 0);
    
    return {
      totalExecutions,
      averageTaskCount,
      averageExecutionTime,
      maxExecutionTime,
      totalTokenUsage
    };
  }
  
  /**
   * Clear all stored metrics
   */
  public clearMetrics(): void {
    this.metrics = [];
    console.log('Swarm metrics cleared');
  }
}

// Export a singleton instance
export const swarmMetricsService = SwarmMetricsService.getInstance();
