
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningProgress = () => {
  // This would typically be fetched from your backend
  const courses = [
    { 
      id: 1, 
      name: "Introduction to Biology", 
      progress: 65, 
      lastActivity: "3 hours ago",
      nextLesson: "Cell Division and Reproduction",
      color: "from-green-400 to-emerald-600"
    },
    { 
      id: 2, 
      name: "Advanced Mathematics", 
      progress: 40, 
      lastActivity: "Yesterday",
      nextLesson: "Differential Equations",
      color: "from-blue-400 to-indigo-600"
    },
    { 
      id: 3, 
      name: "World History", 
      progress: 85, 
      lastActivity: "5 days ago",
      nextLesson: "Renaissance and Reformation",
      color: "from-amber-400 to-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Learning Progress</h2>
          <p className="text-muted-foreground">Track your course completion</p>
        </div>
        <Link to="/courses">
          <Button variant="outline" size="sm" className="hidden md:flex">View all courses</Button>
        </Link>
      </div>
      
      <div className="grid gap-5">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r w-full" style={{ width: `${course.progress}%` }} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <span className="text-sm text-muted-foreground">{course.lastActivity}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{course.progress}% Complete</span>
                    <span>Next: {course.nextLesson}</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm">View materials</Button>
                  <Button size="sm">
                    Continue learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
