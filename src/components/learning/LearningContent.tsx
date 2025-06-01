
import React, { useState, useEffect } from 'react';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';
import CourseProgress from './components/CourseProgress';
import { SubjectArea } from '@/types/qualifications';
import { subjectAreas } from '@/data/qualifications';
import { LessonViewer } from './components/LessonViewer';
import { TabsContainer } from './components/TabsContainer';
import { CourseNotFound } from './components/CourseNotFound';

interface LearningContentProps {
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

const mockSections = [
  {
    id: "s1",
    title: "Introduction to the Course",
    lessons: [
      {
        id: "l1",
        title: "Course Overview",
        type: "video",
        duration: "10:25",
        content: "<p>Welcome to the course! This video provides an overview of what you'll learn.</p>",
        completed: true
      },
      {
        id: "l2",
        title: "Learning Objectives",
        type: "reading",
        duration: "5 min",
        content: "<p>By the end of this course, you'll be able to understand and apply the core concepts...</p>",
        completed: true
      }
    ]
  },
  {
    id: "s2",
    title: "Key Concepts",
    lessons: [
      {
        id: "l3",
        title: "Fundamental Principles",
        type: "video",
        duration: "15:30",
        content: "<p>In this lesson, we'll cover the fundamental principles that form the foundation of this subject.</p>",
        completed: false
      },
      {
        id: "l4",
        title: "Applied Examples",
        type: "interactive",
        duration: "20 min",
        content: "<p>This interactive lesson will walk you through practical examples of applying these concepts.</p>",
        completed: false
      },
      {
        id: "l5",
        title: "Common Misconceptions",
        type: "reading",
        duration: "8 min",
        content: "<p>Let's address some common misconceptions about these concepts.</p>",
        completed: false
      }
    ]
  }
];

const LearningContent: React.FC<LearningContentProps> = ({ subjectId, moduleId, courseId }) => {
  const [activeTab, setActiveTab] = useState<string>("content");
  const [currentSubject, setCurrentSubject] = useState<SubjectArea | undefined>();
  const [currentModule, setCurrentModule] = useState<any>();
  const [currentCourse, setCurrentCourse] = useState<any>();
  const [sections] = useState(mockSections);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    if (subjectId) {
      const subject = subjectAreas.find(s => s.id === subjectId);
      setCurrentSubject(subject);

      if (subject && moduleId) {
        const module = subject.modules.find(m => m.id === moduleId);
        setCurrentModule(module);

        if (module && courseId) {
          const course = module.courses.find(c => c.id === courseId);
          setCurrentCourse(course);
        }
      }
    }
  }, [subjectId, moduleId, courseId]);

  if (!currentSubject || !currentModule || !currentCourse) {
    return <CourseNotFound />;
  }

  const handleSelectLesson = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  const handleBackToLessons = () => {
    setCurrentLesson(null);
  };

  const completedLessons = sections.flatMap(s => s.lessons).filter(l => l.completed).length;
  const totalLessons = sections.flatMap(s => s.lessons).length;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

  return (
    <SectionErrorBoundary sectionName="LearningContent">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{currentCourse.name}</h1>
          <div className="text-muted-foreground mb-6">
            {currentSubject.name} &gt; {currentModule.name}
          </div>

          {currentLesson ? (
            <LessonViewer 
              lesson={currentLesson} 
              onBack={handleBackToLessons} 
            />
          ) : (
            <TabsContainer
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sections={sections}
              onSelectLesson={handleSelectLesson}
              subjectId={subjectId}
              moduleId={moduleId}
              courseId={courseId}
            />
          )}
        </div>

        <div>
          <CourseProgress
            title={currentCourse.name}
            progress={progressPercentage}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
          />
        </div>
      </div>
    </SectionErrorBoundary>
  );
};

export default LearningContent;
