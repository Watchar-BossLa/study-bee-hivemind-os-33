
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AIFeatures from '@/components/AIFeatures';
import { CourseProps } from '@/types/course';
import QuickActionsSection from '@/components/home/QuickActionsSection';
import AnalyticsSection from '@/components/home/AnalyticsSection';
import LearningProgressSection from '@/components/home/LearningProgressSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import CTA from '@/components/home/CTA';

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
        <QuickActionsSection />
        <AnalyticsSection />
        <LearningProgressSection />
        <StatisticsSection />
        <AIFeatures />
        <FeaturesSection />
        <FeaturedCourses courses={featuredCourses} />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
