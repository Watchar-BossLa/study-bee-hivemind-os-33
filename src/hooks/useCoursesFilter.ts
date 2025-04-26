
import { useState } from 'react';
import { CourseProps } from '@/components/CourseCard';

export const useCoursesFilter = (coursesData: CourseProps[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all-categories' || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || selectedLevel === 'all-levels' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    filteredCourses,
    clearFilters
  };
};
