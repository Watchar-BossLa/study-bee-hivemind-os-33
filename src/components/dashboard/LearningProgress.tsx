
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LearningProgress = () => {
  // This would typically be fetched from your backend
  const courses = [
    { id: 1, name: "Introduction to Biology", progress: 65 },
    { id: 2, name: "Advanced Mathematics", progress: 40 },
    { id: 3, name: "World History", progress: 85 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Learning Progress</h2>
        <p className="text-muted-foreground">Track your course completion</p>
      </div>
      
      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={course.progress} />
                <p className="text-sm text-muted-foreground">{course.progress}% Complete</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningProgress;
