export interface SwarmMetricsRecord {
  id: string;
  timestamp: Date;
  taskId: string;
  fanoutCount: number;
  successCount: number;
  failureCount: number;
  averageLatencyMs: number;
  totalDurationMs: number;
}

export interface AggregatedSwarmMetrics {
  period: string;
  totalTasks: number;
  avgSuccessRate: number;
  avgFanoutRatio: number;
  avgDurationMs: number;
  timestamp: Date;
}

export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];

  public recordMetrics(record: Omit<SwarmMetricsRecord, 'id' | 'timestamp'>): void {
    const metric: SwarmMetricsRecord = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...record
    };
    
    this.metrics.push(metric);
    
    // Keep only last 1000 records to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  public getRecentMetrics(limit: number = 50): SwarmMetricsRecord[] {
    return this.metrics
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getAggregatedMetrics(
    period: 'hour' | 'day' | 'week' = 'day',
    limit: number = 7
  ): AggregatedSwarmMetrics[] {
    const now = new Date();
    const results: AggregatedSwarmMetrics[] = [];

    for (let i = 0; i < limit; i++) {
      const periodStart = new Date(now);
      const periodEnd = new Date(now);

      switch (period) {
        case 'hour':
          periodStart.setHours(now.getHours() - i - 1, 0, 0, 0);
          periodEnd.setHours(now.getHours() - i, 0, 0, 0);
          break;
        case 'day':
          periodStart.setDate(now.getDate() - i - 1);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd.setDate(now.getDate() - i);
          periodEnd.setHours(0, 0, 0, 0);
          break;
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay() - (i + 1) * 7);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 7);
          periodStart.setTime(weekStart.getTime());
          periodEnd.setTime(weekEnd.getTime());
          break;
      }

      const periodMetrics = this.metrics.filter(m => 
        m.timestamp >= periodStart && m.timestamp < periodEnd
      );

      const totalTasks = periodMetrics.length;
      const avgSuccessRate = totalTasks > 0 ? 
        periodMetrics.reduce((sum, m) => sum + (m.successCount / (m.successCount + m.failureCount)), 0) / totalTasks : 0;
      const avgFanoutRatio = totalTasks > 0 ?
        periodMetrics.reduce((sum, m) => sum + m.fanoutCount, 0) / totalTasks : 0;
      const avgDurationMs = totalTasks > 0 ?
        periodMetrics.reduce((sum, m) => sum + m.totalDurationMs, 0) / totalTasks : 0;

      results.push({
        period: this.formatPeriod(periodStart, period),
        totalTasks,
        avgSuccessRate,
        avgFanoutRatio,
        avgDurationMs,
        timestamp: periodStart
      });
    }

    return results.reverse();
  }

  private formatPeriod(date: Date, period: 'hour' | 'day' | 'week'): string {
    switch (period) {
      case 'hour':
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric',
          hour12: true 
        });
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'week':
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      default:
        return date.toLocaleDateString();
    }
  }

  public clearMetrics(): void {
    this.metrics = [];
  }

  public getMetricsSummary(): {
    totalRecords: number;
    avgSuccessRate: number;
    avgFanoutRatio: number;
    avgDurationMs: number;
  } {
    if (this.metrics.length === 0) {
      return {
        totalRecords: 0,
        avgSuccessRate: 0,
        avgFanoutRatio: 0,
        avgDurationMs: 0
      };
    }

    const totalSuccessRate = this.metrics.reduce((sum, m) => 
      sum + (m.successCount / (m.successCount + m.failureCount)), 0
    );
    const totalFanout = this.metrics.reduce((sum, m) => sum + m.fanoutCount, 0);
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.totalDurationMs, 0);

    return {
      totalRecords: this.metrics.length,
      avgSuccessRate: totalSuccessRate / this.metrics.length,
      avgFanoutRatio: totalFanout / this.metrics.length,
      avgDurationMs: totalDuration / this.metrics.length
    };
  }
}
