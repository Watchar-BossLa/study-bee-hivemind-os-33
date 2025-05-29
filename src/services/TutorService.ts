
import { BaseService, ServiceResponse } from './base/BaseService';
import { QuorumForge } from '@/components/tutor/services/QuorumForge';

export interface TutorQuery {
  message: string;
  userId: string;
  context?: Record<string, any>;
}

export interface TutorResponse {
  response: string;
  agentContributions: Array<{
    agentId: string;
    response: string;
    confidence: number;
  }>;
  consensusScore: number;
  processingTime: number;
}

export class TutorService extends BaseService {
  private quorumForge: QuorumForge;

  constructor() {
    super({ retryAttempts: 2, timeout: 15000 });
    this.quorumForge = new QuorumForge();
  }

  async processQuery(query: TutorQuery): Promise<ServiceResponse<TutorResponse>> {
    return this.executeWithRetry(async () => {
      const startTime = Date.now();
      
      const result = await this.quorumForge.processQuery(
        query.message,
        query.context || {}
      );

      return {
        ...result,
        processingTime: Date.now() - startTime
      };
    }, 'tutor-query-processing');
  }

  async recordFeedback(
    messageId: string,
    userId: string,
    rating: number,
    agentFeedback?: Record<string, number>
  ): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      this.quorumForge.recordFeedback(messageId, userId, rating, agentFeedback);
    }, 'tutor-feedback-recording');
  }

  getQuorumForge(): QuorumForge {
    return this.quorumForge;
  }
}

export const tutorService = new TutorService();
