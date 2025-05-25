
import { SpecializedAgent, LearningPath } from '../types/agents';

export class LearningPathService {
  private agents: SpecializedAgent[];

  constructor(agents: SpecializedAgent[] = []) {
    this.agents = agents;
  }

  public generateLearningPath(
    topic: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
    duration: number = 30
  ): LearningPath {
    const pathId = `path-${Date.now()}`;
    
    const path: LearningPath = {
      id: pathId,
      name: `Learning Path: ${topic}`,
      description: `Structured learning path for ${topic} at ${userLevel} level`,
      topics: [
        `Introduction to ${topic}`,
        `Core Concepts of ${topic}`,
        `Advanced ${topic} Techniques`,
        `Practical Applications of ${topic}`
      ],
      difficulty: userLevel,
      estimatedDuration: duration,
      prerequisites: userLevel === 'beginner' ? [] : [`Basic ${topic} knowledge`]
    };

    return path;
  }

  public getRecommendedAgents(path: LearningPath): SpecializedAgent[] {
    return this.agents.filter(agent =>
      agent.expertise.some(expertise =>
        path.topics.some(topic =>
          topic.toLowerCase().includes(expertise.toLowerCase()) ||
          expertise.toLowerCase().includes(topic.toLowerCase())
        )
      )
    ).slice(0, 3);
  }

  public updatePathProgress(pathId: string, completedTopics: string[]): void {
    console.log(`Updated progress for path ${pathId}:`, completedTopics);
  }

  public getAvailablePaths(): LearningPath[] {
    return [
      {
        id: 'math-basics',
        name: 'Mathematics Fundamentals',
        description: 'Core mathematics concepts and problem-solving',
        topics: ['Algebra', 'Geometry', 'Statistics'],
        difficulty: 'beginner',
        estimatedDuration: 45
      },
      {
        id: 'science-intro',
        name: 'Introduction to Science',
        description: 'Basic scientific principles and methods',
        topics: ['Biology', 'Chemistry', 'Physics'],
        difficulty: 'beginner',
        estimatedDuration: 60
      }
    ];
  }

  public getPathsByTopic(topic: string): LearningPath[] {
    return this.getAvailablePaths().filter(path =>
      path.topics.some(pathTopic =>
        pathTopic.toLowerCase().includes(topic.toLowerCase())
      )
    );
  }
}

// Export singleton instance
export const learningPathService = new LearningPathService();
