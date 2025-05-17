
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { CourseProps } from '@/types/course';
import { useCoursesBookmark } from '@/hooks/useCoursesBookmark';
import { Toaster } from '@/components/ui/toaster';

interface FeaturedCoursesProps {
  courses: CourseProps[];
}

const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ courses }) => {
  const { toggleBookmark, bookmarkedCourses } = useCoursesBookmark();
  
  // Create a map of bookmarked courses for faster lookup
  const bookmarkedMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    bookmarkedCourses.forEach(id => {
      map[id] = true;
    });
    return map;
  }, [bookmarkedCourses]);
  
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <p className="text-muted-foreground mt-2">Start mastering these popular subjects today</p>
          </div>
          <Link to="/courses" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isBookmarked={bookmarkedMap[course.id]}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      </div>
      <Toaster />
    </section>
  );
};

export default FeaturedCourses;
