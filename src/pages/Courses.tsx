import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseHeader from '@/components/courses/CourseHeader';
import CourseFilters from '@/components/courses/CourseFilters';
import CourseGrid from '@/components/courses/CourseGrid';
import { useCoursesFilter } from '@/hooks/useCoursesFilter';
import { CourseProps } from '@/components/CourseCard';

// Sample course data
const coursesData: CourseProps[] = [
  {
    id: "1",
    title: "Introduction to Biology",
    category: "Science",
    level: "Beginner",
    description: "Learn the fundamentals of biology, from cells to ecosystems, with interactive lessons and AI-powered quizzes.",
    lessons: 24,
    students: 3452,
    duration: "12 hours",
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    category: "Mathematics",
    level: "Advanced",
    description: "Master complex mathematical concepts including calculus, linear algebra, and differential equations.",
    lessons: 36,
    students: 1823,
    duration: "20 hours",
  },
  {
    id: "3",
    title: "World History: Ancient Civilizations",
    category: "History",
    level: "Intermediate",
    description: "Explore the rise and fall of ancient civilizations including Egypt, Greece, Rome, and China.",
    lessons: 18,
    students: 2741,
    duration: "15 hours",
  },
  {
    id: "4",
    title: "English Literature: Shakespeare",
    category: "Literature",
    level: "Intermediate",
    description: "Analyze the works of William Shakespeare including his sonnets, comedies, tragedies, and historical plays.",
    lessons: 20,
    students: 1548,
    duration: "18 hours",
  },
  {
    id: "5",
    title: "Introduction to Chemistry",
    category: "Science",
    level: "Beginner",
    description: "Discover the building blocks of matter, chemical reactions, and the periodic table in this foundational course.",
    lessons: 22,
    students: 2901,
    duration: "14 hours",
  },
  {
    id: "6",
    title: "Physics: Mechanics and Motion",
    category: "Science",
    level: "Intermediate",
    description: "Study the classical mechanics, forces, motion, and energy that form the foundation of physics.",
    lessons: 28,
    students: 2105,
    duration: "16 hours",
  },
  {
    id: "7",
    title: "Introduction to Psychology",
    category: "Social Sciences",
    level: "Beginner",
    description: "Explore the human mind, behavior, and psychological theories that explain how we think and act.",
    lessons: 16,
    students: 4238,
    duration: "10 hours",
  },
  {
    id: "8",
    title: "Modern World Geography",
    category: "Geography",
    level: "Beginner",
    description: "Learn about countries, cultures, and physical features that shape our modern world.",
    lessons: 14,
    students: 1876,
    duration: "8 hours",
  },
  {
    id: "9",
    title: "Computer Science Fundamentals",
    category: "Technology",
    level: "Beginner",
    description: "Master the core concepts of computer science including algorithms, data structures, and programming basics.",
    lessons: 30,
    students: 5621,
    duration: "22 hours",
  }
];

const categories = [...new Set(coursesData.map(course => course.category))];
const levels = ["Beginner", "Intermediate", "Advanced"];

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
