
import { AdaptationThresholds } from '../types/AdaptationTypes';

export const DEFAULT_ADAPTATION_THRESHOLDS: AdaptationThresholds = {
  difficultyIncrease: { accuracy: 0.8, consecutiveCorrect: 3 },
  difficultyDecrease: { accuracy: 0.4, consecutiveIncorrect: 3 },
  breakSuggestion: { timeOnTask: 45, frustrationLevel: 0.7 },
  hintProvision: { responseTime: 60000, cognitiveLoad: 0.8 },
  contentSwitch: { engagementLevel: 0.3, timeOnTask: 20 }
};
