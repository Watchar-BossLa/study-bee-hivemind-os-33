
import { BaseService, ServiceResponse } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';

export interface CollaborativeNote {
  id: string;
  title: string;
  content: string;
  subject?: string;
  creator_id: string;
  group_id?: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
  creator_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface NoteCollaborator {
  id: string;
  note_id: string;
  user_id: string;
  permission: 'viewer' | 'editor' | 'admin';
  added_at: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface CreateNoteData {
  title: string;
  content?: string;
  subject?: string;
  group_id?: string;
  is_shared?: boolean;
}

export class CollaborativeNotesService extends BaseService {
  constructor() {
    super({ retryAttempts: 2, timeout: 10000 });
  }

  async createNote(data: CreateNoteData): Promise<ServiceResponse<CollaborativeNote>> {
    return this.executeWithRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const noteData = {
        ...data,
        creator_id: user.id,
        content: data.content || '',
        is_shared: data.is_shared ?? true
      };

      const { data: note, error } = await supabase
        .from('collaborative_notes')
        .insert(noteData)
        .select()
        .single();

      if (error) throw error;
      return note as CollaborativeNote;
    }, 'note-creation');
  }

  async getNotes(): Promise<ServiceResponse<CollaborativeNote[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('collaborative_notes')
        .select(`
          *,
          profiles!collaborative_notes_creator_id_fkey(full_name, avatar_url)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []) as CollaborativeNote[];
    }, 'notes-fetching');
  }

  async getNote(noteId: string): Promise<ServiceResponse<CollaborativeNote>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('collaborative_notes')
        .select(`
          *,
          profiles!collaborative_notes_creator_id_fkey(full_name, avatar_url)
        `)
        .eq('id', noteId)
        .single();

      if (error) throw error;
      return data as CollaborativeNote;
    }, 'note-fetching');
  }

  async updateNote(noteId: string, updates: Partial<CreateNoteData>): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('collaborative_notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', noteId);

      if (error) throw error;
    }, 'note-updating');
  }

  async deleteNote(noteId: string): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('collaborative_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    }, 'note-deletion');
  }

  async addCollaborator(noteId: string, userId: string, permission: 'viewer' | 'editor' = 'editor'): Promise<ServiceResponse<void>> {
    return this.executeWithRetry(async () => {
      const { error } = await supabase
        .from('collaborative_note_collaborators')
        .insert({
          note_id: noteId,
          user_id: userId,
          permission
        });

      if (error) throw error;
    }, 'collaborator-adding');
  }

  async getCollaborators(noteId: string): Promise<ServiceResponse<NoteCollaborator[]>> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('collaborative_note_collaborators')
        .select(`
          *,
          profiles!collaborative_note_collaborators_user_id_fkey(full_name, avatar_url)
        `)
        .eq('note_id', noteId);

      if (error) throw error;
      return (data || []) as NoteCollaborator[];
    }, 'collaborators-fetching');
  }

  subscribeToNoteChanges(noteId: string, callback: (note: CollaborativeNote) => void) {
    return supabase
      .channel(`note-${noteId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'collaborative_notes',
          filter: `id=eq.${noteId}`
        },
        (payload) => callback(payload.new as CollaborativeNote)
      )
      .subscribe();
  }
}

export const collaborativeNotesService = new CollaborativeNotesService();
