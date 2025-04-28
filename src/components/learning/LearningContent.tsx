import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Check, Video, FileText, Clock, Users, Award } from 'lucide-react';
import { subjectAreas } from '@/data/qualifications';
import CourseSection from './components/CourseSection';
import LearningDialog from './LearningDialog';

interface LearningContentProps {
  subjectId?: string;
  moduleId?: string;
  courseId?: string;
}

const LearningContent = ({ subjectId, moduleId, courseId }: LearningContentProps) => {
  const params = useParams();
  const sid = subjectId || params.subjectId;
  const mid = moduleId || params.moduleId;
  const cid = courseId || params.courseId;
  
  const [activeTab, setActiveTab] = useState('content');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  
  const [courseData, setCourseData] = useState<{
    title: string;
    description: string;
    instructor: string;
    totalStudents: number;
    totalLessons: number;
    duration: string;
    sections: {
      id: string;
      title: string;
      lessons: {
        id: string;
        title: string;
        type: 'video' | 'reading' | 'quiz' | 'exercise';
        duration: string;
        content: string;
        completed: boolean;
      }[];
    }[];
  } | null>(null);
  
  useEffect(() => {
    if (sid && mid && cid) {
      const subject = subjectAreas.find(s => s.id === sid);
      const module = subject?.modules.find(m => m.id === mid);
      const course = module?.courses.find(c => c.id === cid);
      
      if (course) {
        const mockCourseData = {
          title: course.name,
          description: course.description || 'This course provides comprehensive coverage of key concepts and practices.',
          instructor: 'Dr. Jennifer Williams',
          totalStudents: 1240 + Math.floor(Math.random() * 500),
          totalLessons: 12 + Math.floor(Math.random() * 8),
          duration: '4-6 weeks',
          sections: [
            {
              id: 's1',
              title: 'Introduction',
              lessons: [
                {
                  id: 'l1',
                  title: `Welcome to ${course.name}`,
                  type: 'video' as const,
                  duration: '5:20',
                  content: 'Welcome to the course! In this video, we will go over what you will learn.',
                  completed: true
                },
                {
                  id: 'l2',
                  title: 'Course Overview',
                  type: 'reading' as const,
                  duration: '10 min',
                  content: 'This document provides an overview of the course syllabus and expectations.',
                  completed: true
                },
                {
                  id: 'l3',
                  title: 'Pre-Assessment Quiz',
                  type: 'quiz' as const,
                  duration: '15 min',
                  content: 'Test your initial knowledge with this quick assessment.',
                  completed: false
                }
              ]
            },
            {
              id: 's2',
              title: 'Core Concepts',
              lessons: [
                {
                  id: 'l4',
                  title: 'Fundamental Principles',
                  type: 'video' as const,
                  duration: '18:45',
                  content: 'This lecture covers the fundamental principles that form the foundation of this subject.',
                  completed: false
                },
                {
                  id: 'l5',
                  title: 'Key Terminology',
                  type: 'reading' as const,
                  duration: '20 min',
                  content: 'A glossary of important terms and concepts you will need throughout the course.',
                  completed: false
                },
                {
                  id: 'l6',
                  title: 'Application Exercise',
                  type: 'exercise' as const,
                  duration: '30 min',
                  content: 'Apply what you have learned in this practical exercise.',
                  completed: false
                },
                {
                  id: 'l7',
                  title: 'Concept Check',
                  type: 'quiz' as const,
                  duration: '10 min',
                  content: 'Check your understanding of the core concepts covered so far.',
                  completed: false
                }
              ]
            },
            {
              id: 's3',
              title: 'Advanced Topics',
              lessons: [
                {
                  id: 'l8',
                  title: 'Advanced Techniques',
                  type: 'video' as const,
                  duration: '22:15',
                  content: 'This lecture explores more advanced techniques and methodologies.',
                  completed: false
                },
                {
                  id: 'l9',
                  title: 'Case Studies',
                  type: 'reading' as const,
                  duration: '25 min',
                  content: 'Review these real-world case studies to deepen your understanding.',
                  completed: false
                },
                {
                  id: 'l10',
                  title: 'Practical Application',
                  type: 'exercise' as const,
                  duration: '45 min',
                  content: 'Apply advanced concepts in this comprehensive practical exercise.',
                  completed: false
                }
              ]
            },
            {
              id: 's4',
              title: 'Assessment',
              lessons: [
                {
                  id: 'l11',
                  title: 'Final Review',
                  type: 'reading' as const,
                  duration: '30 min',
                  content: 'A comprehensive review of all course material to prepare for the final assessment.',
                  completed: false
                },
                {
                  id: 'l12',
                  title: 'Final Assessment',
                  type: 'quiz' as const,
                  duration: '60 min',
                  content: 'Demonstrate your mastery of the course material with this final assessment.',
                  completed: false
                }
              ]
            }
          ]
        };
        
        setCourseData(mockCourseData);
        
        const totalLessons = mockCourseData.sections.reduce((sum, section) => sum + section.lessons.length, 0);
        const completedLessons = mockCourseData.sections.reduce((sum, section) => 
          sum + section.lessons.filter(lesson => lesson.completed).length, 0);
        
        setProgress(Math.round((completedLessons / totalLessons) * 100));
      }
    }
  }, [sid, mid, cid]);
  
  const handleSelectLesson = (lesson: any) => {
    setSelectedLesson(lesson);
  };
  
  const handleCloseDialog = () => {
    setSelectedLesson(null);
  };
  
  const handleCompleteLesson = () => {
    if (selectedLesson && courseData) {
      const updatedCourseData = {
        ...courseData,
        sections: courseData.sections.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => 
            lesson.id === selectedLesson.id ? { ...lesson, completed: true } : lesson
          )
        }))
      };
      
      setCourseData(updatedCourseData);
      
      const totalLessons = updatedCourseData.sections.reduce((sum, section) => sum + section.lessons.length, 0);
      const completedLessons = updatedCourseData.sections.reduce((sum, section) => 
        sum + section.lessons.filter(lesson => lesson.completed).length, 0);
      
      setProgress(Math.round((completedLessons / totalLessons) * 100));
      
      setSelectedLesson(null);
    }
  };
  
  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-muted rounded"></div>
          <div className="h-8 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{courseData.title}</h1>
        <p className="text-muted-foreground mt-2">{courseData.description}</p>
        
        <div className="mt-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>{courseData.totalStudents.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-muted-foreground" />
            <span>{courseData.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{courseData.duration}</span>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {progress === 100 && (
            <div className="mt-4 flex items-center gap-2 p-2 bg-primary/10 rounded-md">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Congratulations! You've completed this course.</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          {courseData.sections.map((section) => (
            <CourseSection
              key={section.id}
              section={section}
              onSelectLesson={handleSelectLesson}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 cursor-pointer">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Course Syllabus</p>
                    <p className="text-sm text-muted-foreground">PDF • 420 KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 cursor-pointer">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Supplementary Reading</p>
                    <p className="text-sm text-muted-foreground">PDF • 1.2 MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent/50 cursor-pointer">
                  <Video className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Course Introduction Video</p>
                    <p className="text-sm text-muted-foreground">MP4 • 52 MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>Course Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Join the discussion to ask questions and connect with other learners.</p>
                <Button>Start Discussion</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedLesson && (
        <LearningDialog
          lesson={selectedLesson}
          onClose={handleCloseDialog}
          onComplete={handleCompleteLesson}
        />
      )}
    </div>
  );
};

export default LearningContent;
