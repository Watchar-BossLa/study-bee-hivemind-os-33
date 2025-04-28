
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";

export type UserProfile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  learning_preferences?: string[];
  created_at: string;
  updated_at: string;
};

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data;
  };

  const profileQuery = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: profileMutation.mutate,
    isUpdating: profileMutation.isPending,
  };
}
