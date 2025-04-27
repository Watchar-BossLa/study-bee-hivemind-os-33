
export const calculateScore = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 20;
    case 'hard': return 30;
    default: return 10;
  }
};
