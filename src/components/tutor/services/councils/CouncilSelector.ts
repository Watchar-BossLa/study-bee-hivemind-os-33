
import { DynamicCouncilManager } from './DynamicCouncilManager';

export class CouncilSelector {
  constructor(private dynamicCouncilManager: DynamicCouncilManager) {}
  
  public determineCouncilForMessage(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('math') || lowerMessage.includes('equation') || 
        lowerMessage.includes('calculus') || lowerMessage.includes('algebra') ||
        lowerMessage.includes('geometry') || lowerMessage.includes('statistical')) {
      return 'mathematics';
    } else if (lowerMessage.includes('science') || lowerMessage.includes('biology') || 
               lowerMessage.includes('chemistry') || lowerMessage.includes('physics') ||
               lowerMessage.includes('experiment') || lowerMessage.includes('scientific')) {
      return 'science';
    } else if (lowerMessage.includes('english') || lowerMessage.includes('literature') || 
               lowerMessage.includes('writing') || lowerMessage.includes('grammar') ||
               lowerMessage.includes('history') || lowerMessage.includes('philosophy')) {
      return 'language';
    } else if (lowerMessage.includes('how to learn') || lowerMessage.includes('study technique') || 
               lowerMessage.includes('memory') || lowerMessage.includes('concentration') ||
               lowerMessage.includes('focus') || lowerMessage.includes('metacognition')) {
      return 'meta-learning';
    } else if (lowerMessage.includes('group') || lowerMessage.includes('together') || 
               lowerMessage.includes('team') || lowerMessage.includes('collaborate') ||
               lowerMessage.includes('peer') || lowerMessage.includes('social learning')) {
      return 'collaborative';
    }
    
    return this.dynamicCouncilManager.createDynamicCouncil(message);
  }
}
