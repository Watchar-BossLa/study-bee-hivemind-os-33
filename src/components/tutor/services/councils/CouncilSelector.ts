
/**
 * CouncilSelector - Selects the appropriate council based on the message content
 */
export class CouncilSelector {
  // Default weights for different topics
  private topicWeights: Record<string, Record<string, number>> = {
    'tutor': {
      'learn': 5, 'teach': 5, 'explain': 5, 'help': 4, 'understand': 4,
      'concept': 3, 'question': 3, 'example': 2, 'practice': 2
    },
    'security': {
      'security': 5, 'vulnerability': 5, 'exploit': 5, 'attack': 4, 'protection': 4,
      'risk': 3, 'threat': 3, 'secure': 3, 'privacy': 2, 'encrypt': 2
    },
    'reasoning': {
      'reason': 5, 'logic': 5, 'analyze': 4, 'critical': 4, 'thinking': 4,
      'evaluate': 3, 'assessment': 3, 'judgment': 2, 'rational': 2
    },
    'code': {
      'code': 5, 'program': 5, 'function': 4, 'class': 4, 'algorithm': 4,
      'debug': 3, 'implement': 3, 'syntax': 3, 'compiler': 2, 'framework': 2
    },
    'general': {
      'general': 3, 'overview': 3, 'summary': 3, 'introduction': 3, 'basics': 3
    }
  };

  /**
   * Select the most appropriate council based on the message content
   * @param message The user message
   * @param availableCouncilIds List of available council IDs
   * @returns The ID of the selected council
   */
  public selectCouncilForMessage(message: string, availableCouncilIds: string[]): string {
    if (availableCouncilIds.length === 0) {
      return 'general'; // Default fallback
    }
    
    if (availableCouncilIds.length === 1) {
      return availableCouncilIds[0]; // Only one option available
    }

    const messageLower = message.toLowerCase();
    const scores: Record<string, number> = {};
    
    // Initialize scores
    for (const councilId of availableCouncilIds) {
      scores[councilId] = 0;
    }
    
    // Calculate scores based on topic weights
    for (const councilId of availableCouncilIds) {
      const weights = this.topicWeights[councilId] || {};
      
      for (const [keyword, weight] of Object.entries(weights)) {
        if (messageLower.includes(keyword)) {
          scores[councilId] += weight;
        }
      }
    }
    
    // Find council with highest score
    let maxScore = -1;
    let selectedCouncil = availableCouncilIds[0];
    
    for (const [councilId, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        selectedCouncil = councilId;
      }
    }
    
    // If no keywords matched, use 'general' if available, otherwise the first one
    if (maxScore === 0) {
      if (availableCouncilIds.includes('general')) {
        return 'general';
      }
      return availableCouncilIds[0];
    }
    
    return selectedCouncil;
  }
  
  /**
   * Update the weights for a specific topic
   * @param councilId The council ID
   * @param weights New weights to set or update
   */
  public updateTopicWeights(councilId: string, weights: Record<string, number>): void {
    this.topicWeights[councilId] = {
      ...(this.topicWeights[councilId] || {}),
      ...weights
    };
  }
}
