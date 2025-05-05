
import { useState, useEffect, useCallback, useRef } from 'react';
import { arenaChatService, ChatMessage, TypingStatus } from '@/services/arena/arenaChatService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useArenaChat = (matchId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Load initial messages
  useEffect(() => {
    if (!matchId) return;

    const fetchInitialMessages = async () => {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('arena_chat_messages')
          .select('*')
          .eq('match_id', matchId)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (data) {
          setMessages(data as ChatMessage[]);
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessages();
  }, [matchId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!matchId) return;
    
    const unsubscribe = arenaChatService.subscribeToChatMessages(
      matchId,
      (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    );

    return unsubscribe;
  }, [matchId]);

  // Subscribe to typing indicators
  useEffect(() => {
    if (!matchId) return;
    
    const unsubscribe = arenaChatService.subscribeToTypingIndicators(
      matchId,
      (typingStatuses) => {
        // Filter to only active typing users (last 3 seconds)
        const recentTyping = typingStatuses.filter((status) => {
          const lastUpdated = new Date(status.last_updated).getTime();
          const threeSecondsAgo = Date.now() - 3000;
          return status.is_typing && lastUpdated > threeSecondsAgo;
        });

        // Extract just the user IDs
        setTypingUsers(recentTyping.map(s => s.user_id));
      }
    );

    return unsubscribe;
  }, [matchId]);

  // Handle input change and typing status
  const handleInputChange = useCallback((value: string) => {
    setInputMessage(value);
    
    if (!matchId) return;

    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set typing status to true
        arenaChatService.updateTypingStatus(matchId, data.user.id, true);

        // Set timeout to clear typing status
        typingTimeoutRef.current = setTimeout(() => {
          arenaChatService.updateTypingStatus(matchId, data.user.id, false);
        }, 3000);
      }
    });
  }, [matchId]);

  // Send message
  const sendMessage = useCallback(async () => {
    if (!matchId || !inputMessage.trim()) return;

    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await arenaChatService.sendMessage(
        matchId,
        data.user.id,
        inputMessage.trim()
      );

      if (success) {
        setInputMessage('');
        // Clear typing status immediately after sending
        arenaChatService.updateTypingStatus(matchId, data.user.id, false);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [matchId, inputMessage, toast]);

  // Clean up when leaving
  const cleanupChat = useCallback(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user && matchId) {
        arenaChatService.clearTypingStatus(matchId, data.user.id);
      }
    });
    
    setMessages([]);
    setTypingUsers([]);
    setInputMessage('');
  }, [matchId]);

  return {
    messages,
    typingUsers,
    inputMessage,
    isLoading,
    handleInputChange,
    sendMessage,
    cleanupChat
  };
};
