
import { useState, useEffect } from 'react';

export const useArenaTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timerId: number | undefined;

    if (timerActive && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (timerId !== undefined) {
        clearInterval(timerId);
      }
    };
  }, [timerActive, timeLeft]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimeLeft(15);
    setTimerActive(false);
  };

  return {
    timeLeft,
    setTimeLeft,
    timerActive,
    startTimer,
    stopTimer,
    resetTimer
  };
};
