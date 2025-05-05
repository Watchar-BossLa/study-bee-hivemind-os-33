
import React from 'react';
import { ChatMessage } from '@/services/arena/arenaChatService';
import { supabase } from '@/integrations/supabase/client';
import { User } from 'lucide-react';

interface ChatMessageItemProps {
  message: ChatMessage;
  players: Array<{ user_id: string }>;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, players }) => {
  const [isCurrentUser, setIsCurrentUser] = React.useState(false);
  
  React.useEffect(() => {
    // Check if this message is from the current user
    const checkCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setIsCurrentUser(data.user.id === message.user_id);
      }
    };
    
    checkCurrentUser();
  }, [message.user_id]);
  
  // Format timestamp
  const messageTime = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  // Get a shortened user ID for display
  const userId = message.user_id.substring(0, 6);
  
  // Check if the user is a player in the match
  const isPlayer = players.some(player => player.user_id === message.user_id);
  
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div 
        className={`px-3 py-2 rounded-lg max-w-[80%] ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground ml-12'
            : 'bg-muted mr-12'
        }`}
      >
        {!isCurrentUser && (
          <div className="flex items-center gap-1 mb-1">
            <User className="h-3 w-3" />
            <span className={`text-xs font-medium ${!isPlayer ? 'text-muted-foreground' : ''}`}>
              Player {userId}
              {!isPlayer && " (spectator)"}
            </span>
          </div>
        )}
        <p className="text-sm break-words">{message.content}</p>
        <div className="text-xs text-right mt-1 opacity-70">
          {messageTime}
        </div>
      </div>
    </div>
  );
};
