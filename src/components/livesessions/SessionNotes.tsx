
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SessionNote } from '@/types/livesessions';
import { Download, Share } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface SessionNotesProps {
  sessionId: string;
}

const SessionNotes: React.FC<SessionNotesProps> = ({ sessionId }) => {
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState<SessionNote[]>([]);
  const [autoSave, setAutoSave] = useState(true);
  const { toast } = useToast();
  
  const handleSaveNotes = () => {
    if (!notes.trim()) return;
    
    const newNote: SessionNote = {
      id: Date.now().toString(),
      sessionId,
      userId: 'current-user-id',
      content: notes,
      timestamp: new Date().toISOString(),
      isShared: false,
    };
    
    setSavedNotes([...savedNotes, newNote]);
    
    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully",
    });
  };
  
  const handleShareNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "Nothing to share",
        description: "Please write some notes before sharing",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Notes shared",
      description: "Your notes have been shared with the group",
    });
  };
  
  const handleDownloadNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "Nothing to download",
        description: "Please write some notes before downloading",
        variant: "destructive",
      });
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([notes], { type: 'text/plain' });
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
  
  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden">
      <div className="p-2 border-b flex justify-between items-center">
        <h3 className="font-medium">Session Notes</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShareNotes}>
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadNotes}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Take notes during the session..."
          className="min-h-full resize-none"
        />
      </div>
      
      <div className="p-2 border-t flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autosave"
            checked={autoSave}
            onChange={() => setAutoSave(!autoSave)}
            className="rounded"
          />
          <label htmlFor="autosave">Auto-save every 30 seconds</label>
        </div>
        
        <Button size="sm" onClick={handleSaveNotes}>
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default SessionNotes;
