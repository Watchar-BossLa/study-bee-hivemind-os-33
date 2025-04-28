
/**
 * Calculates the score for a correct answer based on difficulty and response time
 * 
 * @param difficulty The difficulty level of the question
 * @param responseTime The time taken to answer in seconds
 * @returns The calculated score
 */
export const calculateScore = (
  difficulty: 'easy' | 'medium' | 'hard',
  responseTime: number = 0
): number => {
  // Base scores by difficulty
  const baseScores = {
    easy: 10,
    medium: 20,
    hard: 30
  };
  
  // Calculate time bonus (faster responses get higher bonuses)
  // Maximum time is 15 seconds, so responseTime should be between 0-15
  const maxResponseTime = 15;
  const normalizedTime = Math.min(responseTime, maxResponseTime) / maxResponseTime;
  const timeMultiplier = 1 + (1 - normalizedTime) * 0.5; // 1.0 to 1.5x bonus for speed
  
  // Calculate final score
  const baseScore = baseScores[difficulty];
  const finalScore = Math.round(baseScore * timeMultiplier);
  
  return finalScore;
};

/**
 * Calculates the experience points earned from a match
 * 
 * @param score The player's score in the match
 * @param correctAnswers Number of correct answers
 * @param questionsAnswered Total questions answered
 * @param isWinner Whether the player won the match
 * @returns The calculated XP
 */
export const calculateMatchXP = (
  score: number,
  correctAnswers: number,
  questionsAnswered: number,
  isWinner: boolean
): number => {
  // Base XP is the score
  let xp = score;
  
  // Accuracy bonus (up to 50% extra)
  const accuracy = questionsAnswered > 0 ? correctAnswers / questionsAnswered : 0;
  const accuracyBonus = Math.round(score * accuracy * 0.5);
  
  // Winner bonus (25% extra)
  const winnerBonus = isWinner ? Math.round(score * 0.25) : 0;
  
  // Sum all bonuses
  xp += accuracyBonus + winnerBonus;
  
  return xp;
};

/**
 * Determines the level based on total XP
 * 
 * @param totalXP The total experience points
 * @returns The calculated level
 */
export const calculateLevel = (totalXP: number): number => {
  // Simple level calculation: every 1000 XP is a new level, starting from level 1
  return Math.max(1, Math.floor(totalXP / 1000) + 1);
};

/**
 * Calculates progress to next level as a percentage
 * 
 * @param totalXP The total experience points
 * @returns The percentage progress to next level (0-100)
 */
export const calculateLevelProgress = (totalXP: number): number => {
  const currentLevel = calculateLevel(totalXP);
  const xpForCurrentLevel = (currentLevel - 1) * 1000;
  const xpForNextLevel = currentLevel * 1000;
  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForLevelUp = xpForNextLevel - xpForCurrentLevel;
  
  return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForLevelUp) * 100));
};
