
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, User } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

interface SessionParticipantsProps {
  participants: Participant[];
  hostId: string;
}

const SessionParticipants: React.FC<SessionParticipantsProps> = ({ participants: initialParticipants, hostId }) => {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    };
    
    fetchCurrentUser();
    
    // Initialize audio states
    const initialAudioStates: Record<string, boolean> = {};
    initialParticipants.forEach(p => {
      initialAudioStates[p.id] = true;
    });
    setAudioEnabled(initialAudioStates);
  }, [initialParticipants]);

  // Subscribe to participants changes
  useEffect(() => {
    // Function to fetch all active participants
    const fetchParticipants = async (sessionId: string) => {
      if (!sessionId) return;
      
      try {
        const { data } = await supabase
          .from('session_participants')
          .select(`
            user_id,
            role,
            is_active,
            profiles:user_id (id, full_name, avatar_url)
          `)
          .eq('session_id', sessionId)
          .eq('is_active', true);
        
        if (data) {
          const mappedParticipants = data.map(p => ({
            id: p.profiles.id,
            name: p.profiles.full_name || 'Unknown User',
            avatar: p.profiles.avatar_url || undefined,
            role: p.role
          }));
          
          setParticipants(mappedParticipants);
          
          // Update audio states for new participants
          mappedParticipants.forEach(p => {
            if (audioEnabled[p.id] === undefined) {
              setAudioEnabled(prev => ({ ...prev, [p.id]: true }));
            }
          });
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    
    // Extract session ID from the first participant
    if (initialParticipants.length > 0) {
      const sessionId = initialParticipants[0]?.id.split('_')[0];
      
      if (sessionId) {
        // Set up subscription
        const channel = supabase
          .channel(`participants-changes`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'session_participants',
              filter: `session_id=eq.${sessionId}`
            }, 
            () => {
              fetchParticipants(sessionId);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [initialParticipants]);
  
  const toggleAudio = (participantId: string) => {
    setAudioEnabled(prev => ({
      ...prev,
      [participantId]: !prev[participantId]
    }));
  };

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {participants.map((participant) => (
          <li key={participant.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participant.name}</p>
                {participant.id === hostId && (
                  <span className="text-xs text-primary">Host</span>
                )}
              </div>
            </div>
            
            {participant.id !== currentUserId && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleAudio(participant.id)}
              >
                {audioEnabled[participant.id] ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionParticipants;
