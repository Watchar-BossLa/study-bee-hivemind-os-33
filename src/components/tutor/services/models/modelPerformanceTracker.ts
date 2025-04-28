
import { RouterRequest } from '../../types/router';

export interface ModelPerformanceMetrics {
  selectionCount: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

export class ModelPerformanceTracker {
  private performanceMetrics: Map<string, ModelPerformanceMetrics>;
  private lastSelections: {modelId: string, requestHash: string, timestamp: number}[] = [];
  
  constructor() {
    this.performanceMetrics = new Map();
  }

  public initializeMetrics(modelId: string, latency: string): void {
    const baseResponseTime = latency === 'low' ? 500 : latency === 'medium' ? 1000 : 2000;
    this.performanceMetrics.set(modelId, {
      selectionCount: 0,
      successRate: 0.95,
      averageResponseTime: baseResponseTime,
      userSatisfaction: 4.5
    });
  }

  public addSelection(modelId: string, requestHash: string): void {
    if (this.lastSelections.length >= 20) {
      this.lastSelections.shift();
    }
    this.lastSelections.push({ modelId, requestHash, timestamp: Date.now() });
  }

  public getRecentSimilarSelection(requestHash: string): string | undefined {
    const recentSelection = this.lastSelections
      .find(s => s.requestHash === requestHash && (Date.now() - s.timestamp) < 300000);
    return recentSelection?.modelId;
  }

  public logModelUsage(
    modelId: string,
    request: RouterRequest,
    successful: boolean,
    responseTimeMs?: number,
    userRating?: number
  ): void {
    const metrics = this.performanceMetrics.get(modelId);
    if (!metrics) return;

    const newSuccessRate = (metrics.successRate * metrics.selectionCount + (successful ? 1 : 0)) /
                          (metrics.selectionCount + 1);
    
    const newAvgResponseTime = responseTimeMs ? 
      (metrics.averageResponseTime * metrics.selectionCount + responseTimeMs) / (metrics.selectionCount + 1) : 
      metrics.averageResponseTime;
      
    const newSatisfaction = userRating ? 
      (metrics.userSatisfaction * metrics.selectionCount + userRating) / (metrics.selectionCount + 1) :
      metrics.userSatisfaction;

    this.performanceMetrics.set(modelId, {
      selectionCount: metrics.selectionCount + 1,
      successRate: newSuccessRate,
      averageResponseTime: newAvgResponseTime,
      userSatisfaction: newSatisfaction
    });
  }

  public getMetrics(): Map<string, ModelPerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }

  public resetMetrics(): void {
    this.performanceMetrics.clear();
    this.lastSelections = [];
  }
}

export const modelPerformanceTracker = new ModelPerformanceTracker();
