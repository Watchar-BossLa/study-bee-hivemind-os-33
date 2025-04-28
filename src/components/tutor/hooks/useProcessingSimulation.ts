
import { useCallback } from 'react';

export const useProcessingSimulation = (
  setProcessingProgress: (progress: number) => void,
  completeResponse: () => void
) => {
  const simulateProcessing = useCallback(() => {
    setProcessingProgress(0);
    const steps = [
      "Analyzing query complexity",
      "Selecting optimal agent council",
      "Routing to specialized AI experts",
      "Retrieving knowledge graph nodes",
      "Coordinating multi-agent response",
      "Generating personalized explanation"
    ];
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        const progress = Math.round(((step + 1) / steps.length) * 100);
        setProcessingProgress(progress);
        step++;
      } else {
        clearInterval(interval);
        completeResponse();
      }
    }, 800);
  }, [setProcessingProgress, completeResponse]);

  return { simulateProcessing };
};
