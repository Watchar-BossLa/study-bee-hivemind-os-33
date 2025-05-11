
import { SeniorManagerGPT } from '../core/SeniorManagerGPT';

/**
 * Wrapper for SeniorManagerGPT functionality
 */
export class SeniorManager {
  private seniorManagerGPT: SeniorManagerGPT;
  
  constructor(seniorManagerGPT: SeniorManagerGPT) {
    this.seniorManagerGPT = seniorManagerGPT;
  }
  
  /**
   * Submit a plan for review by SeniorManagerGPT
   * @param plan The plan to review
   * @param context Additional context for the review
   */
  public async reviewPlan(plan: any, context: Record<string, any> = {}): Promise<any> {
    return this.seniorManagerGPT.reviewPlan(plan, context);
  }
}
