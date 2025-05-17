
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseHeader from '@/components/courses/CourseHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCoursesFilter } from '@/hooks/useCoursesFilter';
import { useCoursesBookmark } from '@/hooks/useCoursesBookmark';
import { coursesData, categories, levels } from '@/data/coursesData';
import { Toaster } from '@/components/ui/toaster';

const Courses = () => {
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { bookmarkedCourseIds } = useCoursesBookmark();
  
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    filteredCourses,
    clearFilters
  } = useCoursesFilter(coursesData);

  // Apply bookmark filter if needed
  const displayedCourses = showBookmarked
    ? filteredCourses.filter(course => bookmarkedCourseIds.includes(course.id))
    : filteredCourses;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CourseHeader bookmarkCount={bookmarkedCourseIds.length} />
        <CourseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          onClearFilters={clearFilters}
          categories={categories}
          levels={levels}
          showBookmarked={showBookmarked}
          onToggleBookmarked={setShowBookmarked}
        />
        <CourseGrid courses={displayedCourses} />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Courses;
