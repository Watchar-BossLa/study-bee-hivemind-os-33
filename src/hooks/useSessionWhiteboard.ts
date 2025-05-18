
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface WhiteboardPath {
  id: string;
  userId: string;
  userName: string;
  tool: string;
  color: string;
  brushSize: number;
  points: any[];
  timestamp: string;
}

export function useSessionWhiteboard(sessionId: string) {
  const [paths, setPaths] = useState<WhiteboardPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchPaths = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('session_whiteboard_paths')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        const formattedPaths = data.map(path => ({
          id: path.id,
          userId: path.user_id,
          userName: path.user_name,
          tool: path.tool,
          color: path.color,
          brushSize: path.brush_size,
          points: path.path_data.points,
          timestamp: path.created_at
        }));
        
        setPaths(formattedPaths);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching whiteboard paths:", err);
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error loading whiteboard",
        description: "Failed to load whiteboard data"
      });
    }
  }, [sessionId, toast]);
  
  // Initial data fetch
  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`whiteboard-${sessionId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'session_whiteboard_paths',
          filter: `session_id=eq.${sessionId}`
        }, 
        (payload) => {
          const newPath = payload.new as any;
          
          const formattedPath: WhiteboardPath = {
            id: newPath.id,
            userId: newPath.user_id,
            userName: newPath.user_name,
            tool: newPath.tool,
            color: newPath.color,
            brushSize: newPath.brush_size,
            points: newPath.path_data.points,
            timestamp: newPath.created_at
          };
          
          setPaths(prev => [...prev, formattedPath]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);
  
  // Function to add a path
  const addPath = async (pathData: {
    tool: string;
    color: string;
    brushSize: number;
    points: any[];
  }) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to use the whiteboard"
        });
        return false;
      }
      
      const userId = userData.user.id;
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single();
      
      const userName = profileData?.full_name || 'Unknown User';
      
      // Insert the path
      const { error } = await supabase
        .from('session_whiteboard_paths')
        .insert({
          session_id: sessionId,
          user_id: userId,
          user_name: userName,
          tool: pathData.tool,
          color: pathData.color,
          brush_size: pathData.brushSize,
          path_data: { points: pathData.points }
        });
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      console.error("Error saving whiteboard path:", err);
      toast({
        variant: "destructive",
        title: "Failed to save drawing",
        description: "Please try again"
      });
      return false;
    }
  };
  
  // Function to clear the whiteboard (for hosts only)
  const clearWhiteboard = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return false;
      }
      
      const userId = userData.user.id;
      
      // Check if user is the host
      const { data: sessionData } = await supabase
        .from('live_sessions')
        .select('host_id')
        .eq('id', sessionId)
        .single();
      
      if (sessionData?.host_id !== userId) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Only the host can clear the whiteboard"
        });
        return false;
      }
      
      // Delete all paths for this session
      const { error } = await supabase
        .from('session_whiteboard_paths')
        .delete()
        .eq('session_id', sessionId);
      
      if (error) throw error;
      
      setPaths([]);
      
      return true;
    } catch (err) {
      console.error("Error clearing whiteboard:", err);
      toast({
        variant: "destructive",
        title: "Failed to clear whiteboard",
        description: "Please try again"
      });
      return false;
    }
  };
  
  return {
    paths,
    isLoading,
    addPath,
    clearWhiteboard,
    refreshPaths: fetchPaths
  };
}
