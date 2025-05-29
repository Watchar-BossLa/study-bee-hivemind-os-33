
import { supabase } from '@/integrations/supabase/client';
import { FlashcardReview, StudyTimeData } from '@/types/flashcards';

export class FlashcardService {
  static async getRecentReviews(userId: string, limit: number = 100): Promise<FlashcardReview[]> {
    if (!userId) return [];

    // Get reviews with separate flashcard query to avoid relationship issues
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('flashcard_reviews')
      .select('id, flashcard_id, was_correct, response_time_ms, review_time')
      .eq('user_id', userId)
      .order('review_time', { ascending: false })
      .limit(limit);

    if (reviewsError) throw reviewsError;
    if (!reviewsData) return [];

    // Fetch flashcard details separately
    const flashcardIds = reviewsData.map(r => r.flashcard_id);
    const { data: flashcardsData, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('id, question, subject_area, difficulty')
      .in('id', flashcardIds);

    if (flashcardsError) throw flashcardsError;

    // Combine data
    const flashcardsMap = new Map(flashcardsData?.map(f => [f.id, f]) || []);
    
    return reviewsData.map(review => ({
      ...review,
      flashcard: flashcardsMap.get(review.flashcard_id) ? {
        question: flashcardsMap.get(review.flashcard_id)!.question,
        subject_area: flashcardsMap.get(review.flashcard_id)!.subject_area,
        difficulty: flashcardsMap.get(review.flashcard_id)!.difficulty,
      } : undefined,
    }));
  }

  static async getStatistics(userId: string) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from('flashcard_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async getActivityHeatmap(userId: string, days: number = 365) {
    if (!userId) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('flashcard_reviews')
      .select('review_time, was_correct')
      .eq('user_id', userId)
      .gte('review_time', startDate.toISOString())
      .order('review_time', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
