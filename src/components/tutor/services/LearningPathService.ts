
import { LearningPath } from '../types/agents';
import { quorumForge } from './QuorumForge';

// Sample learning paths based on the Study Bee spec
export const predefinedLearningPaths: LearningPath[] = [
  {
    id: 'biology-basics',
    name: 'Cell Biology Track',
    description: 'Learn the fundamentals of cell biology, from structure to function.',
    topics: ['Cell Biology', 'Mitochondria', 'ATP', 'Cellular Respiration'],
    difficulty: 'beginner',
    estimatedTimeHours: 8,
    prerequisites: [],
    recommendedAgents: ['content-expert', 'learning-strategist']
  },
  {
    id: 'genetics-intro',
    name: 'Genetics Track',
    description: 'Explore the principles of genetics and DNA replication.',
    topics: ['Genetics', 'DNA', 'RNA', 'Protein Synthesis'],
    difficulty: 'intermediate',
    estimatedTimeHours: 12,
    prerequisites: ['Cell Biology'],
    recommendedAgents: ['content-expert', 'assessment-expert']
  },
  {
    id: 'evolution-principles',
    name: 'Evolution Track',
    description: 'Understand the mechanisms of evolution and natural selection.',
    topics: ['Evolution', 'Natural Selection', 'Genetics'],
    difficulty: 'intermediate',
    estimatedTimeHours: 10,
    prerequisites: ['Genetics'],
    recommendedAgents: ['content-expert', 'engagement-specialist']
  }
];

export class LearningPathService {
  private paths: LearningPath[];
  
  constructor(initialPaths: LearningPath[] = predefinedLearningPaths) {
    this.paths = [...initialPaths];
  }
  
  // Get all available learning paths
  public getAllPaths(): LearningPath[] {
    return this.paths;
  }
  
  // Get a learning path by ID
  public getPathById(id: string): LearningPath | undefined {
    return this.paths.find(path => path.id === id);
  }
  
  // Get learning paths that contain a specific topic
  public getPathsByTopic(topic: string): LearningPath[] {
    return this.paths.filter(path => 
      path.topics.some(t => t.toLowerCase() === topic.toLowerCase())
    );
  }
  
  // Get learning paths appropriate for a user's knowledge level
  public getPathsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): LearningPath[] {
    return this.paths.filter(path => path.difficulty === difficulty);
  }
  
  // Add a new learning path
  public addPath(path: LearningPath): void {
    this.paths.push(path);
  }
  
  // Generate a personalized learning path using the QuorumForge system
  public async generatePersonalizedPath(
    userId: string,
    interests: string[],
    currentKnowledge: string[],
    targetTopics: string[],
    preferredDifficulty: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<LearningPath> {
    try {
      // Use QuorumForge to deliberate on the best learning path
      const context = {
        userId,
        interests,
        currentKnowledge,
        targetTopics,
        preferredDifficulty
      };
      
      // Deliberate using the meta-council for complex decisions
      const decision = await quorumForge.deliberate(
        'meta',
        'learning-path-generation',
        context
      );
      
      // In a real implementation, this would parse the decision to create a path
      // For this simulation, we'll create a simplified path based on the inputs
      const newPath: LearningPath = {
        id: `custom-${Date.now()}`,
        name: `Custom ${targetTopics[0]} Path for User`,
        description: `Personalized learning path focusing on ${targetTopics.join(', ')}`,
        topics: [...targetTopics],
        difficulty: preferredDifficulty,
        estimatedTimeHours: 10, // Would be calculated in a real system
        prerequisites: currentKnowledge,
        recommendedAgents: ['learning-strategist', 'content-expert']
      };
      
      // Add the new path to the collection
      this.addPath(newPath);
      
      return newPath;
    } catch (error) {
      console.error('Error generating personalized learning path:', error);
      throw new Error('Failed to generate personalized learning path');
    }
  }
  
  // Recommend the next best learning path based on completed paths
  public recommendNextPath(completedPathIds: string[]): LearningPath | null {
    // Get completed paths
    const completed = this.paths.filter(path => completedPathIds.includes(path.id));
    
    // Extract all completed topics
    const completedTopics = new Set<string>();
    completed.forEach(path => path.topics.forEach(topic => completedTopics.add(topic)));
    
    // Find paths that aren't completed but have prerequisites satisfied
    const eligiblePaths = this.paths.filter(path => {
      // Skip already completed paths
      if (completedPathIds.includes(path.id)) return false;
      
      // Check if prerequisites are met
      return path.prerequisites.every(prereq => completedTopics.has(prereq));
    });
    
    // Sort by difficulty (prefer next level up from most recent completion)
    const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
    const lastCompletedPath = completed[completed.length - 1];
    const lastDifficultyIndex = lastCompletedPath 
      ? difficultyOrder.indexOf(lastCompletedPath.difficulty) 
      : -1;
    
    // Prefer paths that are one level higher than the last completed path
    eligiblePaths.sort((a, b) => {
      const aIndex = difficultyOrder.indexOf(a.difficulty);
      const bIndex = difficultyOrder.indexOf(b.difficulty);
      
      // Prefer paths that are one level higher
      const aDistance = Math.abs(aIndex - (lastDifficultyIndex + 1));
      const bDistance = Math.abs(bIndex - (lastDifficultyIndex + 1));
      
      return aDistance - bDistance;
    });
    
    return eligiblePaths.length > 0 ? eligiblePaths[0] : null;
  }
}

// Create a singleton instance
export const learningPathService = new LearningPathService();
