
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Search, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GraphData } from './types/graph';
import GraphCanvas from './components/GraphCanvas';
import TopicFilters from './components/TopicFilters';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Enhanced knowledge graph data
const knowledgeGraphData: GraphData = {
  nodes: [
    { id: '1', label: 'Mitochondria', size: 20, color: '#6366f1' },
    { id: '2', label: 'ATP', size: 15, color: '#8b5cf6' },
    { id: '3', label: 'Cellular Respiration', size: 18, color: '#ec4899' },
    { id: '4', label: 'Krebs Cycle', size: 16, color: '#8b5cf6' },
    { id: '5', label: 'Electron Transport', size: 17, color: '#6366f1' },
    { id: '6', label: 'Glycolysis', size: 15, color: '#ec4899' },
    { id: '7', label: 'Cell Biology', size: 25, color: '#f43f5e' },
    { id: '8', label: 'DNA', size: 18, color: '#6366f1' },
    { id: '9', label: 'RNA', size: 16, color: '#8b5cf6' },
    { id: '10', label: 'Protein Synthesis', size: 19, color: '#ec4899' },
    { id: '11', label: 'Genetics', size: 22, color: '#f43f5e' },
    { id: '12', label: 'Evolution', size: 22, color: '#f43f5e' },
    { id: '13', label: 'Natural Selection', size: 18, color: '#8b5cf6' },
  ],
  edges: [
    { from: '1', to: '2', label: 'produces' },
    { from: '1', to: '3', label: 'performs' },
    { from: '3', to: '4', label: 'includes' },
    { from: '3', to: '5', label: 'includes' },
    { from: '3', to: '6', label: 'starts with' },
    { from: '7', to: '1', label: 'contains' },
    { from: '8', to: '9', label: 'transcribes to' },
    { from: '9', to: '10', label: 'enables' },
    { from: '11', to: '8', label: 'studies' },
    { from: '12', to: '13', label: 'mechanism' },
    { from: '4', to: '2', label: 'produces' },
    { from: '5', to: '2', label: 'produces' },
    { from: '11', to: '12', label: 'explains' },
  ]
};

// Related courses data
const relatedCourses = [
  { id: '1', topic: 'Mitochondria', course: 'Cell Biology 101' },
  { id: '2', topic: 'ATP', course: 'Biochemistry Fundamentals' },
  { id: '3', topic: 'Cellular Respiration', course: 'Energy in Biology' },
  { id: '4', topic: 'DNA', course: 'Introduction to Genetics' },
  { id: '5', topic: 'Krebs Cycle', course: 'Advanced Metabolism' },
  { id: '6', topic: 'Evolution', course: 'Evolutionary Biology' },
  { id: '7', topic: 'Natural Selection', course: "Darwin's Theory" },
];

// Learning paths
const learningPaths = [
  { 
    name: 'Cell Biology Track', 
    topics: ['Cell Biology', 'Mitochondria', 'ATP', 'Cellular Respiration']
  },
  { 
    name: 'Genetics Track', 
    topics: ['Genetics', 'DNA', 'RNA', 'Protein Synthesis']
  },
  { 
    name: 'Evolution Track', 
    topics: ['Evolution', 'Natural Selection', 'Genetics']
  },
];

const KnowledgeGraph = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showCourses, setShowCourses] = useState(false);
  const [recommendedPath, setRecommendedPath] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Topics derived from the graph
  const topics = Array.from(new Set(knowledgeGraphData.nodes.map(node => node.label)))
    .sort((a, b) => a.localeCompare(b));
  
  // Filter related courses based on active topic
  const filteredCourses = relatedCourses.filter(course => 
    !activeTopic || course.topic === activeTopic
  );

  // Recommend learning path when a topic is selected
  useEffect(() => {
    if (activeTopic) {
      // Find learning paths that include the active topic
      const relevantPaths = learningPaths.filter(path => 
        path.topics.includes(activeTopic)
      );
      
      if (relevantPaths.length > 0) {
        // Select the first relevant path
        setRecommendedPath(relevantPaths[0].name);
      } else {
        setRecommendedPath(null);
      }
    } else {
      setRecommendedPath(null);
    }
  }, [activeTopic]);

  // Show toast when a learning path is recommended
  useEffect(() => {
    if (recommendedPath) {
      toast({
        title: "Learning Path Suggested",
        description: `The "${recommendedPath}" learning path is recommended based on your selection.`,
      });
    }
  }, [recommendedPath, toast]);

  const handleShowRelatedCourses = () => {
    setShowCourses(!showCourses);
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b pb-3">
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
      <CardContent className="p-3 flex-grow flex flex-col">
        <TopicFilters 
          topics={topics.slice(0, 7)} // Show only first 7 topics to avoid overcrowding
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
        />
        
        {recommendedPath && (
          <div className="mb-3 bg-primary/10 p-2 rounded-md text-xs flex items-center">
            <Info className="h-3 w-3 mr-1 text-primary" />
            <span>Recommended path: <strong>{recommendedPath}</strong></span>
          </div>
        )}
        
        <GraphCanvas 
          graphData={knowledgeGraphData}
          activeTopic={activeTopic}
          searchTerm={searchTerm}
        />
        
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={handleShowRelatedCourses}
          >
            {showCourses ? 'Hide Related Courses' : 'Show Related Courses'}
          </Button>
          
          {showCourses && filteredCourses.length > 0 && (
            <div className="mt-2 text-xs space-y-1 max-h-24 overflow-y-auto">
              <p className="font-medium">Related Courses:</p>
              {filteredCourses.map(course => (
                <div key={course.id} className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-primary mr-1"></span>
                  <span>{course.course}</span>
                </div>
              ))}
            </div>
          )}
          
          {showCourses && filteredCourses.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {activeTopic ? `No courses found related to ${activeTopic}` : 'Select a topic to see related courses'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
