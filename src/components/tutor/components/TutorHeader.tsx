
import React from 'react';
import { Book, Brain, Network } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const TutorHeader = () => {
  const features = [
    {
      icon: Brain,
      title: "Knowledge Graph",
      description: "Contextual learning with connected concepts"
    },
    {
      icon: Network,
      title: "Graph-RAG",
      description: "Advanced retrieval for accurate responses"
    },
    {
      icon: Book,
      title: "Multi-LLM Routing",
      description: "Optimal model selection for each query"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-muted-foreground">
          Ask questions, get explanations, and explore related concepts using our Graph-RAG powered AI tutor.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorHeader;
