
import { SpecializedAgent } from '../types/agents';

export interface LearningRecommendation {
  id: string;
  type: 'study_path' | 'review_session' | 'concept_reinforcement' | 'skill_building';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: number; // in minutes
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reasoning: string;
  suggestedAgents: string[];
  expectedImprovement: number; // percentage
}

export interface UserAnalytics {
  subjectScores: Record<string, number>;
  weakAreas: string[];
  strongAreas: string[];
  learningVelocity: number;
  studyFrequency: number;
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  timeSpentBySubject: Record<string, number>;
}

export class LearningRecommendationService {
  private agents: SpecializedAgent[];

  constructor(agents: SpecializedAgent[] = []) {
    this.agents = agents;
  }

  public generateRecommendations(
    userAnalytics: UserAnalytics,
    currentGoals: string[] = []
  ): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // Generate weak area reinforcement recommendations
    userAnalytics.weakAreas.forEach(area => {
      if (userAnalytics.subjectScores[area] < 0.7) {
        recommendations.push(this.createWeakAreaRecommendation(area, userAnalytics));
      }
    });

    // Generate advanced skill building for strong areas
    userAnalytics.strongAreas.forEach(area => {
      if (userAnalytics.subjectScores[area] > 0.8) {
        recommendations.push(this.createAdvancementRecommendation(area, userAnalytics));
      }
    });

    // Generate study frequency recommendations
    if (userAnalytics.studyFrequency < 0.5) {
      recommendations.push(this.createConsistencyRecommendation(userAnalytics));
    }

    // Generate learning velocity improvements
    if (userAnalytics.learningVelocity < 0.6) {
      recommendations.push(this.createVelocityRecommendation(userAnalytics));
    }

    return recommendations
      .sort((a, b) => this.getPriorityScore(b.priority) - this.getPriorityScore(a.priority))
      .slice(0, 8); // Return top 8 recommendations
  }

  private createWeakAreaRecommendation(area: string, analytics: UserAnalytics): LearningRecommendation {
    const score = analytics.subjectScores[area] || 0;
    const priority = score < 0.5 ? 'urgent' : score < 0.6 ? 'high' : 'medium';
    
    return {
      id: `weak-${area}-${Date.now()}`,
      type: 'concept_reinforcement',
      title: `Strengthen ${area} Fundamentals`,
      description: `Focus on core concepts in ${area} to improve your understanding`,
      priority,
      estimatedTime: 30,
      subject: area,
      difficulty: 'beginner',
      reasoning: `Your ${area} score is ${Math.round(score * 100)}%. Reinforcing fundamentals will boost overall performance.`,
      suggestedAgents: this.getRelevantAgents(area).map(a => a.id),
      expectedImprovement: Math.min(30, (0.8 - score) * 100)
    };
  }

  private createAdvancementRecommendation(area: string, analytics: UserAnalytics): LearningRecommendation {
    return {
      id: `advance-${area}-${Date.now()}`,
      type: 'skill_building',
      title: `Advanced ${area} Challenges`,
      description: `Take your ${area} skills to the next level with advanced problems`,
      priority: 'medium',
      estimatedTime: 45,
      subject: area,
      difficulty: 'advanced',
      reasoning: `You're performing well in ${area}. Challenge yourself with advanced concepts.`,
      suggestedAgents: this.getRelevantAgents(area).map(a => a.id),
      expectedImprovement: 15
    };
  }

  private createConsistencyRecommendation(analytics: UserAnalytics): LearningRecommendation {
    const mostTimeSpentSubject = Object.entries(analytics.timeSpentBySubject)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General';

    return {
      id: `consistency-${Date.now()}`,
      type: 'study_path',
      title: 'Build Study Consistency',
      description: 'Establish a regular study routine to improve learning outcomes',
      priority: 'high',
      estimatedTime: 20,
      subject: mostTimeSpentSubject,
      difficulty: 'beginner',
      reasoning: 'Consistent study habits lead to better retention and understanding.',
      suggestedAgents: ['metacognition-coach', 'learning-strategist'],
      expectedImprovement: 25
    };
  }

  private createVelocityRecommendation(analytics: UserAnalytics): LearningRecommendation {
    return {
      id: `velocity-${Date.now()}`,
      type: 'study_path',
      title: 'Optimize Learning Efficiency',
      description: 'Learn techniques to absorb information faster and more effectively',
      priority: 'high',
      estimatedTime: 35,
      subject: 'Study Skills',
      difficulty: 'intermediate',
      reasoning: 'Improving learning velocity will help you master concepts more quickly.',
      suggestedAgents: ['learning-strategist', 'metacognition-coach'],
      expectedImprovement: 20
    };
  }

  private getRelevantAgents(subject: string): SpecializedAgent[] {
    return this.agents.filter(agent => 
      agent.expertise.some(exp => 
        exp.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(exp.toLowerCase())
      )
    ).slice(0, 3);
  }

  private getPriorityScore(priority: string): number {
    const scores = { urgent: 4, high: 3, medium: 2, low: 1 };
    return scores[priority as keyof typeof scores] || 1;
  }

  public getRecommendationsByType(type: LearningRecommendation['type']): LearningRecommendation[] {
    // This would typically fetch from a database or cache
    return [];
  }

  public markRecommendationCompleted(recommendationId: string): void {
    console.log(`Recommendation ${recommendationId} marked as completed`);
  }

  public getRecommendationEffectiveness(): Record<string, number> {
    // Return effectiveness metrics for different recommendation types
    return {
      'concept_reinforcement': 0.78,
      'skill_building': 0.65,
      'study_path': 0.82,
      'review_session': 0.71
    };
  }
}

export const learningRecommendationService = new LearningRecommendationService();
