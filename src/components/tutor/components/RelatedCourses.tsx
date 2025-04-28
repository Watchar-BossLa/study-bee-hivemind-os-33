
import React from 'react';
import { Button } from '@/components/ui/button';
import { Course } from '../types/learning';

interface RelatedCoursesProps {
  courses: Course[];
  activeTopic: string | null;
  showCourses: boolean;
  onToggle: () => void;
}

const RelatedCourses: React.FC<RelatedCoursesProps> = ({ 
  courses, 
  activeTopic, 
  showCourses, 
  onToggle 
}) => {
  // Filter related courses based on active topic
  const filteredCourses = courses.filter(course => 
    !activeTopic || course.topic === activeTopic
  );

  return (
    <div className="mt-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-xs"
        onClick={onToggle}
      >
        {showCourses ? 'Hide Related Courses' : 'Show Related Courses'}
      </Button>
      
      {showCourses && filteredCourses.length > 0 && (
        <div className="mt-2 text-xs space-y-1 max-h-24 overflow-y-auto">
          <p className="font-medium">Related Courses:</p>
          {filteredCourses.map(course => (
            <div key={course.id} className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
              <span>{course.course}</span>
            </div>
          ))}
        </div>
      )}
      
      {showCourses && filteredCourses.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {activeTopic ? `No courses found related to ${activeTopic}` : 'Select a topic to see related courses'}
        </p>
      )}
    </div>
  );
};

export default RelatedCourses;
