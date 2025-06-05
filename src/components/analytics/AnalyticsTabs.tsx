
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, BookOpen, Brain, Clock } from 'lucide-react';

const AnalyticsTabs: React.FC = () => {
  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <ChartBar className="h-4 w-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      <TabsTrigger value="progress" className="flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Progress</span>
      </TabsTrigger>
      <TabsTrigger value="recommendations" className="flex items-center gap-2">
        <Brain className="h-4 w-4" />
        <span className="hidden sm:inline">Recommendations</span>
      </TabsTrigger>
      <TabsTrigger value="productivity" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Productivity</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AnalyticsTabs;
