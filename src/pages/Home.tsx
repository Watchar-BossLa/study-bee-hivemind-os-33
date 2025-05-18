
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AnalyticsSection from '@/components/home/AnalyticsSection';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import CTA from '@/components/home/CTA';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <FeaturedCourses />
        <AnalyticsSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
