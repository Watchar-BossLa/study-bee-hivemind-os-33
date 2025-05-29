
import { useState, useCallback, useEffect } from 'react';
import { collaborativeNotesService, CollaborativeNote, CreateNoteData } from '@/services/CollaborativeNotesService';
import { ErrorHandler } from '@/utils/errorHandling';
import { toast } from 'sonner';

export const useCollaborativeNotes = () => {
  const [notes, setNotes] = useState<CollaborativeNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await collaborativeNotesService.getNotes();
      if (result.success && result.data) {
        setNotes(result.data);
      }
    } catch (error) {
      ErrorHandler.handle(error, 'notes-fetching');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: CreateNoteData) => {
    try {
      const result = await collaborativeNotesService.createNote(data);
      if (result.success && result.data) {
        setNotes(prev => [result.data!, ...prev]);
        toast.success('Note created successfully!');
        return result.data;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'note-creation');
      toast.error('Failed to create note');
    }
    return null;
  }, []);

  const updateNote = useCallback(async (noteId: string, updates: Partial<CreateNoteData>) => {
    try {
      const result = await collaborativeNotesService.updateNote(noteId, updates);
      if (result.success) {
        setNotes(prev => 
          prev.map(note => 
            note.id === noteId ? { ...note, ...updates } : note
          )
        );
        return true;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'note-updating');
    }
    return false;
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    try {
      const result = await collaborativeNotesService.deleteNote(noteId);
      if (result.success) {
        setNotes(prev => prev.filter(note => note.id !== noteId));
        toast.success('Note deleted successfully');
        return true;
      }
    } catch (error) {
      ErrorHandler.handle(error, 'note-deletion');
      toast.error('Failed to delete note');
    }
    return false;
  }, []);

  return {
    notes,
    isLoading,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  };
};

export const useNoteRealtime = (noteId: string) => {
  const [note, setNote] = useState<CollaborativeNote | null>(null);

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      try {
        const result = await collaborativeNotesService.getNote(noteId);
        if (result.success && result.data) {
          setNote(result.data);
        }
      } catch (error) {
        ErrorHandler.handle(error, 'note-fetching');
      }
    };

    fetchNote();

    const channel = collaborativeNotesService.subscribeToNoteChanges(noteId, (updatedNote) => {
      setNote(updatedNote);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [noteId]);

  return { note, setNote };
};
