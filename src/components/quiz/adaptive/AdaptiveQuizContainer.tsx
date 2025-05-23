
import React, { useState, useEffect } from 'react';
import { AdaptiveQuizListing } from './AdaptiveQuizListing';
import { AdaptiveQuizSession } from './AdaptiveQuizSession';
import { AdaptiveQuizResults } from './AdaptiveQuizResults';
import { AdaptiveQuizConfig, AdaptiveQuizResult } from '@/types/adaptive-quiz';
import { adaptiveQuizService } from '@/services/quiz/AdaptiveQuizService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdaptiveQuizContainer = () => {
  const [quizzes, setQuizzes] = useState<AdaptiveQuizConfig[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<AdaptiveQuizResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('available');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const availableQuizzes = adaptiveQuizService.getQuizzes();
      setQuizzes(availableQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quizzes. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to start a quiz',
          variant: 'destructive',
        });
        return;
      }
      
      // Create a new quiz session
      const session = adaptiveQuizService.createSession(user.id, quizId);
      
      if (!session) {
        toast({
          title: 'Error',
          description: 'Failed to start quiz session. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedQuizId(quizId);
      setActiveSessionId(session.id);
      setQuizResult(null);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to start quiz. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleQuizComplete = (result: AdaptiveQuizResult) => {
    setQuizResult(result);
    setActiveSessionId(null);
    
    toast({
      title: result.passed ? 'Quiz Passed!' : 'Quiz Completed',
      description: `Your score: ${result.finalScore}/${result.maxScore}`,
      variant: result.passed ? 'default' : 'secondary',
    });
  };

  const handleReturnToListing = () => {
    setSelectedQuizId(null);
    setActiveSessionId(null);
    setQuizResult(null);
  };

  // Render the appropriate component based on the current state
  const renderContent = () => {
    if (activeSessionId) {
      return (
        <AdaptiveQuizSession 
          sessionId={activeSessionId}
          onComplete={handleQuizComplete}
        />
      );
    }
    
    if (quizResult) {
      return (
        <AdaptiveQuizResults 
          result={quizResult}
          onReturnToListing={handleReturnToListing}
        />
      );
    }
    
    return (
      <Card className="bg-card">
        <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="history">Quiz History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-4 p-4">
            <AdaptiveQuizListing 
              quizzes={quizzes}
              loading={loading}
              onStartQuiz={handleStartQuiz}
            />
          </TabsContent>
          
          <TabsContent value="history" className="p-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Quiz History</h3>
              <p className="text-muted-foreground mt-2">Your previous quiz attempts will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    );
  };

  return <div className="space-y-4">{renderContent()}</div>;
};
