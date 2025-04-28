
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, BookOpen, Play, FileText, CheckCircle } from 'lucide-react';
import { subjectAreas } from '@/data/qualifications';
import { Button } from '@/components/ui/button';

interface LearningContentProps {
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

const LearningContent = ({ subjectId, moduleId, courseId }: LearningContentProps) => {
  const subject = subjectAreas.find(s => s.id === subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);
  const course = module?.courses.find(c => c.id === courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Course Overview',
          type: 'video',
          content: 'Welcome to this course! In this section, we will cover the fundamental concepts and principles.',
          duration: '10 mins',
          completed: false
        },
        {
          id: 'lesson-2',
          title: 'Key Concepts',
          type: 'reading',
          content: 'Let's explore the key concepts that form the foundation of this subject.',
          duration: '15 mins',
          completed: false
        }
      ]
    },
    {
      id: 'fundamentals',
      title: 'Core Fundamentals',
      lessons: [
        {
          id: 'lesson-3',
          title: 'Basic Principles',
          type: 'video',
          content: 'Understanding the basic principles is crucial for mastering this subject.',
          duration: '20 mins',
          completed: false
        },
        {
          id: 'lesson-4',
          title: 'Practice Exercise',
          type: 'exercise',
          content: 'Let's practice what we've learned with some hands-on exercises.',
          duration: '30 mins',
          completed: false
        }
      ]
    }
  ];

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Book className="h-5 w-5" />
          <span>{module?.name}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={0} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">0% Complete</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Course Content
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Study Materials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {sections.map(section => (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.lessons.map(lesson => (
                  <Button
                    key={lesson.id}
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto"
                    onClick={() => console.log('Opening lesson:', lesson.id)}
                  >
                    <div className="flex items-start gap-4">
                      {getLessonIcon(lesson.type)}
                      <div className="flex-1 text-left">
                        <h3 className="font-medium mb-1">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.content}</p>
                        <p className="text-sm text-primary mt-2">{lesson.duration}</p>
                      </div>
                      {lesson.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      )}
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Materials</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Course Syllabus
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Required Readings
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Practice Exercises
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningContent;
