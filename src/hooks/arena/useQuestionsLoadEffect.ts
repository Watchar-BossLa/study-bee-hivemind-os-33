
import { useEffect } from 'react';
import { ArenaMatch, QuizQuestion } from '@/types/arena';

interface QuestionsLoadEffectProps {
  currentMatch: ArenaMatch | null;
  questions: QuizQuestion[];
  fetchQuestions: () => Promise<void>;
}

export const useQuestionsLoadEffect = ({
  currentMatch,
  questions,
  fetchQuestions
}: QuestionsLoadEffectProps) => {
  // Effect to load questions when match becomes active
  useEffect(() => {
    if (currentMatch?.status === 'active' && questions.length === 0) {
      fetchQuestions();
    }
  }, [currentMatch, questions.length, fetchQuestions]);
};
