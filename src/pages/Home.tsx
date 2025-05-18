
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AnalyticsSection from '@/components/home/AnalyticsSection';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import CTA from '@/components/home/CTA';
import type { CourseProps } from '@/types/course';

const Home = () => {
  // Mock courses data - in a real application, this would come from an API
  const featuredCourses: CourseProps[] = [
    {
      id: "1",
      title: "Introduction to Biology",
      category: "Science",
      level: "Beginner",
      description: "Learn the fundamentals of biology, from cells to ecosystems.",
      lessons: 24,
      students: 3452,
      duration: "12 hours"
    },
    {
      id: "2",
      title: "Advanced Mathematics",
      category: "Mathematics",
      level: "Advanced",
      description: "Master complex mathematical concepts including calculus and linear algebra.",
      lessons: 36,
      students: 1823,
      duration: "20 hours"
    },
    {
      id: "3",
      title: "World History",
      category: "History",
      level: "Intermediate",
      description: "Explore the rise and fall of ancient civilizations across the globe.",
      lessons: 18,
      students: 2741,
      duration: "15 hours"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <FeaturedCourses courses={featuredCourses} />
        <AnalyticsSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
