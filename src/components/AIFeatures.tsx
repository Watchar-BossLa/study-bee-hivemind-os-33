
import React from 'react';
import { Book, Brain, Camera, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const AIFeatures: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Tutoring",
      description: "Get personalized help with Graph-RAG technology that combines knowledge graphs with retrieval-augmented generation.",
      icon: Brain,
      color: "bg-blue-500",
    },
    {
      title: "Camera OCR Flashcards",
      description: "Instantly convert your textbooks and notes into flashcards by taking a photo with our advanced OCR technology.",
      icon: Camera,
      color: "bg-green-500",
    },
    {
      title: "Adaptive Learning",
      description: "Our SM-2+ algorithm uses reinforcement learning to optimize your study intervals for maximum retention.",
      icon: Sparkles,
      color: "bg-purple-500",
    },
    {
      title: "Multi-LLM Smart Routing",
      description: "Questions are intelligently routed to specialized language models based on subject matter for the best possible answers.",
      icon: Book,
      color: "bg-amber-500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">AI-Powered Learning</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Study Bee uses cutting-edge artificial intelligence to revolutionize how you learn and retain knowledge
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
