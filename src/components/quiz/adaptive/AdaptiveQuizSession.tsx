
import React, { useState, useEffect } from 'react';
import { 
  AdaptiveQuizQuestion, 
  AdaptiveQuizSession as AdaptiveQuizSessionType,
  AdaptiveQuizResult
} from '@/types/adaptive-quiz';
import { adaptiveQuizService } from '@/services/quiz/AdaptiveQuizService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, HelpCircle, AlertTriangle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdaptiveQuizSessionProps {
  sessionId: string;
  onComplete: (result: AdaptiveQuizResult) => void;
}

export const AdaptiveQuizSession = ({ sessionId, onComplete }: AdaptiveQuizSessionProps) => {
  const [session, setSession] = useState<AdaptiveQuizSessionType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<AdaptiveQuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);

  // Load the session and current question
  useEffect(() => {
    const loadSession = () => {
      try {
        const sessionData = adaptiveQuizService.getSession(sessionId);
        
        if (!sessionData) {
          setError('Session not found');
          return;
        }
        
        setSession(sessionData);
        
        // Set time limit if available
        if (sessionData.timeRemaining) {
          setTimeLeft(sessionData.timeRemaining);
        }
        
        // Load the current question
        const question = adaptiveQuizService.getCurrentQuestion(sessionId);
        
        if (!question) {
          setError('No questions available for this session');
          return;
        }
        
        setCurrentQuestion(question);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error loading session:', error);
        setError('Failed to load quiz session');
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, [sessionId]);

  // Handle the timer
  useEffect(() => {
    if (!timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime && prevTime <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prevTime ? prevTime - 1 : null;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleTimeout = () => {
    // If time runs out, submit the current answer if selected, otherwise submit a blank answer
    if (selectedOption) {
      handleSubmitAnswer();
    } else {
      // Submit a dummy answer to move to the next question or end the quiz
      handleSubmitAnswer(true);
    }
  };

  const handleSubmitAnswer = (timeout = false) => {
    if (!currentQuestion) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const optionToSubmit = timeout && !selectedOption ? 'timeout' : selectedOption;
    
    // Submit the answer to the service
    const result = adaptiveQuizService.submitAnswer(
      sessionId,
      currentQuestion.id,
      optionToSubmit,
      timeSpent,
      confidence
    );
    
    if (!result) {
      setError('Failed to submit answer. Please try again.');
      return;
    }
    
    if (session?.quizConfigId) {
      const quizConfig = adaptiveQuizService.getQuizConfig(session.quizConfigId);
      
      // Check if we should show feedback
      if (quizConfig && quizConfig.showFeedback) {
        setFeedback({
          correct: result.correct,
          explanation: currentQuestion.explanation
        });
        setShowFeedback(true);
        return;
      }
    }
    
    // Move to next question or complete quiz
    if (result.sessionComplete) {
      if (result.result) {
        onComplete(result.result);
      } else {
        setError('Failed to generate quiz results');
      }
    } else if (result.nextQuestion) {
      setCurrentQuestion(result.nextQuestion);
      setSelectedOption('');
      setConfidence('medium');
      setStartTime(Date.now());
      setShowFeedback(false);
      setFeedback(null);
    } else {
      setError('Failed to load the next question');
    }
  };

  const handleContinue = () => {
    // Get updated session and question
    const updatedSession = adaptiveQuizService.getSession(sessionId);
    
    if (!updatedSession) {
      setError('Session not found');
      return;
    }
    
    setSession(updatedSession);
    
    // Move to next question or complete quiz
    if (updatedSession.status === 'completed') {
      // This should not happen as we should have received the result already
      // But just in case, we check
      setError('Session already completed');
    } else {
      // Load the next question
      const nextQuestion = adaptiveQuizService.getCurrentQuestion(sessionId);
      
      if (!nextQuestion) {
        setError('Failed to load the next question');
        return;
      }
      
      setCurrentQuestion(nextQuestion);
      setSelectedOption('');
      setConfidence('medium');
      setStartTime(Date.now());
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  const formatTimeLeft = () => {
    if (!timeLeft) return '';
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getProgressPercentage = () => {
    if (!session) return 0;
    return (session.questionsAnswered.length / session.maxScore) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      case 'expert': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Loading Quiz...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Preparing your adaptive quiz experience</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quiz Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">The requested quiz session could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  // Render feedback screen if showing feedback
  if (showFeedback && feedback) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question Feedback</CardTitle>
            {timeLeft !== null && (
              <div className="flex items-center gap-2 font-medium">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 60 ? 'text-red-500' : ''}>{formatTimeLeft()}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Question {session.questionsAnswered.length} of {session.maxScore}</span>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
              </Badge>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert
            variant={feedback.correct ? "default" : "destructive"}
            className={feedback.correct ? "bg-green-50 text-green-800 border-green-200" : ""}
          >
            <AlertDescription className="flex items-start gap-2">
              {feedback.correct ? (
                <span>✓ Correct!</span>
              ) : (
                <span>✗ Incorrect</span>
              )}
            </AlertDescription>
          </Alert>
          
          <div>
            <h3 className="font-medium mb-2">Explanation:</h3>
            <p className="text-muted-foreground">{feedback.explanation}</p>
          </div>
        </CardContent>
        
        <CardFooter className="justify-end">
          <Button onClick={handleContinue}>Continue</Button>
        </CardFooter>
      </Card>
    );
  }

  // Render the quiz question
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Adaptive Quiz</CardTitle>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" />
              <span className={timeLeft < 60 ? 'text-red-500' : ''}>{formatTimeLeft()}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Question {session.questionsAnswered.length + 1} of {session.maxScore}</span>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
              {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
            </Badge>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{currentQuestion.question}</h3>
          {currentQuestion.imageUrl && (
            <img
              src={currentQuestion.imageUrl}
              alt="Question Image"
              className="max-w-full h-auto rounded-md mt-4 max-h-64 object-contain"
            />
          )}
        </div>
        
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
          {currentQuestion.options.map(option => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer rounded-md border border-transparent p-2 hover:bg-accent hover:text-accent-foreground"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <Label htmlFor="confidence" className="flex items-center gap-1">
              <HelpCircle className="h-4 w-4" />
              How confident are you in your answer?
            </Label>
            <Select value={confidence} onValueChange={(value) => setConfidence(value as any)}>
              <SelectTrigger id="confidence" className="w-full sm:w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Not very confident</SelectItem>
                <SelectItem value="medium">Somewhat confident</SelectItem>
                <SelectItem value="high">Very confident</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-end">
        <Button onClick={() => handleSubmitAnswer()} disabled={!selectedOption}>
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
};
