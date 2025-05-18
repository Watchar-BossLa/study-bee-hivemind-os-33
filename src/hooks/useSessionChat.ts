
import { useState, useEffect, useCallback } from 'react';
import { SessionMessage } from '@/types/livesessions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export function useSessionChat(sessionId: string) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<{id: string, name: string}[]>([]);
  const { toast } = useToast();
  
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sessionId: msg.session_id,
          userId: msg.user_id,
          userName: msg.user_name,
          userAvatar: msg.user_avatar,
          content: msg.content,
          type: msg.type as 'text' | 'system' | 'file',
          timestamp: msg.created_at
        }));
        
        setMessages(formattedMessages);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: "Failed to load chat history"
      });
    }
  }, [sessionId, toast]);
  
  // Initial data fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`room-${sessionId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'session_messages',
          filter: `session_id=eq.${sessionId}`
        }, 
        (payload) => {
          const newMessage = payload.new as any;
          
          const formattedMessage: SessionMessage = {
            id: newMessage.id,
            sessionId: newMessage.session_id,
            userId: newMessage.user_id,
            userName: newMessage.user_name,
            userAvatar: newMessage.user_avatar,
            content: newMessage.content,
            type: newMessage.type as 'text' | 'system' | 'file',
            timestamp: newMessage.created_at
          };
          
          setMessages(prev => [...prev, formattedMessage]);
        }
      )
      .subscribe();
      
    // Handle typing indicators
    const presenceChannel = supabase.channel(`typing-${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const typing = Object.values(state).flat().map((p: any) => ({
          id: p.user_id,
          name: p.user_name
        }));
        setTypingUsers(typing);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        setTypingUsers(prev => [
          ...prev,
          ...newPresences.map((p: any) => ({ id: p.user_id, name: p.user_name }))
        ]);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        const leftIds = leftPresences.map((p: any) => p.user_id);
        setTypingUsers(prev => prev.filter(user => !leftIds.includes(user.id)));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(presenceChannel);
    };
  }, [sessionId]);
  
  // Function to send a message
  const sendMessage = async (content: string, type: 'text' | 'system' | 'file' = 'text') => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to send messages"
        });
        return false;
      }
      
      const userId = userData.user.id;
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();
      
      // Insert the message
      const { error } = await supabase
        .from('session_messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          user_name: profileData?.full_name || 'Unknown User',
          user_avatar: profileData?.avatar_url || null,
          content,
          type
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error sending message:", err);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again"
      });
      return false;
    }
  };
  
  // Function to indicate typing
  const setTyping = async (isTyping: boolean) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      
      const userId = userData.user.id;
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = profileData?.full_name || 'Unknown User';
      
      const presenceChannel = supabase.channel(`typing-${sessionId}`);
      
      if (isTyping) {
        await presenceChannel.track({
          user_id: userId,
          user_name: userName,
          typing: true
        });
      } else {
        // Stop tracking presence when not typing
        presenceChannel.untrack();
      }
    } catch (err) {
      console.error("Error updating typing status:", err);
    }
  };
  
  return {
    messages,
    isLoading,
    typingUsers,
    sendMessage,
    setTyping,
    refreshMessages: fetchMessages
  };
}
