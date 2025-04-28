
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateScore } from '@/utils/arenaUtils';
import type { QuizQuestion, QuizAnswer, UpdatePlayerProgressParams } from '@/types/arena';

export const useArenaQuestion = (matchId: string | null) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (loading || !matchId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // First check if match has a subject focus
      const { data: matchData } = await supabase
        .from('arena_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .order('id');
      
      // If there's a subject focus, filter questions by that subject
      // Handle the case where subject_focus may not exist in the database
      if (matchData && 'subject_focus' in matchData && matchData.subject_focus) {
        query = query.eq('category', matchData.subject_focus);
      }
      
      // Get 5-10 random questions
      const questionCount = Math.floor(Math.random() * 6) + 5; // 5-10 questions
      const { data: questionData } = await query.limit(questionCount);

      if (questionData && questionData.length > 0) {
        const typedQuestions: QuizQuestion[] = questionData.map(q => ({
          id: q.id,
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: q.correct_answer as 'a' | 'b' | 'c' | 'd',
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
          category: q.category,
          // Use category as subject if subject doesn't exist
          subject: q.category 
        }));
        
        setQuestions(typedQuestions);
      } else {
        // Fallback to hardcoded questions if no questions found in database
        setQuestions([
          {
            id: '1',
            question: 'What is the powerhouse of the cell?',
            option_a: 'Mitochondria',
            option_b: 'Nucleus',
            option_c: 'Endoplasmic reticulum',
            option_d: 'Golgi apparatus',
            correct_answer: 'a',
            difficulty: 'easy',
            category: 'Biology',
            subject: 'science'
          },
          {
            id: '2',
            question: 'Which accounting principle states that expenses should be matched with related revenues?',
            option_a: 'Going concern principle',
            option_b: 'Matching principle',
            option_c: 'Materiality principle',
            option_d: 'Consistency principle',
            correct_answer: 'b',
            difficulty: 'medium',
            category: 'Accounting',
            subject: 'accounting'
          },
          {
            id: '3',
            question: 'Which teaching approach focuses on student interests and needs?',
            option_a: 'Teacher-centered approach',
            option_b: 'Curriculum-centered approach',
            option_c: 'Student-centered approach',
            option_d: 'Assessment-centered approach',
            correct_answer: 'c',
            difficulty: 'medium',
            category: 'Education',
            subject: 'education'
          },
          {
            id: '4',
            question: 'What does HTML stand for?',
            option_a: 'Hyperlinks and Text Markup Language',
            option_b: 'Home Tool Markup Language',
            option_c: 'Hyper Text Markup Language',
            option_d: 'Hyper Technical Meta Language',
            correct_answer: 'c',
            difficulty: 'easy',
            category: 'IT',
            subject: 'it'
          },
          {
            id: '5',
            question: 'What is the first step in the software development lifecycle?',
            option_a: 'Design',
            option_b: 'Testing',
            option_c: 'Deployment',
            option_d: 'Requirements Analysis',
            correct_answer: 'd',
            difficulty: 'medium',
            category: 'IT',
            subject: 'it'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
      
      // Fallback to at least one hardcoded question if there's an error
      setQuestions([
        {
          id: 'fallback',
          question: 'What is the main goal of education?',
          option_a: 'To pass exams',
          option_b: 'To gain knowledge and develop skills',
          option_c: 'To get a degree',
          option_d: 'To satisfy requirements',
          correct_answer: 'b',
          difficulty: 'medium',
          category: 'Education',
          subject: 'education'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (answer: QuizAnswer) => {
    if (!matchId || selectedAnswer || currentQuestionIndex >= questions.length) return;
    
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer !== 'none' && answer === currentQuestion.correct_answer;
    const responseTime = 15 - timeLeft; // Calculate response time
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Only add score if answer is correct and not a timeout
      const scoreToAdd = (isCorrect && answer !== 'none') 
        ? calculateScore(currentQuestion.difficulty, responseTime) 
        : 0;
      
      // Update player progress in the match using params matching the RPC function definition
      await supabase.rpc('update_player_progress', {
        match_id_param: matchId,
        user_id_param: user.id,
        score_to_add: scoreToAdd,
        is_correct: isCorrect,
        response_time_param: responseTime
      } as UpdatePlayerProgressParams);

      // Record the question usage without updating last_used_at or times_used
      // which may not exist in the database schema
      try {
        // Update the quiz_questions table with basic fields that definitely exist
        await supabase.from('quiz_questions')
          .update({
            updated_at: new Date().toISOString()
          })
          .eq('id', currentQuestion.id);
      } catch (error) {
        console.error('Error updating question usage stats:', error);
      }

      // Move to next question after a delay
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setTimeLeft(15);
        }
      }, 2000);

    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const resetQuestions = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setError(null);
  };

  return {
    questions,
    currentQuestionIndex,
    selectedAnswer,
    timeLeft,
    loading,
    error,
    setTimeLeft,
    fetchQuestions,
    answerQuestion,
    resetQuestions
  };
};
