
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard, { CourseProps } from '@/components/CourseCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Filter courses based on search and filters
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Courses Header */}
        <section className="bg-bee-light py-12">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">Course Catalog</h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our extensive library of courses across 400+ subjects from IGCSE through MBA level. 
              Use AI-powered learning to master any topic at your own pace.
            </p>
          </div>
        </section>
        
        {/* Search and Filters */}
        <section className="py-6 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory || ''} onValueChange={(val) => setSelectedCategory(val || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedLevel || ''} onValueChange={(val) => setSelectedLevel(val || null)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-levels">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(searchTerm || selectedCategory || selectedLevel) && (
                  <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Course Grid */}
        <section className="py-12">
          <div className="container">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> courses
              </p>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">Sort by:</span>
                <Select defaultValue="popular">
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
            
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
