
import React from 'react';
import { Card } from '@/components/ui/card';
import { SessionPoll } from '@/types/livesessions';

interface PollHistoryProps {
  polls: SessionPoll[];
}

const PollHistory: React.FC<PollHistoryProps> = ({ polls }) => {
  const endedPolls = polls.filter(p => !p.isActive);
  
  if (endedPolls.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-medium mb-2">Previous Polls</h3>
      <div className="space-y-2">
        {endedPolls.map(poll => (
          <div key={poll.id} className="p-2 border rounded">
            <h4 className="font-medium">{poll.question}</h4>
            <p className="text-xs text-muted-foreground">
              Ended: {new Date(poll.endedAt || poll.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollHistory;
