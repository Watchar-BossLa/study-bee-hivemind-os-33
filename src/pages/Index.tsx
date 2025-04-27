
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AIFeatures from '@/components/AIFeatures';
import CourseCard from '@/components/CourseCard';
import { CourseProps } from '@/types/course';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';

// Featured courses data
const featuredCourses: CourseProps[] = [
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
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <AIFeatures />
        
        <FeaturesSection />
        
        {/* Featured Courses Section */}
        <section className="py-16 bg-bee-light">
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
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-bee-dark text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students using Study Bee to master new subjects faster than ever before.
            </p>
            <Button size="lg" className="bg-bee-amber hover:bg-bee-honey text-bee-dark">
              Get Started Free
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
