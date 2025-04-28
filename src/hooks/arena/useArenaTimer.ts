
import { useState } from 'react';

export const useArenaTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15);

  const resetTimer = () => {
    setTimeLeft(15);
  };

  return {
    timeLeft,
    setTimeLeft,
    resetTimer
  };
};
