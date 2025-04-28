
import React from 'react';
import { Network, Search } from 'lucide-react';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface GraphHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const GraphHeader: React.FC<GraphHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <>
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
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default GraphHeader;
