
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LearningPath } from '../types/learning';

export const useLearningPath = (
  activeTopic: string | null,
  learningPaths: LearningPath[]
) => {
  const [recommendedPath, setRecommendedPath] = useState<string | null>(null);
  const { toast } = useToast();

  // Recommend learning path when a topic is selected
  useEffect(() => {
    if (activeTopic) {
      // Find learning paths that include the active topic
      const relevantPaths = learningPaths.filter(path => 
        path.topics.includes(activeTopic)
      );
      
      if (relevantPaths.length > 0) {
        // Select the first relevant path
        setRecommendedPath(relevantPaths[0].name);
      } else {
        setRecommendedPath(null);
      }
    } else {
      setRecommendedPath(null);
    }
  }, [activeTopic, learningPaths]);

  // Show toast when a learning path is recommended
  useEffect(() => {
    if (recommendedPath) {
      toast({
        title: "Learning Path Suggested",
        description: `The "${recommendedPath}" learning path is recommended based on your selection.`,
      });
    }
  }, [recommendedPath, toast]);

  return { recommendedPath };
};

export default useLearningPath;
