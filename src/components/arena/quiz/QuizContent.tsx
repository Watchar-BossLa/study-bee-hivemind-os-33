
import React from 'react';
import { QuizOption } from './QuizOption';
import { QuizQuestion } from '@/types/arena';

interface QuizContentProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onAnswer: (answer: 'a' | 'b' | 'c' | 'd') => void;
}

export const QuizContent: React.FC<QuizContentProps> = ({
  question,
  selectedAnswer,
  onAnswer
}) => {
  const getCorrectStatus = (option: string): boolean | null => {
    if (!selectedAnswer) return null;
    
    if (option === question.correct_answer) {
      return true;
    }
    
    if (selectedAnswer === option && option !== question.correct_answer) {
      return false;
    }
    
    return null;
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-medium">{question.question}</h3>
      </div>
      <div className="grid gap-3">
        <QuizOption
          letter="A"
          text={question.option_a}
          isSelected={selectedAnswer === 'a'}
          isCorrect={getCorrectStatus('a')}
          onClick={() => onAnswer('a')}
          disabled={!!selectedAnswer}
        />
        <QuizOption
          letter="B"
          text={question.option_b}
          isSelected={selectedAnswer === 'b'}
          isCorrect={getCorrectStatus('b')}
          onClick={() => onAnswer('b')}
          disabled={!!selectedAnswer}
        />
        <QuizOption
          letter="C"
          text={question.option_c}
          isSelected={selectedAnswer === 'c'}
          isCorrect={getCorrectStatus('c')}
          onClick={() => onAnswer('c')}
          disabled={!!selectedAnswer}
        />
        <QuizOption
          letter="D"
          text={question.option_d}
          isSelected={selectedAnswer === 'd'}
          isCorrect={getCorrectStatus('d')}
          onClick={() => onAnswer('d')}
          disabled={!!selectedAnswer}
        />
      </div>
    </>
  );
};
