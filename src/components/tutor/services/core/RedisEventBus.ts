
import Redis from 'ioredis';
import { v4 as uuidv4 } from '@/lib/uuid';

/**
 * RedisEventBus - Manages real-time event distribution between agents
 * Implements the Redis Integration feature from QuorumForge OS spec
 */
export class RedisEventBus {
  private redis: Redis | null = null;
  private redisSubscriber: Redis | null = null;
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();
  private isConnected: boolean = false;
  private isSimulated: boolean = false;
  private simulatedEvents: Map<string, any[]> = new Map();
  private nodeId: string;
  
  constructor(redisUrl?: string) {
    this.nodeId = uuidv4();
    
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl);
        this.redisSubscriber = new Redis(redisUrl);
        this.setupRedisConnection();
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        this.setupSimulatedMode();
      }
    } else {
      // If no Redis URL, use simulated mode
      this.setupSimulatedMode();
    }
    
    console.log(`RedisEventBus initialized ${this.isSimulated ? '(Simulated Mode)' : ''}`);
  }
  
  /**
   * Set up Redis connection and event listeners
   */
  private setupRedisConnection(): void {
    if (!this.redis || !this.redisSubscriber) return;
    
    this.redis.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });
    
    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
      this.isConnected = false;
      
      // Fall back to simulated mode
      if (!this.isSimulated) {
        this.setupSimulatedMode();
      }
    });
    
    this.redisSubscriber.on('message', (channel, message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { eventType, data, sourceNodeId } = parsedMessage;
        
        // Don't process events from this node to avoid echoes
        if (sourceNodeId === this.nodeId) return;
        
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
          handlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error(`Error in handler for event ${eventType}:`, error);
            }
          });
        }
      } catch (error) {
        console.error('Error processing Redis message:', error);
      }
    });
  }
  
  /**
   * Set up simulated mode for local testing
   */
  private setupSimulatedMode(): void {
    this.isSimulated = true;
    console.log('Running RedisEventBus in simulated mode');
  }
  
  /**
   * Subscribe to events of a specific type
   */
  public subscribe(eventType: string, handler: (data: any) => void): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
      
      // In real Redis mode, subscribe to the channel
      if (this.redisSubscriber && !this.isSimulated) {
        this.redisSubscriber.subscribe(`event:${eventType}`);
      }
    }
    
    const handlers = this.eventHandlers.get(eventType)!;
    handlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
      
      // If no more handlers, unsubscribe from the channel
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
        
        if (this.redisSubscriber && !this.isSimulated) {
          this.redisSubscriber.unsubscribe(`event:${eventType}`);
        }
      }
    };
  }
  
  /**
   * Publish an event to all subscribers
   */
  public async publish(eventType: string, data: any): Promise<void> {
    const message = {
      eventType,
      data,
      sourceNodeId: this.nodeId,
      timestamp: new Date().toISOString()
    };
    
    // In real Redis mode, publish to the channel
    if (this.redis && this.isConnected) {
      await this.redis.publish(`event:${eventType}`, JSON.stringify(message));
    } else if (this.isSimulated) {
      // In simulated mode, directly call handlers
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`Error in simulated handler for event ${eventType}:`, error);
          }
        });
      }
      
      // Store event in simulated event log
      if (!this.simulatedEvents.has(eventType)) {
        this.simulatedEvents.set(eventType, []);
      }
      this.simulatedEvents.get(eventType)!.push(data);
    }
  }
  
  /**
   * Get recent events of a specific type (simulated mode only)
   */
  public getSimulatedEvents(eventType: string): any[] {
    if (!this.isSimulated) {
      console.warn('getSimulatedEvents is only available in simulated mode');
      return [];
    }
    
    return this.simulatedEvents.get(eventType) || [];
  }
  
  /**
   * Clear all simulated events (testing purposes)
   */
  public clearSimulatedEvents(): void {
    if (this.isSimulated) {
      this.simulatedEvents.clear();
    }
  }
  
  /**
   * Set a value in Redis
   */
  public async setValue(key: string, value: any): Promise<void> {
    if (this.redis && this.isConnected) {
      await this.redis.set(key, JSON.stringify(value));
    } else if (this.isSimulated) {
      // Store in simulated event bus
      await this.publish(`set:${key}`, value);
    }
  }
  
  /**
   * Get a value from Redis
   */
  public async getValue(key: string): Promise<any> {
    if (this.redis && this.isConnected) {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } else if (this.isSimulated) {
      // Retrieve from simulated event bus
      const events = this.getSimulatedEvents(`set:${key}`);
      return events.length > 0 ? events[events.length - 1] : null;
    }
    
    return null;
  }
  
  /**
   * Close Redis connections
   */
  public async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
    
    if (this.redisSubscriber) {
      await this.redisSubscriber.quit();
    }
  }
  
  /**
   * Check if connected to Redis
   */
  public isRedisConnected(): boolean {
    return this.isConnected;
  }
  
  /**
   * Check if running in simulated mode
   */
  public isSimulatedMode(): boolean {
    return this.isSimulated;
  }
  
  /**
   * Get node ID
   */
  public getNodeId(): string {
    return this.nodeId;
  }
}

// Create a singleton instance
export const redisEventBus = new RedisEventBus();
