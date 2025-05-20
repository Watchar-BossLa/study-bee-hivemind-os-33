
import { LiveSession } from "@/types/livesessions";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Formats features data from database format to application format
 */
export const formatSessionFeatures = (featuresData: any) => {
  const defaultFeatures = {
    video: true,
    audio: true,
    chat: true,
    whiteboard: true,
    screenSharing: true,
    polls: true
  };

  // If it's a plain object with the expected properties
  if (typeof featuresData === 'object' && 
      featuresData !== null && 
      !Array.isArray(featuresData)) {
    return {
      video: Boolean(featuresData.video !== undefined ? featuresData.video : true),
      audio: Boolean(featuresData.audio !== undefined ? featuresData.audio : true),
      chat: Boolean(featuresData.chat !== undefined ? featuresData.chat : true),
      whiteboard: Boolean(featuresData.whiteboard !== undefined ? featuresData.whiteboard : true),
      screenSharing: Boolean(featuresData.screenSharing !== undefined ? featuresData.screenSharing : true),
      polls: Boolean(featuresData.polls !== undefined ? featuresData.polls : true)
    };
  }
  
  // Return default values if not a valid object
  return defaultFeatures;
};

/**
 * Helper to parse JSON string features if needed
 */
export const parseSessionFeatures = (features: any) => {
  try {
    if (typeof features === 'string') {
      try {
        const parsedFeatures = JSON.parse(features);
        return formatSessionFeatures(parsedFeatures);
      } catch (parseErr) {
        console.error("Error parsing features string:", parseErr);
        return formatSessionFeatures({});
      }
    } else {
      // Direct object access
      return formatSessionFeatures(features);
    }
  } catch (err) {
    console.error("Error handling features:", err);
    return formatSessionFeatures({});
  }
};

/**
 * Format host data from database response
 */
export const formatHostData = (hostData: any) => {
  if (!hostData) return { id: 'unknown', name: 'Unknown User', avatar: undefined };
  
  return {
    id: hostData.id,
    name: hostData.full_name || 'Unknown User',
    avatar: hostData.avatar_url || undefined
  };
};

/**
 * Format participants data from database response
 */
export const formatParticipantsData = (participantsData: any[], hostId: string) => {
  if (!participantsData) return [];
  
  const participants = participantsData.map(p => {
    // Safely access profile data with null checks
    const profile = p.profiles as Record<string, any> | null;
    return {
      id: profile?.id || p.user_id,
      name: profile?.full_name || 'Unknown User',
      avatar: profile?.avatar_url || undefined
    };
  });
  
  return participants;
};
