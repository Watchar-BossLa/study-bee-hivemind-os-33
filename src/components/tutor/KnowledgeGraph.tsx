
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import GraphCanvas from './components/GraphCanvas';
import TopicFilters from './components/TopicFilters';
import PathRecommendation from './components/PathRecommendation';
import RelatedCourses from './components/RelatedCourses';
import GraphHeader from './components/GraphHeader';
import useLearningPath from './hooks/useLearningPath';
import { knowledgeGraphData } from './data/graph-data';
import { relatedCourses, learningPaths } from './data/courses-data';

const KnowledgeGraph = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showCourses, setShowCourses] = useState(false);
  
  const { recommendedPath } = useLearningPath(activeTopic, learningPaths);
  
  // Topics derived from the graph
  const topics = Array.from(new Set(knowledgeGraphData.nodes.map(node => node.label)))
    .sort((a, b) => a.localeCompare(b));

  const handleShowRelatedCourses = () => {
    setShowCourses(!showCourses);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="border-b pb-3">
        <GraphHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </CardHeader>
      <CardContent className="p-3 flex-grow flex flex-col">
        <TopicFilters 
          topics={topics.slice(0, 7)} // Show only first 7 topics to avoid overcrowding
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
        />
        
        <PathRecommendation recommendedPath={recommendedPath} />
        
        <GraphCanvas 
          graphData={knowledgeGraphData}
          activeTopic={activeTopic}
          searchTerm={searchTerm}
        />
        
        <RelatedCourses 
          courses={relatedCourses}
          activeTopic={activeTopic}
          showCourses={showCourses}
          onToggle={handleShowRelatedCourses}
        />
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
