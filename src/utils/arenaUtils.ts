
export const calculateScore = (difficulty: string, responseTime: number): number => {
  const baseScore = 10;
  
  // Difficulty multiplier
  const difficultyMultiplier = {
    'easy': 1,
    'medium': 1.5,
    'hard': 2
  }[difficulty] || 1;
  
  // Time bonus (faster response = higher score)
  const maxTime = 15;
  const timeBonus = Math.max(0, (maxTime - responseTime) / maxTime);
  
  return Math.round(baseScore * difficultyMultiplier * (1 + timeBonus));
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getWinnerFromPlayers = (players: Array<{ score: number; user_id: string }>) => {
  if (players.length === 0) return null;
  
  return players.reduce((winner, player) => 
    player.score > winner.score ? player : winner
  );
};
