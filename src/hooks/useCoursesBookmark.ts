
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CourseProps } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

export const useCoursesBookmark = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch bookmarked courses on component mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('course_bookmarks')
        .select('course_id');
        
      if (error) {
        console.error('Error fetching bookmarks:', error);
        toast({
          title: 'Failed to fetch bookmarks',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } else {
        setBookmarkedCourses(data.map(item => item.course_id));
      }
      
      setIsLoading(false);
    };
    
    fetchBookmarks();
  }, [toast]);
  
  // Toggle bookmark status for a course
  const toggleBookmark = useCallback(async (course: CourseProps) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to bookmark courses',
        variant: 'destructive',
      });
      return false;
    }
    
    const isCurrentlyBookmarked = bookmarkedCourses.includes(course.id);
    
    if (isCurrentlyBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('course_bookmarks')
        .delete()
        .eq('course_id', course.id);
        
      if (error) {
        console.error('Error removing bookmark:', error);
        toast({
          title: 'Failed to remove bookmark',
          description: 'Please try again later',
          variant: 'destructive',
        });
        return false;
      }
      
      setBookmarkedCourses(prev => prev.filter(id => id !== course.id));
      toast({
        title: 'Bookmark removed',
        description: `${course.title} has been removed from your bookmarks`,
      });
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('course_bookmarks')
        .insert({ course_id: course.id });
        
      if (error) {
        console.error('Error adding bookmark:', error);
        toast({
          title: 'Failed to add bookmark',
          description: 'Please try again later',
          variant: 'destructive',
        });
        return false;
      }
      
      setBookmarkedCourses(prev => [...prev, course.id]);
      toast({
        title: 'Bookmark added',
        description: `${course.title} has been added to your bookmarks`,
      });
    }
    
    return true;
  }, [bookmarkedCourses, toast]);
  
  // Check if a course is bookmarked
  const isBookmarked = useCallback((courseId: string) => {
    return bookmarkedCourses.includes(courseId);
  }, [bookmarkedCourses]);

  return {
    bookmarkedCourses,
    isLoading,
    toggleBookmark,
    isBookmarked,
    bookmarkCount: bookmarkedCourses.length,
  };
};
