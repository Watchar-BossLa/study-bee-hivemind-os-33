
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface DataExportRequest {
  id: string;
  user_id: string;
  request_type: 'export' | 'delete';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url: string | null;
  requested_at: string;
  completed_at: string | null;
  expires_at: string | null;
}

export class GDPRComplianceService {
  static async requestDataExport(userId: string): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: userId,
          request_type: 'export',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // In production, this would trigger a background job to compile user data
      logger.info(`Data export requested for user ${userId}`);
      
      return {
        success: true,
        requestId: data.id
      };
    } catch (error) {
      logger.error('Failed to request data export:', error);
      return {
        success: false,
        error: 'Failed to submit export request'
      };
    }
  }

  static async requestDataDeletion(userId: string): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .insert({
          user_id: userId,
          request_type: 'delete',
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Data deletion requested for user ${userId}`);
      
      return {
        success: true,
        requestId: data.id
      };
    } catch (error) {
      logger.error('Failed to request data deletion:', error);
      return {
        success: false,
        error: 'Failed to submit deletion request'
      };
    }
  }

  static async getExportRequests(userId: string): Promise<DataExportRequest[]> {
    try {
      const { data, error } = await supabase
        .from('data_export_requests')
        .select('*')
        .eq('user_id', userId)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData: DataExportRequest[] = (data || []).map(row => ({
        id: row.id,
        user_id: row.user_id,
        request_type: row.request_type as 'export' | 'delete',
        status: row.status as 'pending' | 'processing' | 'completed' | 'failed',
        file_url: row.file_url,
        requested_at: row.requested_at,
        completed_at: row.completed_at,
        expires_at: row.expires_at
      }));

      return transformedData;
    } catch (error) {
      logger.error('Failed to fetch export requests:', error);
      return [];
    }
  }

  static async exportUserData(userId: string): Promise<Record<string, any>> {
    try {
      // Fetch all user data across tables
      const [profile, flashcards, reviews, arenaStats, sessions] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('flashcards').select('*').eq('user_id', userId),
        supabase.from('flashcard_reviews').select('*').eq('user_id', userId),
        supabase.from('arena_stats').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('live_sessions').select('*').eq('host_id', userId)
      ]);

      return {
        profile: profile.data,
        flashcards: flashcards.data || [],
        flashcard_reviews: reviews.data || [],
        arena_stats: arenaStats.data,
        hosted_sessions: sessions.data || [],
        export_timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to export user data:', error);
      throw error;
    }
  }

  static async deleteUserData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Note: This is a simplified version. In production, you'd want to:
      // 1. Backup the data before deletion
      // 2. Handle foreign key constraints properly
      // 3. Use a transaction to ensure all-or-nothing deletion
      
      const tablesToDelete = [
        'flashcard_reviews',
        'flashcards', 
        'arena_stats',
        'session_participants',
        'session_messages',
        'live_sessions',
        'profiles'
      ] as const;

      for (const table of tablesToDelete) {
        const column = table === 'live_sessions' ? 'host_id' : 
                      table === 'profiles' ? 'id' : 'user_id';
        
        const { error } = await supabase
          .from(table)
          .delete()
          .eq(column, userId);
        
        if (error && !error.message.includes('No rows found')) {
          throw error;
        }
      }

      logger.info(`User data deleted for user ${userId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete user data:', error);
      return {
        success: false,
        error: 'Failed to delete user data'
      };
    }
  }
}
