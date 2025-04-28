import React, { useState } from 'react';
import { Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import LearningDialog from './LearningDialog';
import CourseProgress from './components/CourseProgress';
import CourseSection from './components/CourseSection';
import { useLearningSession } from '@/hooks/useLearningSession';
import { subjectAreas } from '@/data/qualifications';

interface LearningContentProps {
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

const LearningContent = ({ subjectId, moduleId, courseId }: LearningContentProps) => {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  // Use the custom hook for session tracking
  useLearningSession(subjectId, moduleId, courseId);

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
            <h2>Welcome to ${courseId}</h2>
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

  if (!courseId) {
    return <div>Course not found</div>;
  }

  const subject = subjectAreas.find(s => s.id === subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);
  const course = module?.courses.find(c => c.id === courseId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{course?.name}</h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Book className="h-5 w-5" />
          <span>{module?.name}</span>
        </div>
      </div>

      <CourseProgress progress={0} />

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {sections.map(section => (
            <CourseSection
              key={section.id}
              section={section}
              onSelectLesson={setSelectedLesson}
            />
          ))}
        </TabsContent>

        <TabsContent value="materials">
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              Course Syllabus
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              Study Guide
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              Practice Problems Set
            </Button>
          </div>
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
