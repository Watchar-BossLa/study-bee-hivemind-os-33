export interface SwarmMetricsRecord {
  executionId?: string; // Made optional to support legacy data
  timestamp: Date;
  taskCount: number;
  durationMs: number;
  successRate: number;
  fanoutRatio: number;
  agentParticipation?: Record<string, number>;
  modelUsage?: Record<string, number>;
  errorDetails?: string[];
}

export interface AggregatedSwarmMetrics {
  period: string;
  count: number;
  avgDuration: number;
  avgSuccessRate: number;
  avgFanoutRatio: number;
  totalTasks: number;
}

export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];
  private maxRecords = 1000;

  public recordMetrics(metrics: SwarmMetricsRecord): void {
    // Auto-generate executionId if not provided
    const metricsWithId = {
      ...metrics,
      executionId: metrics.executionId || `exec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    };
    
    this.metrics.unshift(metricsWithId);
    
    // Keep only the most recent records
    if (this.metrics.length > this.maxRecords) {
      this.metrics = this.metrics.slice(0, this.maxRecords);
    }
  }

  public getRecentMetrics(count: number = 10): SwarmMetricsRecord[] {
    return this.metrics.slice(0, count);
  }

  public getAggregatedMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ): AggregatedSwarmMetrics[] {
    const now = new Date();
    const periodMs = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }[period];

    const aggregated: AggregatedSwarmMetrics[] = [];
    
    for (let i = 0; i < limit; i++) {
      const periodStart = new Date(now.getTime() - (i + 1) * periodMs);
      const periodEnd = new Date(now.getTime() - i * periodMs);
      
      const periodMetrics = this.metrics.filter(m => 
        m.timestamp >= periodStart && m.timestamp < periodEnd
      );
      
      if (periodMetrics.length > 0) {
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        
        aggregated.unshift({
          period: periodStart.toISOString().split('T')[0],
          count: periodMetrics.length,
          avgDuration: avg(periodMetrics.map(m => m.durationMs)),
          avgSuccessRate: avg(periodMetrics.map(m => m.successRate)),
          avgFanoutRatio: avg(periodMetrics.map(m => m.fanoutRatio)),
          totalTasks: periodMetrics.reduce((sum, m) => sum + m.taskCount, 0)
        });
      } else {
        aggregated.unshift({
          period: periodStart.toISOString().split('T')[0],
          count: 0,
          avgDuration: 0,
          avgSuccessRate: 0,
          avgFanoutRatio: 0,
          totalTasks: 0
        });
      }
    }
    
    return aggregated;
  }

  public getMetricsSummary() {
    if (this.metrics.length === 0) {
      return {
        totalExecutions: 0,
        avgSuccessRate: 0,
        avgDuration: 0,
        avgFanoutRatio: 0,
        totalTasks: 0
      };
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    
    return {
      totalExecutions: this.metrics.length,
      avgSuccessRate: avg(this.metrics.map(m => m.successRate)),
      avgDuration: avg(this.metrics.map(m => m.durationMs)),
      avgFanoutRatio: avg(this.metrics.map(m => m.fanoutRatio)),
      totalTasks: this.metrics.reduce((sum, m) => sum + m.taskCount, 0)
    };
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}
