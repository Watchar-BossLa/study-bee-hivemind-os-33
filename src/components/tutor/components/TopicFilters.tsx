
import React from 'react';
import { GraphNode } from '../types/graph';

interface TopicFiltersProps {
  topics: string[];
  activeTopic: string | null;
  setActiveTopic: (topic: string | null) => void;
}

const TopicFilters = ({ topics, activeTopic, setActiveTopic }: TopicFiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {topics.slice(0, 5).map((topic) => (
        <button
          key={topic}
          className={`px-3 py-1 text-xs rounded-full ${
            activeTopic === topic 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
          onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicFilters;
