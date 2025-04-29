
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

interface SessionParticipantsProps {
  participants: Participant[];
  hostId: string;
}

const SessionParticipants: React.FC<SessionParticipantsProps> = ({ participants, hostId }) => {
  return (
    <div className="p-4">
      <ul className="space-y-4">
        {participants.map((participant) => (
          <li key={participant.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participant.name}</p>
                {participant.id === hostId && (
                  <span className="text-xs text-primary">Host</span>
                )}
              </div>
            </div>
            
            {participant.id !== 'current-user-id' && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2H2v20"></path>
                    <path d="M22 16H16v6"></path>
                    <path d="M8 9l4-4 4 4"></path>
                    <path d="M12 5v10"></path>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" x2="12" y1="19" y2="22"></line>
                  </svg>
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionParticipants;
