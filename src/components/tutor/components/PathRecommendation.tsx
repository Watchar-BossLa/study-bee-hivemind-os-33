
import React from 'react';
import { Info } from 'lucide-react';

interface PathRecommendationProps {
  recommendedPath: string | null;
}

const PathRecommendation: React.FC<PathRecommendationProps> = ({ recommendedPath }) => {
  if (!recommendedPath) return null;
  
  return (
    <div className="mb-3 bg-primary/10 p-2 rounded-md text-xs flex items-center">
      <Info className="h-3 w-3 mr-1 text-primary" />
      <span>Recommended path: <strong>{recommendedPath}</strong></span>
    </div>
  );
};

export default PathRecommendation;
