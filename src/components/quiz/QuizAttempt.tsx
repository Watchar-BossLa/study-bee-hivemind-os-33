
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, X, Clock, AlertTriangle } from 'lucide-react';
import { CurriculumQuiz, QuizAttempt } from '@/types/quiz';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';

interface QuizAttemptProps {
  quiz: CurriculumQuiz;
  onComplete: (attempt: Omit<QuizAttempt, 'id'>) => void;
  onCancel: () => void;
}

export function QuizAttemptComponent({ quiz, onComplete, onCancel }: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
  const [startTime] = useState<string>(new Date().toISOString());
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Handle timer if time limit exists
  useEffect(() => {
    if (!quiz.timeLimit) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.timeLimit]);

  // Track time spent on current question
  useEffect(() => {
    const questionStartTime = Date.now();
    
    return () => {
      const timeOnQuestion = Math.round((Date.now() - questionStartTime) / 1000);
      
      if (currentQuestion) {
        setTimeSpent(prev => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || 0) + timeOnQuestion
        }));
      }
    };
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setIsCompleted(true);
    setEndTime(new Date().toISOString());

    // Calculate score
    let score = 0;
    const answers = quiz.questions.map(question => {
      const selectedAnswer = selectedAnswers[question.id] || 'none';
      const isCorrect = selectedAnswer === question.correct_answer;
      
      if (isCorrect) score++;
      
      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        timeSpent: timeSpent[question.id] || 0
      };
    });

    const passed = score >= quiz.passingScore;

    // Prepare attempt data
    const attempt: Omit<QuizAttempt, 'id'> = {
      quizId: quiz.id,
      userId: '', // Will be filled in by the parent
      score,
      maxScore: totalQuestions,
      answers,
      startedAt: startTime,
      completedAt: endTime,
      passed
    };

    onComplete(attempt);
  };

  const formatTimeLeft = () => {
    if (!timeLeft) return '';
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  if (!currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Quiz Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was an error loading the quiz questions.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onCancel}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <SectionErrorBoundary sectionName="QuizAttempt">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 60 ? 'text-red-500' : ''}>{formatTimeLeft()}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>Score needed to pass: {quiz.passingScore}/{totalQuestions}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-2">{currentQuestion.question}</h3>
          </div>
          
          <div className="grid gap-3">
            {['a', 'b', 'c', 'd'].map((option) => {
              const optionKey = `option_${option}` as keyof typeof currentQuestion;
              const optionContent = currentQuestion[optionKey] as string;
              const isSelected = selectedAnswers[currentQuestion.id] === option;
              
              return (
                <Button
                  key={option}
                  variant={isSelected ? "secondary" : "outline"}
                  className="justify-start p-4 h-auto text-left"
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                    {option.toUpperCase()}
                  </span>
                  {optionContent}
                </Button>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancel Quiz
          </Button>
          <Button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </CardFooter>
      </Card>
    </SectionErrorBoundary>
  );
}
