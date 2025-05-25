
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Atom } from 'lucide-react';

interface QuantumInsights {
  coherenceScore: number;
  entanglementLevel: number;
  superpositionStates: string[];
}

interface QuantumLearningStateCardProps {
  quantumInsights: QuantumInsights;
}

const QuantumLearningStateCard: React.FC<QuantumLearningStateCardProps> = ({ quantumInsights }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Atom className="h-5 w-5" />
          Quantum Learning State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Coherence Score</div>
            <div className="text-xl font-bold text-purple-600">
              {Math.round(quantumInsights.coherenceScore * 100)}%
            </div>
            <Progress value={quantumInsights.coherenceScore * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Entanglement Level</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.round(quantumInsights.entanglementLevel * 100)}%
            </div>
            <Progress value={quantumInsights.entanglementLevel * 100} className="h-2" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Superposition States</div>
          <div className="space-y-1">
            {quantumInsights.superpositionStates.map((state: string, index: number) => (
              <div key={index} className="text-xs text-muted-foreground">
                {state}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full">
            <Atom className="h-4 w-4 mr-2" />
            Optimize Quantum Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantumLearningStateCard;
