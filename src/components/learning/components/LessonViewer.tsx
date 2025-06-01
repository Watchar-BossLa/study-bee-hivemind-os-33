
import React from 'react';
import { Button } from '@/components/ui/button';
import { SecureContent } from './SecureContent';

interface LessonViewerProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    duration: string;
    content: string;
    completed: boolean;
  };
  onBack: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack }) => {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        ← Back to lessons
      </Button>
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <div className="px-2 py-1 bg-muted rounded">
            {lesson.type}
          </div>
          <div>{lesson.duration}</div>
        </div>
        <SecureContent content={lesson.content} />
      </div>
    </div>
  );
};
