
import React from 'react';
import { Camera, Brain, Bot, Clock, Award, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: <Camera className="h-8 w-8" />,
    title: "OCR Flashcards",
    description: "Take a photo of your notes or textbook and instantly create flashcards."
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Graph-RAG Tutoring",
    description: "Get personalized AI tutoring that understands your learning style and progress."
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Spaced Repetition",
    description: "Our RL-tuned algorithm ensures you review content at optimal intervals."
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "AI Assistance",
    description: "Specialized AI agents for scanning, fixing, securing, and testing your learning materials."
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Credentials",
    description: "Track your learning achievements and share your progress with others."
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Learning Analytics",
    description: "Detailed insights into your study patterns and knowledge retention."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Supercharge Your Learning</h2>
          <p className="text-lg text-muted-foreground">
            Study Bee combines cutting-edge AI technology with proven learning methodologies to help you master any subject.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-bee-amber/10 flex items-center justify-center rounded-lg mb-4">
                {React.cloneElement(feature.icon, { className: "h-6 w-6 text-bee-amber" })}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
