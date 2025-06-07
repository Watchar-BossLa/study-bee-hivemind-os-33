
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, BookOpen, Brain, Clock, Zap } from 'lucide-react';

const AnalyticsTabsEnhanced: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-5 w-full md:w-auto">
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
      <TabsTrigger value="spaced-repetition" className="flex items-center gap-2">
        <Zap className="h-4 w-4" />
        <span className="hidden sm:inline">RL Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AnalyticsTabsEnhanced;
