
import { useState, useEffect, useCallback } from 'react';
import { SessionNote } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionNotes(sessionId: string) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    refreshNotes: fetchNotes
  };
}
