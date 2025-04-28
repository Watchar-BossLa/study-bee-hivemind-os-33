
import React from 'react';
import { Button } from "@/components/ui/button";
import { Book, Play, FileText, CheckCircle } from 'lucide-react';

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    duration: string;
    content: string;
    completed: boolean;
  };
  onSelect: (lesson: any) => void;
}

const LessonItem = ({ lesson, onSelect }: LessonItemProps) => {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5 text-primary" />;
      case 'reading':
        return <FileText className="h-5 w-5 text-primary" />;
      case 'exercise':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      default:
        return <Book className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start p-4 h-auto"
      onClick={() => onSelect(lesson)}
    >
      <div className="flex items-start gap-4">
        {getLessonIcon(lesson.type)}
        <div className="flex-1 text-left">
          <h3 className="font-medium mb-1">{lesson.title}</h3>
          <p className="text-sm text-muted-foreground">
            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • {lesson.duration}
          </p>
        </div>
        {lesson.completed && (
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
        )}
      </div>
    </Button>
  );
};

export default LessonItem;
