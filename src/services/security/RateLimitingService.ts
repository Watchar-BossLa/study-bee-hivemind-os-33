
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
}

export class RateLimitingService {
  private static defaultConfig: RateLimitConfig = {
    maxRequests: 100,
    windowMinutes: 60
  };

  private static endpointConfigs: Record<string, RateLimitConfig> = {
    '/auth/signin': { maxRequests: 5, windowMinutes: 15 },
    '/auth/signup': { maxRequests: 3, windowMinutes: 60 },
    '/auth/reset-password': { maxRequests: 3, windowMinutes: 60 },
    '/api/flashcards': { maxRequests: 200, windowMinutes: 60 },
    '/api/quiz': { maxRequests: 50, windowMinutes: 60 },
    '/api/arena': { maxRequests: 100, windowMinutes: 60 }
  };

  static async checkRateLimit(
    identifier: string,
    endpoint: string,
    customConfig?: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining?: number; resetTime?: Date }> {
    try {
      const config = customConfig || this.endpointConfigs[endpoint] || this.defaultConfig;
      
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier,
        p_endpoint: endpoint,
        p_max_requests: config.maxRequests,
        p_window_minutes: config.windowMinutes
      });

      if (error) {
        logger.error('Rate limit check failed:', error);
        // Fail open - allow request if rate limiting is down
        return { allowed: true };
      }

      return {
        allowed: data as boolean,
        remaining: data ? config.maxRequests - 1 : 0,
        resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
      };
    } catch (error) {
      logger.error('Rate limiting service error:', error);
      // Fail open
      return { allowed: true };
    }
  }

  static getClientIdentifier(request?: Request): string {
    // In a real production environment, this would extract the real IP
    // For now, we'll use a combination of user agent and timestamp
    const userAgent = request?.headers.get('user-agent') || 'unknown';
    const fingerprint = btoa(userAgent).slice(0, 10);
    return `client_${fingerprint}`;
  }

  static async rateLimitMiddleware(
    endpoint: string,
    identifier?: string
  ): Promise<{ proceed: boolean; headers: Record<string, string> }> {
    const clientId = identifier || this.getClientIdentifier();
    const result = await this.checkRateLimit(clientId, endpoint);

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': this.endpointConfigs[endpoint]?.maxRequests.toString() || '100',
      'X-RateLimit-Remaining': result.remaining?.toString() || '0'
    };

    if (result.resetTime) {
      headers['X-RateLimit-Reset'] = Math.floor(result.resetTime.getTime() / 1000).toString();
    }

    if (!result.allowed) {
      headers['Retry-After'] = '900'; // 15 minutes
    }

    return {
      proceed: result.allowed,
      headers
    };
  }
}
