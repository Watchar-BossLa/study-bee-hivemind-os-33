
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Atom, Brain } from 'lucide-react';

const AnalyticsHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Advanced Learning Analytics</h2>
      <div className="flex gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Atom className="h-3 w-3" />
          Quantum-Enhanced
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Brain className="h-3 w-3" />
          AI-Powered
        </Badge>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
