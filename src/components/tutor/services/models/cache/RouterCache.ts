
import { RouterRequest } from '../../../types/router';
import { CacheStats } from '../types/RouterTypes';

export class RouterCache {
  private cache: Map<string, string> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;
  private maxCacheSize = 1000;
  private cacheEnabled = true;

  /**
   * Generate a cache key for a request
   */
  private generateCacheKey(request: RouterRequest): string {
    const { query, task, complexity, urgency, costSensitivity } = request;
    return `${task}-${complexity}-${urgency}-${costSensitivity}-${query?.substring(0, 50)}`;
  }

  /**
   * Check if a cached result exists for the request
   */
  public getCachedResult(request: RouterRequest): string | null {
    if (!this.cacheEnabled) return null;
    
    const key = this.generateCacheKey(request);
    const cachedModelId = this.cache.get(key);
    
    if (cachedModelId) {
      this.cacheHits++;
      return cachedModelId;
    }
    
    this.cacheMisses++;
    return null;
  }

  /**
   * Cache a model selection result
   */
  public cacheResult(request: RouterRequest, modelId: string): void {
    if (!this.cacheEnabled) return;
    
    const key = this.generateCacheKey(request);
    this.cache.set(key, modelId);
    
    // Implement LRU cache if size exceeds maximum
    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Get cache statistics
   */
  public getStats(): CacheStats {
    const total = this.cacheHits + this.cacheMisses;
    const hitRate = total > 0 ? this.cacheHits / total : 0;
    
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      size: this.cache.size,
      hitRate
    };
  }

  /**
   * Reset cache
   */
  public reset(): void {
    this.cache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Enable or disable cache
   */
  public setEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
    if (!enabled) {
      this.reset();
    }
  }
}
