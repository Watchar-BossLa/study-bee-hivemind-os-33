
import { LLMModel } from '../../../types/agents';
import { RouterRequest } from '../../../types/router';
import { RouterHeuristic, ModelScore } from '../types/RouterTypes';

export class ModelScorer {
  private heuristics: RouterHeuristic[];

  constructor(heuristics: RouterHeuristic[]) {
    this.heuristics = heuristics;
  }

  /**
   * Score models based on heuristics
   */
  public scoreModels(models: LLMModel[], request: RouterRequest): ModelScore[] {
    return models.map(model => {
      let score = 0;
      const reasoningTrace: string[] = [];
      
      // Apply each heuristic
      for (const heuristic of this.heuristics) {
        const heuristicScore = heuristic.evaluate(model, request) * heuristic.weight;
        score += heuristicScore;
        reasoningTrace.push(`${heuristic.name}: ${heuristicScore.toFixed(2)} (${heuristic.reason(model, request)})`);
      }
      
      return { model, score, reasoningTrace };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Add a custom heuristic
   */
  public addHeuristic(heuristic: RouterHeuristic): void {
    this.heuristics.push(heuristic);
  }

  /**
   * Get all heuristics
   */
  public getHeuristics(): RouterHeuristic[] {
    return [...this.heuristics];
  }
}
