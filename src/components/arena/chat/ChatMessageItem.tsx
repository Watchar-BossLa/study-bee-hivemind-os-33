
import React from 'react';
import { ChatMessage } from '@/services/arena/arenaChatService';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessageItemProps {
  message: ChatMessage;
  players: Array<{ user_id: string }>;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, players }) => {
  // Check if the message is from the current user (simplified approach)
  const currentUser = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  };
  
  const [isCurrentUser, setIsCurrentUser] = React.useState(false);
  
  React.useEffect(() => {
    currentUser().then(userId => {
      setIsCurrentUser(userId === message.user_id);
    });
  }, [message.user_id]);
  
  // Find if the user is a player in the match
  const isPlayer = players.some(player => player.user_id === message.user_id);
  
  // Format the timestamp
  const formattedTime = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-medium mb-1">
            {isPlayer ? `Player ${message.user_id.substring(0, 6)}` : 'Spectator'}
          </p>
        )}
        <p>{message.content}</p>
        <p className="text-xs opacity-70 text-right mt-1">{formattedTime}</p>
      </div>
    </div>
  );
};
