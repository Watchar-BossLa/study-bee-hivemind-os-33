
import { useState, useCallback } from 'react';
import { CourseProps } from '@/types/course';

export const useCoursesFilter = (coursesData: CourseProps[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all-categories' || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || selectedLevel === 'all-levels' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLevel(null);
    setShowBookmarked(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    showBookmarked,
    setShowBookmarked,
    filteredCourses,
    clearFilters
  };
};
