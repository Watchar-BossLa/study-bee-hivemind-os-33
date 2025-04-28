
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LessonItem from './LessonItem';

interface CourseSectionProps {
  section: {
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      type: string;
      duration: string;
      content: string;
      completed: boolean;
    }>;
  };
  onSelectLesson: (lesson: any) => void;
}

const CourseSection = ({ section, onSelectLesson }: CourseSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {section.lessons.map(lesson => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            onSelect={onSelectLesson}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseSection;
