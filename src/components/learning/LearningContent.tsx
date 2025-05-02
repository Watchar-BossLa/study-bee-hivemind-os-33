
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SectionErrorBoundary } from '@/components/error/SectionErrorBoundary';
import CourseSection from './components/CourseSection';
import CourseProgress from './components/CourseProgress';
import { Book, BookOpen, Check } from 'lucide-react';
import { SubjectArea } from '@/types/qualifications';
import { subjectAreas } from '@/data/qualifications';
import { CourseQuizzes } from '@/components/quiz/CourseQuizzes';

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
  const navigate = useNavigate();

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
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <Button onClick={() => navigate('/qualifications')}>
          Back to Qualifications
        </Button>
      </div>
    );
  }

  const handleSelectLesson = (lesson: any) => {
    setCurrentLesson(lesson);
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                {currentLesson ? (
                  <div className="space-y-4">
                    <Button variant="ghost" onClick={() => setCurrentLesson(null)} className="mb-2">
                      ← Back to lessons
                    </Button>
                    <div className="border rounded-lg p-6">
                      <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <div className="px-2 py-1 bg-muted rounded">
                          {currentLesson.type}
                        </div>
                        <div>{currentLesson.duration}</div>
                      </div>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sections.map((section) => (
                      <CourseSection
                        key={section.id}
                        section={section}
                        onSelectLesson={handleSelectLesson}
                      />
                    ))}
                  </div>
                )}
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
