
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LiveSession, SessionMessage } from '@/types/livesessions';

interface SessionChatProps {
  session: LiveSession;
}

const SessionChat: React.FC<SessionChatProps> = ({ session }) => {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const transformedMessages: SessionMessage[] = (data || []).map(msg => ({
        id: msg.id,
        sessionId: msg.session_id,
        userId: msg.user_id,
        userName: msg.user_name,
        userAvatar: msg.user_avatar || undefined,
        content: msg.content,
        type: msg.type as 'text' | 'system' | 'poll' | 'file',
        timestamp: msg.created_at
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel(`session_chat_${session.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const newMsg = payload.new as any;
          const transformedMessage: SessionMessage = {
            id: newMsg.id,
            sessionId: newMsg.session_id,
            userId: newMsg.user_id,
            userName: newMsg.user_name,
            userAvatar: newMsg.user_avatar || undefined,
            content: newMsg.content,
            type: newMsg.type,
            timestamp: newMsg.created_at
          };
          setMessages(prev => [...prev, transformedMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You need to be logged in to send messages',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('session_messages')
        .insert({
          session_id: session.id,
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
          content: newMessage.trim(),
          type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Chat
          <span className="text-sm font-normal text-muted-foreground">
            ({session.participants.length} participants)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback>
                    {message.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionChat;
