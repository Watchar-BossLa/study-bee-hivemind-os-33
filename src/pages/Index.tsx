
import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AIFeatures from '@/components/AIFeatures';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Video, MessageSquare, BarChart3 } from 'lucide-react';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Study Bee - AI-Powered Learning Platform</title>
        <meta name="description" content="Master any subject with Study Bee's AI tutor, spaced repetition flashcards, and interactive quizzes. Join millions learning smarter, not harder." />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        
        {/* Quick Actions Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Start Learning Today</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Link to="/live-sessions">
                <Button 
                  variant="outline" 
                  className="w-full h-24 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Users className="h-6 w-6" />
                  <span>Live Sessions</span>
                </Button>
              </Link>
              
              <Link to="/flashcards">
                <Button 
                  variant="outline" 
                  className="w-full h-24 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Flashcards</span>
                </Button>
              </Link>
              
              <Link to="/arena">
                <Button 
                  variant="outline" 
                  className="w-full h-24 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Video className="h-6 w-6" />
                  <span>Arena</span>
                </Button>
              </Link>
              
              <Link to="/analytics">
                <Button 
                  variant="outline" 
                  className="w-full h-24 flex-col gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
        <AIFeatures />
        <Footer />
      </div>
    </>
  );
};

export default Index;
