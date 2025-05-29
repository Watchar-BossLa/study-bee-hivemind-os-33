
import { useState, useEffect, useCallback } from 'react';
import { SessionNote } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionNotes(sessionId: string) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const { toast } = useToast();
  
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedNotes = data.map(note => ({
          id: note.id,
          sessionId: note.session_id,
          userId: note.user_id,
          content: note.content,
          isShared: note.is_shared,
          createdAt: note.created_at,
          updatedAt: note.updated_at
        }));
        
        setNotes(formattedNotes);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading notes",
        description: "Failed to load session notes"
      });
    }
  }, [sessionId, toast]);

  const saveNotes = useCallback(async () => {
    if (!currentNote.trim()) return;
    
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('session_notes')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          content: currentNote,
          is_shared: false
        });

      if (error) throw error;

      setCurrentNote('');
      await fetchNotes();
      
      toast({
        title: "Note saved",
        description: "Your note has been saved successfully"
      });
    } catch (err) {
      console.error("Error saving note:", err);
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: "Failed to save your note"
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentNote, sessionId, fetchNotes, toast]);

  const shareNotes = useCallback(async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('session_notes')
        .update({ is_shared: true })
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
      
      toast({
        title: "Note shared",
        description: "Your note is now visible to other participants"
      });
    } catch (err) {
      console.error("Error sharing note:", err);
      toast({
        variant: "destructive",
        title: "Error sharing note",
        description: "Failed to share your note"
      });
    }
  }, [fetchNotes, toast]);

  const unshareNotes = useCallback(async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('session_notes')
        .update({ is_shared: false })
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
      
      toast({
        title: "Note unshared",
        description: "Your note is now private"
      });
    } catch (err) {
      console.error("Error unsharing note:", err);
      toast({
        variant: "destructive",
        title: "Error unsharing note",
        description: "Failed to unshare your note"
      });
    }
  }, [fetchNotes, toast]);
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    currentNote,
    setCurrentNote,
    isLoading,
    isSaving,
    autoSaveEnabled,
    setAutoSaveEnabled,
    refreshNotes: fetchNotes,
    saveNotes,
    shareNotes,
    unshareNotes
  };
}
