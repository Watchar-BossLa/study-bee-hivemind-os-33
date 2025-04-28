
export function extractTopicsFromMessage(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const potentialTopics = [
    'Mitochondria', 'ATP', 'Cellular Respiration', 'Krebs Cycle',
    'Electron Transport', 'Glycolysis', 'Cell Biology', 'DNA',
    'RNA', 'Protein Synthesis', 'Genetics', 'Evolution',
    'Natural Selection', 'Algebra', 'Calculus', 'Statistics',
    'Geometry', 'Probability', 'Physics', 'Chemistry',
    'Literature', 'Grammar', 'History', 'Philosophy',
    'Programming', 'Computer Science'
  ];
  
  return potentialTopics.filter(topic => 
    lowerMessage.includes(topic.toLowerCase())
  );
}

export function generateFollowUpQuestions(message: string, topics: string[]): string[] {
  const followUps: string[] = [];
  
  topics.forEach(topic => {
    if (topic.toLowerCase() === 'mitochondria' || topic.toLowerCase() === 'atp') {
      followUps.push("How does the electron transport chain contribute to ATP production?");
    } else if (topic.toLowerCase() === 'dna' || topic.toLowerCase() === 'rna') {
      followUps.push("What are the key differences between DNA and RNA?");
    } else if (topic.toLowerCase() === 'evolution' || topic.toLowerCase() === 'natural selection') {
      followUps.push("What are some examples of natural selection in action?");
    }
  });
  
  if (followUps.length === 0) {
    followUps.push("Would you like me to explain this topic in more detail?");
    followUps.push("Would you like to see a visual representation of this concept?");
  }
  
  return followUps.slice(0, 3);
}

export function identifyKnowledgeGraphNodes(message: string, topics: string[]): string[] {
  return topics.map(t => `node-${t.toLowerCase().replace(/\s+/g, '-')}`);
}
