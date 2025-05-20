
import React from 'react';
import { Button } from '@/components/ui/button';
import { PieChart } from 'lucide-react';

interface NoPollsMessageProps {
  isHost: boolean;
  onCreatePoll: () => void;
}

const NoPollsMessage: React.FC<NoPollsMessageProps> = ({ isHost, onCreatePoll }) => {
  return (
    <div className="flex flex-col items-center justify-center h-32">
      <PieChart className="w-12 h-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">No active polls right now.</p>
      {isHost && (
        <Button variant="link" onClick={onCreatePoll}>
          Create a poll to gather feedback
        </Button>
      )}
    </div>
  );
};

export default NoPollsMessage;
