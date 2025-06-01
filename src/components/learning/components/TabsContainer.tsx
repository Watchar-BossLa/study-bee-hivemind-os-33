
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, BookOpen, Check } from 'lucide-react';
import CourseSection from './CourseSection';
import { CourseQuizzes } from '@/components/quiz/CourseQuizzes';

interface TabsContainerProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  sections: Array<{
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
  }>;
  onSelectLesson: (lesson: any) => void;
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  activeTab,
  onTabChange,
  sections,
  onSelectLesson,
  subjectId,
  moduleId,
  courseId
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="content">
          <Book className="h-4 w-4 mr-2" />
          Content
        </TabsTrigger>
        <TabsTrigger value="quizzes">
          <Check className="h-4 w-4 mr-2" />
          Quizzes
        </TabsTrigger>
        <TabsTrigger value="resources">
          <BookOpen className="h-4 w-4 mr-2" />
          Resources
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <div className="space-y-6">
          {sections.map((section) => (
            <CourseSection
              key={section.id}
              section={section}
              onSelectLesson={onSelectLesson}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="quizzes">
        <CourseQuizzes 
          subjectId={subjectId} 
          moduleId={moduleId} 
          courseId={courseId} 
        />
      </TabsContent>

      <TabsContent value="resources">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <p className="text-muted-foreground mb-4">
            Enhance your learning with these supplementary materials.
          </p>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">Course syllabus</a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">Reading list</a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">Glossary of terms</a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">Reference guide</a>
            </li>
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
};
