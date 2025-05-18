
import { useState, useEffect, useCallback } from 'react';
import { SessionNote } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionNotes(sessionId: string) {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const { toast } = useToast();
  
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsLoading(false);
        return;
      }
      
      const userId = userData.user.id;
      
      // Get user's own notes and shared notes
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .eq('session_id', sessionId)
        .or(`user_id.eq.${userId},is_shared.eq.true`)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedNotes = data.map(note => ({
          id: note.id,
          sessionId: note.session_id,
          userId: note.user_id,
          content: note.content,
          timestamp: note.updated_at,
          isShared: note.is_shared
        }));
        
        setNotes(formattedNotes);
        
        // Set current note to user's most recent note or empty string
        const userNotes = data.filter(note => note.user_id === userId);
        if (userNotes.length > 0) {
          setCurrentNote(userNotes[0].content);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setIsLoading(false);
    }
  }, [sessionId]);
  
  // Initial data fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`notes-${sessionId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'session_notes',
          filter: `session_id=eq.${sessionId}`
        }, 
        () => {
          fetchNotes();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, fetchNotes]);
  
  // Set up auto-save
  useEffect(() => {
    if (!autoSaveEnabled || currentNote === '') return;
    
    const autoSaveTimer = setTimeout(() => {
      saveNotes(false);
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [currentNote, autoSaveEnabled]);
  
  // Function to save notes
  const saveNotes = async (showToast: boolean = true) => {
    if (currentNote.trim() === '') return;
    
    try {
      setIsSaving(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to save notes"
        });
        setIsSaving(false);
        return;
      }
      
      const userId = userData.user.id;
      
      // Check if user already has notes for this session
      const { data: existingNotes } = await supabase
        .from('session_notes')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingNotes?.id) {
        // Update existing note
        await supabase
          .from('session_notes')
          .update({
            content: currentNote,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNotes.id);
      } else {
        // Create new note
        await supabase
          .from('session_notes')
          .insert({
            session_id: sessionId,
            user_id: userId,
            content: currentNote
          });
      }
      
      if (showToast) {
        toast({
          title: "Notes saved",
          description: "Your notes have been saved successfully"
        });
      }
      
      await fetchNotes();
      setIsSaving(false);
    } catch (err) {
      console.error("Error saving notes:", err);
      setIsSaving(false);
      
      if (showToast) {
        toast({
          variant: "destructive",
          title: "Failed to save notes",
          description: "Please try again"
        });
      }
    }
  };
  
  // Function to share notes
  const shareNotes = async () => {
    if (currentNote.trim() === '') {
      toast({
        variant: "destructive",
        title: "Nothing to share",
        description: "Please write some notes before sharing"
      });
      return;
    }
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to share notes"
        });
        return;
      }
      
      const userId = userData.user.id;
      
      // Save first to ensure content is up to date
      await saveNotes(false);
      
      // Get the note ID
      const { data: noteData } = await supabase
        .from('session_notes')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (!noteData?.id) throw new Error("Note not found");
      
      // Update to shared
      await supabase
        .from('session_notes')
        .update({
          is_shared: true
        })
        .eq('id', noteData.id);
      
      toast({
        title: "Notes shared",
        description: "Your notes have been shared with the group"
      });
      
      await fetchNotes();
    } catch (err) {
      console.error("Error sharing notes:", err);
      toast({
        variant: "destructive",
        title: "Failed to share notes",
        description: "Please try again"
      });
    }
  };
  
  // Function to unshare notes
  const unshareNotes = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      const userId = userData.user.id;
      
      // Get the note ID
      const { data: noteData } = await supabase
        .from('session_notes')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .single();
      
      if (!noteData?.id) return;
      
      // Update to unshared
      await supabase
        .from('session_notes')
        .update({
          is_shared: false
        })
        .eq('id', noteData.id);
      
      toast({
        title: "Notes unshared",
        description: "Your notes are now private"
      });
      
      await fetchNotes();
    } catch (err) {
      console.error("Error unsharing notes:", err);
      toast({
        variant: "destructive",
        title: "Failed to update notes",
        description: "Please try again"
      });
    }
  };
  
  return {
    notes,
    currentNote,
    setCurrentNote,
    isLoading,
    isSaving,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saveNotes,
    shareNotes,
    unshareNotes
  };
}
