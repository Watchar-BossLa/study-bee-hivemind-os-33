import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GraphData } from './types/graph';
import GraphCanvas from './components/GraphCanvas';
import TopicFilters from './components/TopicFilters';

// Sample knowledge graph data
const sampleGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'Mitochondria', size: 20, color: '#6366f1' },
    { id: '2', label: 'ATP', size: 15, color: '#8b5cf6' },
    { id: '3', label: 'Cellular Respiration', size: 18, color: '#ec4899' },
    { id: '4', label: 'Krebs Cycle', size: 16, color: '#8b5cf6' },
    { id: '5', label: 'Electron Transport', size: 17, color: '#6366f1' },
    { id: '6', label: 'Glycolysis', size: 15, color: '#ec4899' },
    { id: '7', label: 'Cell Biology', size: 25, color: '#f43f5e' },
    { id: '8', label: 'DNA', size: 18, color: '#6366f1' },
    { id: '9', label: 'Evolution', size: 22, color: '#f43f5e' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '3', to: '4' },
    { from: '3', to: '5' },
    { from: '3', to: '6' },
    { from: '7', to: '1' },
    { from: '8', to: '1' },
    { from: '9', to: '1' },
    { from: '4', to: '2' },
    { from: '5', to: '2' },
  ]
};

const KnowledgeGraph = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  
  // Topics derived from the graph for the sidebar
  const topics = Array.from(new Set(sampleGraphData.nodes.map(node => node.label)));
  
  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center">
          <Network className="h-5 w-5 mr-2" />
          <span>Knowledge Graph</span>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search topics..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <TopicFilters 
          topics={topics}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
        />
        <GraphCanvas 
          graphData={sampleGraphData}
          activeTopic={activeTopic}
          searchTerm={searchTerm}
        />
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
