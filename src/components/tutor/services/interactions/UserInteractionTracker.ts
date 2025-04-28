
import { UserInteraction } from '../../types/agents';

export class UserInteractionTracker {
  private interactions: UserInteraction[] = [];
  private userTopicInterests: Map<string, Record<string, number>> = new Map();

  public addInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
  }

  public getRecentInteractions(limit: number = 10): UserInteraction[] {
    return this.interactions.slice(-limit);
  }

  public recordUserFeedback(
    interactionId: string, 
    userId: string, 
    rating: number, 
    agentFeedback?: Record<string, number>,
    comments?: string
  ): void {
    const interaction = this.interactions.find(i => i.id === interactionId);
    if (!interaction) return;
    
    interaction.userFeedback = {
      rating,
      comments,
      helpfulAgents: agentFeedback ? 
        Object.entries(agentFeedback)
          .filter(([_, score]) => score >= 4)
          .map(([agentId, _]) => agentId) : 
        undefined
    };
    
    if (interaction.context.topicId) {
      this.updateTopicInterests(userId, interaction.context.topicId);
    }
  }

  private updateTopicInterests(userId: string, topicId: string): void {
    let userTopics = this.userTopicInterests.get(userId) || {};
    userTopics[topicId] = (userTopics[topicId] || 0) + 1;
    this.userTopicInterests.set(userId, userTopics);
  }

  public getUserTopInterests(userId: string, limit: number = 5): string[] {
    const userTopics = this.userTopicInterests.get(userId);
    if (!userTopics) return [];
    
    return Object.entries(userTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topicId, _]) => topicId);
  }
}
