
export interface SwarmMetricsRecord {
  executionId?: string;
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

export interface AgentPerformanceMetrics {
  agentId: string;
  agentName: string;
  totalTasks: number;
  successfulTasks: number;
  averageResponseTime: number;
  userRating: number;
  lastActive: Date;
  specialization: string[];
  collaborationScore: number;
}

export class SwarmMetricsService {
  private metrics: SwarmMetricsRecord[] = [];
  private agentMetrics: Map<string, AgentPerformanceMetrics> = new Map();
  private maxRecords = 1000;

  public recordMetrics(metrics: SwarmMetricsRecord): void {
    const metricsWithId = {
      ...metrics,
      executionId: metrics.executionId || `exec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    };
    
    this.metrics.unshift(metricsWithId);
    
    // Update agent-specific metrics
    if (metrics.agentParticipation) {
      this.updateAgentMetrics(metrics.agentParticipation, metrics.successRate, metrics.durationMs);
    }
    
    if (this.metrics.length > this.maxRecords) {
      this.metrics = this.metrics.slice(0, this.maxRecords);
    }
  }

  private updateAgentMetrics(participation: Record<string, number>, successRate: number, duration: number): void {
    Object.entries(participation).forEach(([agentId, participationLevel]) => {
      const existing = this.agentMetrics.get(agentId) || {
        agentId,
        agentName: this.getAgentName(agentId),
        totalTasks: 0,
        successfulTasks: 0,
        averageResponseTime: 0,
        userRating: 4.5,
        lastActive: new Date(),
        specialization: this.getAgentSpecialization(agentId),
        collaborationScore: 0.85
      };

      const newTotalTasks = existing.totalTasks + participationLevel;
      const newSuccessfulTasks = existing.successfulTasks + (participationLevel * successRate);
      const newAverageResponseTime = (existing.averageResponseTime * existing.totalTasks + duration * participationLevel) / newTotalTasks;

      this.agentMetrics.set(agentId, {
        ...existing,
        totalTasks: newTotalTasks,
        successfulTasks: newSuccessfulTasks,
        averageResponseTime: newAverageResponseTime,
        lastActive: new Date()
      });
    });
  }

  private getAgentName(agentId: string): string {
    const nameMap: Record<string, string> = {
      'content-expert': 'Content Expert',
      'learning-strategist': 'Learning Strategist',
      'assessment-expert': 'Assessment Expert',
      'engagement-specialist': 'Engagement Specialist',
      'metacognition-coach': 'Metacognition Coach'
    };
    return nameMap[agentId] || agentId;
  }

  private getAgentSpecialization(agentId: string): string[] {
    const specializationMap: Record<string, string[]> = {
      'content-expert': ['Mathematics', 'Science', 'Content Delivery'],
      'learning-strategist': ['Study Planning', 'Learning Paths', 'Strategy'],
      'assessment-expert': ['Testing', 'Evaluation', 'Progress Tracking'],
      'engagement-specialist': ['Motivation', 'Gamification', 'User Experience'],
      'metacognition-coach': ['Self-Reflection', 'Learning Awareness', 'Study Skills']
    };
    return specializationMap[agentId] || ['General'];
  }

  public getRecentMetrics(count: number = 10): SwarmMetricsRecord[] {
    return this.metrics.slice(0, count);
  }

  public getAgentPerformanceMetrics(): AgentPerformanceMetrics[] {
    return Array.from(this.agentMetrics.values());
  }

  public getTopPerformingAgents(limit: number = 5): AgentPerformanceMetrics[] {
    return this.getAgentPerformanceMetrics()
      .sort((a, b) => (b.successfulTasks / Math.max(b.totalTasks, 1)) - (a.successfulTasks / Math.max(a.totalTasks, 1)))
      .slice(0, limit);
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
    this.agentMetrics.clear();
  }
}
