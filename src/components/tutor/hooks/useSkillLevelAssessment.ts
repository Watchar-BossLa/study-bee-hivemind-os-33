
import { useState, useCallback } from 'react';

export type UserSkillLevel = 'beginner' | 'intermediate' | 'advanced';

export function useSkillLevelAssessment() {
  const [skillLevel, setSkillLevel] = useState<UserSkillLevel>('intermediate');

  const assessSkillLevel = useCallback((messages: Array<{ role: string; content: string }>) => {
    const userMessages = messages.filter(m => m.role === 'user');
    
    const avgWordLength = userMessages.reduce((sum, msg) => 
      sum + msg.content.split(/\s+/).reduce((wSum, w) => wSum + w.length, 0) / 
            msg.content.split(/\s+/).length, 0) / userMessages.length;
    
    const avgMessageLength = userMessages.reduce((sum, msg) => 
      sum + msg.content.length, 0) / userMessages.length;
    
    const technicalTerms = ['therefore', 'furthermore', 'however', 'specifically', 'consequently'];
    const technicalTermUse = userMessages.reduce((count, msg) => 
      count + technicalTerms.filter(term => msg.content.toLowerCase().includes(term)).length, 0);
    
    let newSkillLevel: UserSkillLevel = 'intermediate';
    
    if (avgWordLength > 6 && avgMessageLength > 100 && technicalTermUse > 2) {
      newSkillLevel = 'advanced';
    } else if (avgWordLength < 4.5 && avgMessageLength < 50 && technicalTermUse === 0) {
      newSkillLevel = 'beginner';
    }
    
    setSkillLevel(newSkillLevel);
    return newSkillLevel;
  }, []);

  return {
    skillLevel,
    assessSkillLevel
  };
}
