
import React from 'react';
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
  const {
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
  } = useCoursesFilter(coursesData);
  
  const {
    bookmarkedCourses,
    toggleBookmark,
    isBookmarked,
    bookmarkCount,
  } = useCoursesBookmark();
  
  // Create a map of bookmarked courses for faster lookup
  const bookmarkedMap = React.useMemo(() => {
    const map: Record<string, boolean> = {};
    bookmarkedCourses.forEach(id => {
      map[id] = true;
    });
    return map;
  }, [bookmarkedCourses]);
  
  // Filter courses by bookmark status if needed
  const displayedCourses = React.useMemo(() => {
    if (showBookmarked) {
      return filteredCourses.filter(course => bookmarkedMap[course.id]);
    }
    return filteredCourses;
  }, [filteredCourses, showBookmarked, bookmarkedMap]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CourseHeader 
          isBookmarkMode={showBookmarked} 
          bookmarkCount={bookmarkCount} 
        />
        <CourseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          showBookmarked={showBookmarked}
          onToggleBookmarked={() => setShowBookmarked(!showBookmarked)}
          onClearFilters={clearFilters}
          categories={categories}
          levels={levels}
          bookmarkCount={bookmarkCount}
        />
        <CourseGrid 
          courses={displayedCourses} 
          isBookmarkedMap={bookmarkedMap}
          onToggleBookmark={toggleBookmark}
        />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Courses;
