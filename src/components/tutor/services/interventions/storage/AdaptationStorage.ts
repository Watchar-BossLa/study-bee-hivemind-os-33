import { AdaptationAction } from '../types/AdaptationTypes';

export class AdaptationStorage {
  private adaptationHistory: Map<string, AdaptationAction[]> = new Map();
  private readonly MAX_HISTORY_SIZE = 100;

  public storeAdaptations(userId: string, adaptations: AdaptationAction[]): void {
    const history = this.adaptationHistory.get(userId) || [];
    history.push(...adaptations);
    
    // Keep only last 100 adaptations
    if (history.length > this.MAX_HISTORY_SIZE) {
      history.splice(0, history.length - this.MAX_HISTORY_SIZE);
    }
    
    this.adaptationHistory.set(userId, history);
  }

  public getAdaptationHistory(userId: string): AdaptationAction[] {
    return this.adaptationHistory.get(userId) || [];
  }

  public getAdaptationEffectiveness(type: AdaptationAction['type']): number {
    let totalEffectiveness = 0;
    let count = 0;
    
    this.adaptationHistory.forEach(history => {
      history.forEach(adaptation => {
        if (adaptation.type === type && adaptation.effectiveness !== undefined) {
          totalEffectiveness += adaptation.effectiveness;
          count++;
        }
      });
    });
    
    return count > 0 ? totalEffectiveness / count : 0;
  }

  public updateAdaptationEffectiveness(
    userId: string, 
    adaptationId: string, 
    effectiveness: number
  ): void {
    const history = this.adaptationHistory.get(userId) || [];
    const adaptation = history.find(a => a.id === adaptationId);
    if (adaptation) {
      adaptation.effectiveness = effectiveness;
    }
  }
}
