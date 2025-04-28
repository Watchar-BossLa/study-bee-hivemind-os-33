
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
}

const CourseProgress = ({ progress }: CourseProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">{progress}% Complete</p>
      </CardContent>
    </Card>
  );
};

export default CourseProgress;
