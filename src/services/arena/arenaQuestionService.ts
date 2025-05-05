
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from '@/types/arena';
import { mockQuizQuestions } from '@/data/quizzes/mockQuizzes';

/**
 * Service responsible for fetching and managing arena questions
 */
export const arenaQuestionService = {
  /**
   * Fetches a list of quiz questions for the arena
   * @param category Optional category to filter questions
   * @param limit Maximum number of questions to return
   * @returns A promise that resolves to an array of quiz questions
   */
  async fetchQuestions(category?: string, limit: number = 5): Promise<QuizQuestion[]> {
    try {
      // Attempt to fetch from Supabase
      let query = supabase.from('quiz_questions').select('*');
      
      // Add category filter if provided
      if (category) {
        query = query.eq('category', category);
      }
      
      // Execute query with limit
      const { data, error } = await query.limit(limit);
      
      if (error) {
        console.error('Error fetching questions from database:', error);
        // Fall back to mock data if database fetch fails
        return this.getRandomMockQuestions(limit);
      }
      
      if (data && data.length > 0) {
        // Map database results to QuizQuestion type
        return data.map(item => ({
          id: item.id,
          question: item.question,
          option_a: item.option_a,
          option_b: item.option_b,
          option_c: item.option_c,
          option_d: item.option_d,
          correct_answer: item.correct_answer,
          difficulty: item.difficulty as 'easy' | 'medium' | 'hard',
          category: item.category
        }));
      }
      
      // Fall back to mock data if no results
      return this.getRandomMockQuestions(limit);
    } catch (error) {
      console.error('Unexpected error fetching questions:', error);
      return this.getRandomMockQuestions(limit);
    }
  },
  
  /**
   * Gets random questions from mock data
   * @param limit Maximum number of questions to return
   * @returns An array of random quiz questions from mock data
   */
  getRandomMockQuestions(limit: number = 5): QuizQuestion[] {
    // Shuffle questions for variety
    const shuffled = [...mockQuizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  },
  
  /**
   * Records a user's answer to a question
   * @param userId The user's ID
   * @param questionId The question ID
   * @param isCorrect Whether the answer was correct
   * @param responseTime Time taken to answer in seconds
   */
  async recordAnswer(
    userId: string, 
    questionId: string, 
    isCorrect: boolean, 
    responseTime: number
  ): Promise<void> {
    try {
      // Only attempt to record if we have a valid user ID
      if (!userId) return;
      
      // Use RPC call instead of direct table access
      // This avoids the need to access protected properties and handles the case
      // where the table might not be explicitly defined in the types
      const { error } = await supabase.rpc('record_user_answer', {
        user_id_param: userId,
        question_id_param: questionId,
        is_correct_param: isCorrect,
        response_time_param: responseTime,
        answered_at_param: new Date().toISOString()
      });
      
      if (error) {
        console.error('Error recording question answer:', error);
        
        // Fallback to direct table insert if RPC fails
        // Using the .from() API which doesn't require accessing protected properties
        const { error: insertError } = await supabase
          .from('user_question_answers')
          .insert({
            user_id: userId,
            question_id: questionId,
            is_correct: isCorrect,
            response_time: responseTime,
            answered_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error('Fallback insert also failed:', insertError);
        }
      }
    } catch (error) {
      console.error('Unexpected error recording answer:', error);
    }
  }
};
