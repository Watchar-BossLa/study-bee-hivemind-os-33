
import React from 'react';
import { Book, Brain, Network } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TutorHeader = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Tutor</h1>
        <p className="text-muted-foreground">
          Ask questions, get explanations, and explore related concepts using our Graph-RAG powered AI tutor.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Brain className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Knowledge Graph</h3>
              <p className="text-sm text-muted-foreground">Contextual learning with connected concepts</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Network className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Graph-RAG</h3>
              <p className="text-sm text-muted-foreground">Advanced retrieval for accurate responses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Book className="h-8 w-8 mr-4 text-primary" />
            <div>
              <h3 className="font-medium">Multi-LLM Routing</h3>
              <p className="text-sm text-muted-foreground">Optimal model selection for each query</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorHeader;
