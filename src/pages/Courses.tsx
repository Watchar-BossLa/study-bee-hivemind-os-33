
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseHeader from '@/components/courses/CourseHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCoursesFilter } from '@/hooks/useCoursesFilter';
import { coursesData, categories, levels } from '@/data/coursesData';

const Courses = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <CourseHeader />
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
        />
        <CourseGrid courses={filteredCourses} />
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
