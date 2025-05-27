
import { AdaptationAction, RealTimeMetrics } from './types/AdaptationTypes';
import { SessionData } from '../analytics/types/AnalyticsTypes';
import { LearningPattern } from '../analytics/core/LearningPatternAnalyzer';
import { DEFAULT_ADAPTATION_THRESHOLDS } from './config/AdaptationConfig';
import { DifficultyAssessor } from './assessors/DifficultyAssessor';
import { PacingAssessor } from './assessors/PacingAssessor';
import { BreakAssessor } from './assessors/BreakAssessor';
import { HintAssessor } from './assessors/HintAssessor';
import { ContentAssessor } from './assessors/ContentAssessor';
import { AdaptationStorage } from './storage/AdaptationStorage';

export class RealTimeAdaptationService {
  private difficultyAssessor: DifficultyAssessor;
  private pacingAssessor: PacingAssessor;
  private breakAssessor: BreakAssessor;
  private hintAssessor: HintAssessor;
  private contentAssessor: ContentAssessor;
  private storage: AdaptationStorage;

  constructor() {
    const thresholds = DEFAULT_ADAPTATION_THRESHOLDS;
    this.difficultyAssessor = new DifficultyAssessor(thresholds);
    this.pacingAssessor = new PacingAssessor(thresholds);
    this.breakAssessor = new BreakAssessor(thresholds);
    this.hintAssessor = new HintAssessor(thresholds);
    this.contentAssessor = new ContentAssessor(thresholds);
    this.storage = new AdaptationStorage();
  }

  public analyzeAndAdapt(
    userId: string,
    currentMetrics: RealTimeMetrics,
    sessionData: SessionData,
    learningPattern: LearningPattern
  ): AdaptationAction[] {
    const adaptations: AdaptationAction[] = [];

    // Check for difficulty adjustments
    const difficultyAdaptation = this.difficultyAssessor.assess(currentMetrics, sessionData);
    if (difficultyAdaptation) adaptations.push(difficultyAdaptation);

    // Check for pacing changes
    const pacingAdaptation = this.pacingAssessor.assess(currentMetrics, learningPattern);
    if (pacingAdaptation) adaptations.push(pacingAdaptation);

    // Check for break suggestions
    const breakAdaptation = this.breakAssessor.assess(currentMetrics);
    if (breakAdaptation) adaptations.push(breakAdaptation);

    // Check for hint provision
    const hintAdaptation = this.hintAssessor.assess(currentMetrics, sessionData);
    if (hintAdaptation) adaptations.push(hintAdaptation);

    // Check for content switching
    const contentAdaptation = this.contentAssessor.assess(currentMetrics, learningPattern);
    if (contentAdaptation) adaptations.push(contentAdaptation);

    // Store adaptations
    this.storage.storeAdaptations(userId, adaptations);

    return adaptations;
  }

  public getAdaptationHistory(userId: string): AdaptationAction[] {
    return this.storage.getAdaptationHistory(userId);
  }

  public getAdaptationEffectiveness(type: AdaptationAction['type']): number {
    return this.storage.getAdaptationEffectiveness(type);
  }

  public updateAdaptationEffectiveness(
    userId: string, 
    adaptationId: string, 
    effectiveness: number
  ): void {
    this.storage.updateAdaptationEffectiveness(userId, adaptationId, effectiveness);
  }
}

// Re-export types for backward compatibility
export type { AdaptationAction, RealTimeMetrics } from './types/AdaptationTypes';
