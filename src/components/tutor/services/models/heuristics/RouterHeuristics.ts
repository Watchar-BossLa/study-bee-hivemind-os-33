
import { RouterHeuristic } from '../types/RouterTypes';
import { modelPerformanceTracker } from '../modelPerformanceTracker';

export class RouterHeuristics {
  /**
   * Get default heuristics for model selection
   */
  public static getDefaultHeuristics(): RouterHeuristic[] {
    return [
      {
        name: 'Cost Efficiency',
        weight: 1.5,
        evaluate: (model, request) => {
          if (request.costSensitivity === 'high') {
            return model.costPerToken < 0.0003 ? 5 : 
                model.costPerToken < 0.0008 ? 3 : 1;
          } else if (request.costSensitivity === 'medium') {
            return model.costPerToken < 0.0008 ? 3 : 2; 
          }
          return 2;
        },
        reason: (model, request) => {
          const costLevel = model.costPerToken < 0.0003 ? 'low' : 
                        model.costPerToken < 0.0008 ? 'medium' : 'high';
          return `Cost is ${costLevel} (${model.costPerToken}) with ${request.costSensitivity} sensitivity`;
        }
      },
      {
        name: 'Latency Optimization',
        weight: 1.2,
        evaluate: (model, request) => {
          if (request.urgency === 'high') {
            return model.latency === 'low' ? 5 : 
                model.latency === 'medium' ? 2 : 0;
          } else if (request.urgency === 'medium') {
            return model.latency === 'medium' ? 4 : 3;
          }
          return 3;
        },
        reason: (model, request) => {
          return `Latency is ${model.latency} with ${request.urgency} urgency`;
        }
      },
      {
        name: 'Context Capacity',
        weight: 1.0,
        evaluate: (model, request) => {
          if (!request.contextLength) return 3;
          
          const utilizationRatio = request.contextLength / model.maxTokens;
          if (utilizationRatio > 0.9) return 0;
          if (utilizationRatio > 0.7) return 2;
          if (utilizationRatio > 0.5) return 4;
          return 5;
        },
        reason: (model, request) => {
          if (!request.contextLength) return 'No context length specified';
          const utilizationRatio = request.contextLength / model.maxTokens;
          return `Context utilization: ${(utilizationRatio * 100).toFixed(1)}% of capacity`;
        }
      },
      {
        name: 'Task Specialization',
        weight: 2.0,
        evaluate: (model, request) => {
          if (request.task === 'code' && (model.provider === 'anthropic' || model.provider === 'openai')) {
            return 5;
          }
          
          if (request.task === 'reasoning' && model.provider === 'anthropic') {
            return 4.5;
          }
          
          if (request.task === 'tutor' && model.maxTokens > 16000) {
            return 4;
          }
          
          return 3;
        },
        reason: (model, request) => {
          if (request.task === 'code' && (model.provider === 'anthropic' || model.provider === 'openai')) {
            return `${model.provider} specializes in code generation`;
          }
          
          if (request.task === 'reasoning' && model.provider === 'anthropic') {
            return `${model.provider} specializes in reasoning tasks`;
          }
          
          if (request.task === 'tutor' && model.maxTokens > 16000) {
            return `Large context window beneficial for tutoring`;
          }
          
          return `Standard capability for ${request.task}`;
        }
      },
      {
        name: 'Historic Performance',
        weight: 1.8,
        evaluate: (model, request) => {
          const metrics = modelPerformanceTracker.getMetrics().get(model.id);
          if (!metrics || metrics.selectionCount < 5) return 3;
          
          const baseScore = metrics.successRate * 5;
          
          if (request.previousSuccess && request.previousSuccess[model.id]) {
            const previousSuccessRate = request.previousSuccess[model.id];
            return baseScore * (0.7 + 0.3 * previousSuccessRate);
          }
          
          return baseScore;
        },
        reason: (model, request) => {
          const metrics = modelPerformanceTracker.getMetrics().get(model.id);
          if (!metrics || metrics.selectionCount < 5) {
            return `Insufficient historical data (${metrics?.selectionCount || 0} uses)`;
          }
          
          if (request.previousSuccess && request.previousSuccess[model.id]) {
            return `Historic success rate: ${(metrics.successRate * 100).toFixed(1)}%, previous success on similar tasks: ${(request.previousSuccess[model.id] * 100).toFixed(1)}%`;
          }
          
          return `Historic success rate: ${(metrics.successRate * 100).toFixed(1)}%`;
        }
      },
      {
        name: 'Complexity Match',
        weight: 1.3,
        evaluate: (model, request) => {
          if (request.complexity === 'high') {
            return model.maxTokens > 30000 ? 5 : 
                  model.maxTokens > 8000 ? 3 : 1;
          } else if (request.complexity === 'medium') {
            return model.maxTokens > 8000 && model.maxTokens <= 30000 ? 5 : 3;
          } else {
            return model.maxTokens < 8000 ? 5 : 3;
          }
        },
        reason: (model, request) => {
          return `Model context size (${model.maxTokens.toLocaleString()} tokens) for ${request.complexity} complexity task`;
        }
      }
    ];
  }
}
