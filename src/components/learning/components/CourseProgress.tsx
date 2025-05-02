
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
  title?: string; // Make title optional
  completedLessons?: number; // Add these missing props
  totalLessons?: number;
}

const CourseProgress = ({ progress, title, completedLessons, totalLessons }: CourseProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Your Progress'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">{progress}% Complete</p>
        {completedLessons !== undefined && totalLessons !== undefined && (
          <p className="text-sm text-muted-foreground mt-1">
            {completedLessons} / {totalLessons} lessons completed
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
