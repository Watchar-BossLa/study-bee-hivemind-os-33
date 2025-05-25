
import { SpecializedAgent } from '../../types/agents';

export interface QueryComplexity {
  level: 'simple' | 'moderate' | 'complex' | 'expert';
  domains: string[];
  requiredExpertise: string[];
  estimatedAgentCount: number;
}

export class CouncilQueryAnalyzer {
  public analyzeQueryComplexity(query: string): QueryComplexity {
    const words = query.toLowerCase().split(/\s+/);
    const complexityIndicators = {
      simple: ['what', 'is', 'define', 'explain'],
      moderate: ['how', 'why', 'compare', 'analyze'],
      complex: ['evaluate', 'synthesize', 'design', 'create'],
      expert: ['optimize', 'architect', 'research', 'innovate']
    };

    let complexity: QueryComplexity['level'] = 'simple';
    let score = 0;

    Object.entries(complexityIndicators).forEach(([level, keywords]) => {
      const matches = keywords.filter(keyword => words.some(word => word.includes(keyword))).length;
      if (matches > 0) {
        const levelScore = matches * (level === 'expert' ? 4 : level === 'complex' ? 3 : level === 'moderate' ? 2 : 1);
        if (levelScore > score) {
          score = levelScore;
          complexity = level as QueryComplexity['level'];
        }
      }
    });

    const domains = this.extractDomains(query);
    const requiredExpertise = this.extractRequiredExpertise(query);
    
    return {
      level: complexity,
      domains,
      requiredExpertise,
      estimatedAgentCount: Math.min(3 + domains.length - 1, 7)
    };
  }

  private extractDomains(query: string): string[] {
    const domainKeywords = {
      mathematics: ['math', 'algebra', 'geometry', 'calculus', 'statistics'],
      science: ['physics', 'chemistry', 'biology', 'science'],
      programming: ['code', 'programming', 'algorithm', 'software'],
      language: ['english', 'writing', 'literature', 'grammar']
    };

    const foundDomains: string[] = [];
    const queryLower = query.toLowerCase();

    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        foundDomains.push(domain);
      }
    });

    return foundDomains.length > 0 ? foundDomains : ['general'];
  }

  private extractRequiredExpertise(query: string): string[] {
    const expertiseKeywords = {
      'content expertise': ['explain', 'define', 'describe'],
      'problem solving': ['solve', 'find', 'calculate'],
      'assessment': ['evaluate', 'grade', 'test'],
      'strategy': ['plan', 'approach', 'method'],
      'creativity': ['create', 'design', 'invent']
    };

    const requiredExpertise: string[] = [];
    const queryLower = query.toLowerCase();

    Object.entries(expertiseKeywords).forEach(([expertise, keywords]) => {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        requiredExpertise.push(expertise);
      }
    });

    return requiredExpertise.length > 0 ? requiredExpertise : ['general knowledge'];
  }
}
