
import { SpecializedAgent } from '../../types/agents';

/**
 * DynamicCouncilManager - Manages the creation and lifecycle of dynamic councils
 */
export class DynamicCouncilManager {
  private dynamicCouncilCounter: number = 0;
  
  /**
   * Create a dynamic council based on a topic and set of agents
   * @param topic The topic for the council
   * @param agents The agents to include in the council
   * @returns The ID of the created dynamic council
   */
  public createDynamicCouncil(topic: string, agents: SpecializedAgent[]): string {
    // Generate a unique ID for the dynamic council
    const councilId = `dynamic-${topic.toLowerCase().replace(/\s+/g, '-')}-${++this.dynamicCouncilCounter}`;
    
    // In a real implementation, we would store this council in a persistent store
    console.log(`Created dynamic council ${councilId} with ${agents.length} agents for topic: ${topic}`);
    
    return councilId;
  }
  
  /**
   * Check if a council ID represents a dynamic council
   * @param councilId The council ID to check
   * @returns True if the council is a dynamic council
   */
  public isDynamicCouncil(councilId: string): boolean {
    return councilId.startsWith('dynamic-');
  }
  
  /**
   * Get the topic of a dynamic council
   * @param councilId The dynamic council ID
   * @returns The topic of the council, or null if not a dynamic council
   */
  public getDynamicCouncilTopic(councilId: string): string | null {
    if (!this.isDynamicCouncil(councilId)) {
      return null;
    }
    
    // Extract the topic from the council ID
    const parts = councilId.split('-');
    if (parts.length < 3) {
      return null;
    }
    
    // Remove the 'dynamic-' prefix and the counter suffix
    return parts.slice(1, -1).join('-').replace(/-/g, ' ');
  }
}
