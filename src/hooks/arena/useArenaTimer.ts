
import { useState, useCallback } from 'react';

export const useArenaTimer = (initialTime: number = 30) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const resetTimer = useCallback((newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
  }, [initialTime]);

  return {
    timeLeft,
    setTimeLeft,
    resetTimer
  };
};
