
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, Users } from "lucide-react";
import { CourseProps } from '@/types/course';

interface CourseGridItemProps {
  course: CourseProps;
}

const CourseGridItem = ({ course }: CourseGridItemProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full bg-bee-light relative overflow-hidden">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bee-amber/30 to-bee-honey/20">
            <Book className="h-12 w-12 text-bee-amber opacity-60" />
          </div>
        )}
        <Badge className="absolute top-2 right-2">{course.level}</Badge>
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{course.category}</p>
            <h3 className="text-lg font-medium mt-1">{course.title}</h3>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
        
        {course.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground border-t pt-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {course.lessons && (
              <div className="flex items-center gap-1">
                <Book className="h-4 w-4" />
                <span>{course.lessons} lessons</span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            )}
          </div>
          
          {course.students && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students} students</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseGridItem;
