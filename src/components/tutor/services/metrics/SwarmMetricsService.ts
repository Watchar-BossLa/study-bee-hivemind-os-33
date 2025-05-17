
/**
 * Service responsible for tracking and exposing Swarm task execution metrics
 * Implements the 'feat/swarm-metrics' feature from QuorumForge OS
 */
export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];
  private maxRecords: number = 100;

  /**
   * Records a new Swarm execution
   */
  public recordSwarmExecution(taskCount: number, durationMs: number, successRate: number): void {
    const newRecord: SwarmMetricsRecord = {
      timestamp: new Date(),
      taskCount,
      durationMs,
      successRate,
      fanoutRatio: taskCount > 0 ? taskCount / Math.max(1, Math.ceil(taskCount / 5)) : 0
    };
    
    this.metrics.unshift(newRecord);
    
    // Trim to max size
    if (this.metrics.length > this.maxRecords) {
      this.metrics = this.metrics.slice(0, this.maxRecords);
    }
    
    console.log(`Recorded Swarm metrics: ${taskCount} tasks, ${durationMs}ms duration, ${successRate * 100}% success`);
  }

  /**
   * Gets recent Swarm metrics
   */
  public getMetrics(limit: number = 24): SwarmMetricsRecord[] {
    return this.metrics.slice(0, limit);
  }

  /**
   * Gets aggregated Swarm statistics
   */
  public getAggregateStats(): SwarmAggregateStats {
    if (this.metrics.length === 0) {
      return {
        averageTaskCount: 0,
        averageDuration: 0,
        averageSuccessRate: 0,
        totalTasksProcessed: 0
      };
    }
    
    const totalTasksProcessed = this.metrics.reduce((sum, record) => sum + record.taskCount, 0);
    
    return {
      averageTaskCount: totalTasksProcessed / this.metrics.length,
      averageDuration: this.metrics.reduce((sum, record) => sum + record.durationMs, 0) / this.metrics.length,
      averageSuccessRate: this.metrics.reduce((sum, record) => sum + record.successRate, 0) / this.metrics.length,
      totalTasksProcessed
    };
  }
}

/**
 * Represents a single Swarm execution metrics record
 */
export interface SwarmMetricsRecord {
  timestamp: Date;
  taskCount: number;
  durationMs: number;
  successRate: number;
  fanoutRatio: number;
}

/**
 * Represents aggregated Swarm statistics
 */
export interface SwarmAggregateStats {
  averageTaskCount: number;
  averageDuration: number;
  averageSuccessRate: number;
  totalTasksProcessed: number;
}
