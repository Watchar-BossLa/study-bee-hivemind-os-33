export interface SwarmMetricsRecord {
  timestamp: number;
  successRate: number;
  fanoutRatio: number;
  durationMs: number;
  taskCount: number;
  executionId: string;
}

export interface AggregatedSwarmMetrics {
  period: string;
  avgSuccessRate: number;
  avgFanoutRatio: number;
  avgDurationMs: number;
  totalTasks: number;
}

export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];

  public recordMetrics(record: SwarmMetricsRecord): void {
    this.metrics.push(record);
    
    // Keep only last 1000 records to prevent memory bloat
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  public getRecentMetrics(limit: number = 20): SwarmMetricsRecord[] {
    return this.metrics
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getAggregatedMetrics(period: 'hour' | 'day' | 'week', limit: number = 7): AggregatedSwarmMetrics[] {
    if (this.metrics.length === 0) return [];

    const periodMs = period === 'hour' ? 3600000 : period === 'day' ? 86400000 : 604800000;
    const now = Date.now();
    const periods: Map<string, SwarmMetricsRecord[]> = new Map();

    // Group metrics by period
    this.metrics.forEach(metric => {
      const periodStart = Math.floor((now - metric.timestamp) / periodMs) * periodMs;
      const periodKey = new Date(now - periodStart).toISOString().split('T')[0];
      
      if (!periods.has(periodKey)) {
        periods.set(periodKey, []);
      }
      periods.get(periodKey)!.push(metric);
    });

    // Aggregate metrics for each period
    const aggregated: AggregatedSwarmMetrics[] = [];
    periods.forEach((records, periodKey) => {
      if (records.length > 0) {
        aggregated.push({
          period: periodKey,
          avgSuccessRate: records.reduce((sum, r) => sum + r.successRate, 0) / records.length,
          avgFanoutRatio: records.reduce((sum, r) => sum + r.fanoutRatio, 0) / records.length,
          avgDurationMs: records.reduce((sum, r) => sum + r.durationMs, 0) / records.length,
          totalTasks: records.reduce((sum, r) => sum + r.taskCount, 0)
        });
      }
    });

    return aggregated
      .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
      .slice(0, limit);
  }
}
