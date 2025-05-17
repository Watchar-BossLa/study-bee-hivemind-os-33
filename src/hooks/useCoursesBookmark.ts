
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BookmarkedCourse {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
}

export const useCoursesBookmark = () => {
  const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch bookmarked courses on load
  useEffect(() => {
    const fetchBookmarkedCourses = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('course_bookmarks')
          .select('course_id');
        
        if (error) {
          console.error('Error fetching bookmarks:', error);
          return;
        }
        
        const courseIds = data.map(bookmark => bookmark.course_id);
        setBookmarkedCourseIds(courseIds);
      } catch (error) {
        console.error('Error in bookmark fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkedCourses();

    // Listen for realtime changes
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'course_bookmarks' 
        },
        () => {
          fetchBookmarkedCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleBookmark = useCallback(async (courseId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark courses",
          variant: "destructive"
        });
        return false;
      }

      const isBookmarked = bookmarkedCourseIds.includes(courseId);
      
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('course_bookmarks')
          .delete()
          .eq('course_id', courseId);
        
        if (error) {
          console.error('Error removing bookmark:', error);
          toast({
            title: "Error",
            description: "Could not remove from saved courses",
            variant: "destructive"
          });
          return false;
        }
        
        // Optimistic update
        setBookmarkedCourseIds(prev => prev.filter(id => id !== courseId));
        
        toast({
          title: "Success",
          description: "Removed from saved courses",
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('course_bookmarks')
          .insert({
            course_id: courseId,
            user_id: session.session.user.id
          });
        
        if (error) {
          console.error('Error adding bookmark:', error);
          toast({
            title: "Error",
            description: "Could not save course",
            variant: "destructive"
          });
          return false;
        }
        
        // Optimistic update
        setBookmarkedCourseIds(prev => [...prev, courseId]);
        
        toast({
          title: "Success",
          description: "Added to saved courses",
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      return false;
    }
  }, [bookmarkedCourseIds, toast]);

  const isBookmarked = useCallback((courseId: string) => {
    return bookmarkedCourseIds.includes(courseId);
  }, [bookmarkedCourseIds]);

  return {
    bookmarkedCourseIds,
    isLoading,
    toggleBookmark,
    isBookmarked
  };
};
