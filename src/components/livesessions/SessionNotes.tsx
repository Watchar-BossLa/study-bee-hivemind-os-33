
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download, Share, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSessionNotes } from '@/hooks/useSessionNotes';
import { useToast } from "@/components/ui/use-toast";

interface SessionNotesProps {
  sessionId: string;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ sessionId }) => {
  const { 
    currentNote,
    setCurrentNote,
    isLoading,
    isSaving,
    autoSaveEnabled,
    setAutoSaveEnabled,
    saveNotes,
    shareNotes,
    unshareNotes,
    notes
  } = useSessionNotes(sessionId);
  
  const { toast } = useToast();
  
  // Find if user has a shared note already
  const hasSharedNote = notes.some(note => note.isShared);
  
  const handleDownloadNotes = () => {
    if (!currentNote.trim()) {
      toast({
        title: "Nothing to download",
        description: "Please write some notes before downloading",
        variant: "destructive",
      });
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([currentNote], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `study-session-notes-${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Notes downloaded",
      description: "Your notes have been downloaded successfully",
    });
  };

  const handleShareToggle = () => {
    if (notes.length > 0) {
      const userNote = notes[0]; // Get the first note for this example
      if (hasSharedNote) {
        unshareNotes(userNote.id);
      } else {
        shareNotes(userNote.id);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full border rounded-md p-4">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Loading notes...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Session Notes</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShareToggle}
          >
            {hasSharedNote ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Make Private
              </>
            ) : (
              <>
                <Share className="h-4 w-4 mr-1" />
                Share
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadNotes}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden">
        <Textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Take notes during the session..."
          className="min-h-full resize-none"
        />
      </div>
      
      <div className="p-2 border-t flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autosave"
            checked={autoSaveEnabled}
            onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
            className="rounded"
          />
          <label htmlFor="autosave">Auto-save every 30 seconds</label>
        </div>
        
        <Button 
          size="sm" 
          onClick={() => saveNotes()} 
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default SessionNotes;
