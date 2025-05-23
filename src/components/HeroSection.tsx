import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-bee-light to-white pt-20 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 honeycomb-pattern opacity-40"></div>
      <div className="container relative mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-2">
              Learn <span className="inline-block bg-gradient-to-r from-bee-amber to-bee-honey bg-clip-text text-transparent">Smarter</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Study Bee uses AI and spaced repetition to help you master any subject. Create flashcards instantly, get AI tutoring, and track your progress.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Button size="lg" className="group text-base">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Explore Courses
            </Button>
          </div>
          
          <div className="flex items-center gap-5 text-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((n) => (
                <div 
                  key={n} 
                  className="w-10 h-10 rounded-full bg-white/90 shadow-sm border-2 border-white flex items-center justify-center text-sm font-medium"
                >
                  {n}
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">10,000+</span> students already learning
            </p>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-bee-amber/20 rounded-full animate-pulse-subtle blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-bee-honey/30 rounded-full animate-float blur-xl"></div>
          
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 relative z-10">
            <div className="aspect-video bg-bee-light rounded-lg overflow-hidden flex items-center justify-center">
              <div className="w-3/4 glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-bee-amber rounded-full flex items-center justify-center">
                      <span className="font-bold text-white">B</span>
                    </div>
                    <span className="font-semibold">Biology Flashcards</span>
                  </div>
                  <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    87% Mastered
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <p className="text-center font-medium">What is the powerhouse of the cell?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="bg-white">Show Answer</Button>
                    <Button>Next Card</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI-Powered Flashcards</h3>
                <p className="text-sm text-muted-foreground">Create from text, photos, or let AI generate them</p>
              </div>
              <Button variant="outline" size="sm">Try Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
