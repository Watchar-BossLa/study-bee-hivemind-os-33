
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileVideo } from 'lucide-react';

interface LearningDialogProps {
  lesson: {
    title: string;
    content: string;
    type: string;
    duration: string;
  };
  onClose: () => void;
  onComplete: () => void;
}

const LearningDialog = ({ lesson, onClose, onComplete }: LearningDialogProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 pb-6">
            {lesson.type === 'video' && (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <FileVideo className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="prose prose-blue max-w-none">
              <p>{lesson.content}</p>
              <p className="text-muted-foreground mt-4">
                Estimated time to complete: {lesson.duration}
              </p>
              
              <div className="mt-8 p-4 border rounded-md bg-accent/20">
                <h3>Learning Resources</h3>
                <ul>
                  <li>Online documentation</li>
                  <li>Practice exercises</li>
                  <li>Reference materials</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={onComplete}>Mark as Complete</Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LearningDialog;
