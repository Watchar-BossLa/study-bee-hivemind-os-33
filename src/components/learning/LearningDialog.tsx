
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileVideo } from 'lucide-react';

interface LearningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    title: string;
    content: string;
    type: string;
    duration: string;
  };
}

const LearningDialog = ({ isOpen, onClose, lesson }: LearningDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              {lesson.content}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LearningDialog;
