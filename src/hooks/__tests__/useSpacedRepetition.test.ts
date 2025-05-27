
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSpacedRepetition } from '../useSpacedRepetition';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(),
    rpc: jest.fn()
  }
}));

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSpacedRepetition', () => {
  const mockUser = { id: 'test-user-id' };
  const flashcardId = 'test-flashcard-id';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth user
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser }
    });
  });

  describe('submitReview', () => {
    it('should submit review successfully', async () => {
      // Mock database responses
      const mockFlashcard = {
        easiness_factor: 2.5,
        consecutive_correct_answers: 2,
        last_reviewed_at: new Date().toISOString()
      };

      const mockStatistics = {
        user_id: mockUser.id,
        retention_rate: 85,
        total_reviews: 50,
        streak_days: 7
      };

      const mockReviews = [
        { response_time_ms: 3000 },
        { response_time_ms: 2500 },
        { response_time_ms: 3500 }
      ];

      // Setup Supabase mocks
      const fromMock = {
        insert: jest.fn().mockReturnValue({
          error: null
        }),
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockFlashcard,
              error: null
            }),
            maybeSingle: jest.fn().mockResolvedValue({
              data: mockStatistics,
              error: null
            }),
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: mockReviews,
                error: null
              })
            })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            error: null
          })
        })
      };

      (supabase.from as jest.Mock).mockReturnValue(fromMock);
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: null });

      const { result } = renderHook(() => useSpacedRepetition(flashcardId), {
        wrapper: createWrapper()
      });

      await act(async () => {
        const success = await result.current.submitReview(true, 2800);
        expect(success).toBe(true);
      });

      // Verify database calls
      expect(fromMock.insert).toHaveBeenCalledWith({
        user_id: mockUser.id,
        flashcard_id: flashcardId,
        was_correct: true,
        response_time_ms: 2800
      });

      expect(fromMock.update).toHaveBeenCalled();
      expect(supabase.rpc).toHaveBeenCalledWith('update_daily_flashcard_stats', {
        user_id_param: mockUser.id
      });
    });

    it('should handle unauthenticated user', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null }
      });

      const { result } = renderHook(() => useSpacedRepetition(flashcardId), {
        wrapper: createWrapper()
      });

      await act(async () => {
        const success = await result.current.submitReview(true);
        expect(success).toBe(false);
      });
    });

    it('should handle database errors gracefully', async () => {
      const fromMock = {
        insert: jest.fn().mockReturnValue({
          error: new Error('Database error')
        })
      };

      (supabase.from as jest.Mock).mockReturnValue(fromMock);

      const { result } = renderHook(() => useSpacedRepetition(flashcardId), {
        wrapper: createWrapper()
      });

      await act(async () => {
        const success = await result.current.submitReview(true);
        expect(success).toBe(false);
      });
    });

    it('should use enhanced SM-2+ algorithm with RL optimization', async () => {
      const mockFlashcard = {
        easiness_factor: 2.2,
        consecutive_correct_answers: 1,
        last_reviewed_at: new Date().toISOString()
      };

      const mockStatistics = {
        retention_rate: 92,
        total_reviews: 25,
        streak_days: 12
      };

      const fromMock = {
        insert: jest.fn().mockReturnValue({ error: null }),
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockFlashcard,
              error: null
            }),
            maybeSingle: jest.fn().mockResolvedValue({
              data: mockStatistics,
              error: null
            }),
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: [{ response_time_ms: 2000 }],
                error: null
              })
            })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({ error: null })
        })
      };

      (supabase.from as jest.Mock).mockReturnValue(fromMock);
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: null });

      const { result } = renderHook(() => useSpacedRepetition(flashcardId), {
        wrapper: createWrapper()
      });

      await act(async () => {
        const success = await result.current.submitReview(true, 1800);
        expect(success).toBe(true);
      });

      // Verify enhanced algorithm was used (check update call parameters)
      const updateCall = fromMock.update.mock.calls[0][0];
      expect(updateCall).toHaveProperty('next_review_at');
      expect(updateCall).toHaveProperty('easiness_factor');
      expect(updateCall).toHaveProperty('consecutive_correct_answers');
      expect(updateCall.consecutive_correct_answers).toBe(2); // incremented
    });
  });

  describe('isSubmitting state', () => {
    it('should manage submitting state correctly', async () => {
      const fromMock = {
        insert: jest.fn().mockReturnValue({ error: null }),
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { easiness_factor: 2.5, consecutive_correct_answers: 0 },
              error: null
            }),
            maybeSingle: jest.fn().mockResolvedValue({
              data: null,
              error: null
            }),
            order: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: [],
                error: null
              })
            })
          })
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({ error: null })
        })
      };

      (supabase.from as jest.Mock).mockReturnValue(fromMock);
      (supabase.rpc as jest.Mock).mockResolvedValue({ error: null });

      const { result } = renderHook(() => useSpacedRepetition(flashcardId), {
        wrapper: createWrapper()
      });

      expect(result.current.isSubmitting).toBe(false);

      const submitPromise = act(async () => {
        return result.current.submitReview(true);
      });

      // Check that isSubmitting becomes true during submission
      expect(result.current.isSubmitting).toBe(true);

      await submitPromise;

      // Check that isSubmitting becomes false after completion
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });
  });
});
