
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SpecializedAgent } from '../types/agents';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AgentBoostSelectorProps {
  agents: SpecializedAgent[];
  onAgentBoostChange: (boostedAgents: string[]) => void;
  maxBoosts?: number;
  boostFactor?: number;
}

export const AgentBoostSelector = ({
  agents,
  onAgentBoostChange,
  maxBoosts = 2,
  boostFactor = 0.2
}: AgentBoostSelectorProps) => {
  const [boostedAgents, setBoostedAgents] = React.useState<string[]>([]);
  const { toast } = useToast();
  
  const handleBoostToggle = (agentId: string) => {
    let newBoostedAgents: string[];
    
    if (boostedAgents.includes(agentId)) {
      // Remove from boosted agents
      newBoostedAgents = boostedAgents.filter(id => id !== agentId);
    } else {
      // Check if max boosts reached
      if (boostedAgents.length >= maxBoosts) {
        toast({
          title: "Maximum agent boosts reached",
          description: `You can only boost up to ${maxBoosts} agents.`,
          variant: "destructive"
        });
        return;
      }
      
      // Add to boosted agents
      newBoostedAgents = [...boostedAgents, agentId];
    }
    
    setBoostedAgents(newBoostedAgents);
    onAgentBoostChange(newBoostedAgents);
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Boost Agent Influence</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Boost specific agents' vote influence by {Math.round(boostFactor * 100)}%.
          You can boost up to {maxBoosts} agents.
        </p>
        
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-muted-foreground">{agent.domain} Expert</div>
              </div>
              <div className="flex items-center gap-2">
                {boostedAgents.includes(agent.id) && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Boosted
                  </Badge>
                )}
                <Switch
                  checked={boostedAgents.includes(agent.id)}
                  onCheckedChange={() => handleBoostToggle(agent.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
