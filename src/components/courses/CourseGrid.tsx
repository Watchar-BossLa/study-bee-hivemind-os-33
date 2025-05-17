
import React, { useState, useEffect } from 'react';
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseCard from '@/components/CourseCard';
import { CourseProps } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

interface CourseGridProps {
  courses: CourseProps[];
  isBookmarkedMap?: Record<string, boolean>;
  onToggleBookmark?: (course: CourseProps) => Promise<boolean>;
}

const CourseGrid: React.FC<CourseGridProps> = ({ 
  courses: initialCourses,
  isBookmarkedMap = {},
  onToggleBookmark 
}) => {
  const [sortOption, setSortOption] = useState<string>('popular');
  const [courses, setCourses] = useState<CourseProps[]>(initialCourses);
  const { toast } = useToast();

  // Sort courses when sort option changes
  useEffect(() => {
    const sortedCourses = [...initialCourses];
    
    switch (sortOption) {
      case 'popular':
        sortedCourses.sort((a, b) => (b.students || 0) - (a.students || 0));
        break;
      case 'newest':
        // For demo purposes - in real app would use createdAt field
        sortedCourses.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'a-z':
        sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setCourses(sortedCourses);
    
    toast({
      title: "Courses sorted",
      description: `Sorted by ${sortOption === 'a-z' ? 'alphabetical order' : sortOption}`,
      variant: "default",
    });
  }, [sortOption, initialCourses, toast]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{courses.length}</span> courses
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Sort by:</span>
            <Select 
              value={sortOption} 
              onValueChange={setSortOption}
            >
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                isBookmarked={isBookmarkedMap[course.id]}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            <Button variant="outline" className="mt-4" onClick={() => setCourses(initialCourses)}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseGrid;
