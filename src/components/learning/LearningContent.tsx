import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, BookOpen, Play, FileText, CheckCircle, FileVideo } from 'lucide-react';
import { subjectAreas } from '@/data/qualifications';
import { Button } from '@/components/ui/button';
import LearningDialog from './LearningDialog';
import { supabase } from '@/integrations/supabase/client';

interface LearningContentProps {
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

const LearningContent = ({ subjectId, moduleId, courseId }: LearningContentProps) => {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
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
          content: `
            <h2>Welcome to ${course.name}</h2>
            <p>This comprehensive course will introduce you to the fundamental principles of accounting. Throughout this course, you will learn:</p>
            <ul>
              <li>Basic accounting concepts and terminology</li>
              <li>The accounting equation and its components</li>
              <li>Double-entry bookkeeping system</li>
              <li>Recording business transactions</li>
              <li>Preparing basic financial statements</li>
            </ul>
            <p>By the end of this course, you will have a solid foundation in accounting principles and be ready to advance to more complex topics.</p>
            <h3>Course Structure</h3>
            <p>The course is divided into several modules, each focusing on specific aspects of accounting. You will have access to:</p>
            <ul>
              <li>Video lectures</li>
              <li>Reading materials</li>
              <li>Practice exercises</li>
              <li>Quizzes and assessments</li>
            </ul>
          `,
          duration: '10 mins',
          completed: false
        },
        {
          id: 'lesson-2',
          title: 'Key Concepts',
          type: 'reading',
          content: `
            <h2>Essential Accounting Concepts</h2>
            <p>Before diving into the technical aspects of accounting, let's understand some fundamental concepts:</p>
            
            <h3>1. The Accounting Equation</h3>
            <p>Assets = Liabilities + Owner's Equity</p>
            <p>This equation is the foundation of all accounting principles. It shows that everything a company owns (assets) must be financed by either debt (liabilities) or owner investments (equity).</p>
            
            <h3>2. Double-Entry System</h3>
            <p>Every business transaction affects at least two accounts. For every debit entry, there must be a corresponding credit entry of equal value.</p>
            
            <h3>3. Types of Accounts</h3>
            <ul>
              <li><strong>Assets:</strong> Resources owned by the business</li>
              <li><strong>Liabilities:</strong> Debts and obligations</li>
              <li><strong>Owner's Equity:</strong> Owner's investment plus retained earnings</li>
              <li><strong>Revenue:</strong> Income from business activities</li>
              <li><strong>Expenses:</strong> Costs of doing business</li>
            </ul>
          `,
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
          content: `
            <h2>Fundamental Accounting Principles</h2>
            <p>In this lesson, we'll explore the core principles that guide accounting practices:</p>
            
            <h3>1. Revenue Recognition Principle</h3>
            <p>Revenue should be recorded when it is earned, regardless of when cash is received.</p>
            
            <h3>2. Matching Principle</h3>
            <p>Expenses should be recorded in the same period as the revenues they helped generate.</p>
            
            <h3>3. Cost Principle</h3>
            <p>Assets should be recorded at their original cost, not their current market value.</p>
            
            <h3>4. Going Concern Principle</h3>
            <p>Assumes that a business will continue operating indefinitely unless there's evidence to the contrary.</p>
            
            <h3>Practice Example</h3>
            <p>Consider a company that pays $12,000 for a one-year insurance policy in January. How should this be recorded throughout the year?</p>
          `,
          duration: '20 mins',
          completed: false
        },
        {
          id: 'lesson-4',
          title: 'Practice Exercise',
          type: 'exercise',
          content: `
            <h2>Practical Application Exercise</h2>
            
            <h3>Exercise 1: Classification of Accounts</h3>
            <p>Classify each of the following items as an Asset (A), Liability (L), or Owner's Equity (OE):</p>
            <ol>
              <li>Cash in bank</li>
              <li>Accounts payable</li>
              <li>Equipment</li>
              <li>Bank loan</li>
              <li>Owner's capital</li>
            </ol>
            
            <h3>Exercise 2: Recording Transactions</h3>
            <p>Record the following transactions using the double-entry system:</p>
            <ol>
              <li>Invested $10,000 cash to start a business</li>
              <li>Purchased office supplies for $500 on credit</li>
              <li>Received $2,000 from clients for services rendered</li>
            </ol>
            
            <h3>Solution Guidelines</h3>
            <p>After completing the exercises, check your work against these principles:</p>
            <ul>
              <li>Each transaction should have equal debits and credits</li>
              <li>Assets increase with debits, decrease with credits</li>
              <li>Liabilities and Owner's Equity increase with credits, decrease with debits</li>
            </ul>
          `,
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

  useEffect(() => {
    const startSession = async () => {
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          subject_id: subjectId,
          module_id: moduleId,
          course_id: courseId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting learning session:', error);
      }
    };

    startSession();

    return () => {
      const endSession = async () => {
        const { data: sessions } = await supabase
          .from('learning_sessions')
          .select('id, start_time')
          .eq('subject_id', subjectId)
          .eq('module_id', moduleId)
          .eq('course_id', courseId)
          .is('end_time', null)
          .limit(1)
          .single();

        if (sessions) {
          const endTime = new Date();
          const startTime = new Date(sessions.start_time);
          const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

          await supabase
            .from('learning_sessions')
            .update({
              end_time: endTime.toISOString(),
              duration_minutes: durationMinutes,
            })
            .eq('id', sessions.id);

          const today = new Date().toISOString().split('T')[0];
          await supabase.rpc('upsert_study_metrics', {
            p_date: today,
            p_duration: durationMinutes,
            p_sessions: 1,
          });
        }
      };

      endSession();
    };
  }, [subjectId, moduleId, courseId]);

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
                    onClick={() => setSelectedLesson(lesson)}
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
                    Study Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Practice Problems Set
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedLesson && (
        <LearningDialog
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          lesson={selectedLesson}
        />
      )}
    </div>
  );
};

export default LearningContent;
