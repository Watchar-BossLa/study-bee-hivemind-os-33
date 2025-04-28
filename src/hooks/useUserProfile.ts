
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthContext";
import { Json } from "@/integrations/supabase/types";

export type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  learning_preferences: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchProfile = async (): Promise<UserProfile | null> => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    // Transform the data to match our UserProfile type
    // Handle learning_preferences properly by ensuring it's an array of strings
    const profile: UserProfile = {
      ...data,
      learning_preferences: transformToStringArray(data.learning_preferences)
    };
    
    return profile;
  };

  // Helper function to transform Json to string[]
  const transformToStringArray = (value: Json | null): string[] | null => {
    if (value === null) return null;
    
    if (Array.isArray(value)) {
      // If it's already an array, map each item to string
      return value.map(item => String(item));
    } else if (typeof value === 'string') {
      // If it's a single string, wrap it in an array
      return [value];
    } else if (typeof value === 'object' && value !== null) {
      // If it's an object, convert its values to an array of strings
      return Object.values(value).map(item => String(item));
    } else {
      // For any other type (number, boolean), convert to string and wrap in array
      return [String(value)];
    }
  };

  const updateProfile = async (profile: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user) throw new Error("User not authenticated");
    
    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    // Transform the response data to match our UserProfile type
    const updatedProfile: UserProfile = {
      ...data,
      learning_preferences: transformToStringArray(data.learning_preferences)
    };
    
    return updatedProfile;
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
