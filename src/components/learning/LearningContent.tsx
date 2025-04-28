
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, BookOpen, Play } from 'lucide-react';
import { subjectAreas } from '@/data/qualifications';

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
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
                <Play className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Welcome to {course.name}</h3>
                  <p className="text-sm text-muted-foreground">Course overview and objectives</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
                <Book className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Course Materials</h3>
                  <p className="text-sm text-muted-foreground">Required readings and resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Module 1: Fundamentals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 hover:bg-accent rounded-lg cursor-pointer">
                <Play className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">Core Concepts</h3>
                  <p className="text-sm text-muted-foreground">Introduction to key principles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Materials</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Course textbook and readings</li>
                  <li>Practice exercises and worksheets</li>
                  <li>Supplementary resources</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningContent;
