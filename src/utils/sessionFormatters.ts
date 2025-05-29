
import { SessionFeatures, SessionParticipant } from '@/types/livesessions';

export function formatHostData(hostData: any): SessionParticipant {
  return {
    id: hostData?.id || 'unknown',
    name: hostData?.full_name || 'Unknown Host',
    avatar: hostData?.avatar_url,
    role: 'host' as const,
    isActive: true,
    joinedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString()
  };
}

export function formatParticipantsData(participantsData: any[], hostId: string): SessionParticipant[] {
  return participantsData.map(participant => ({
    id: participant.user_id,
    name: participant.user_name || 'Unknown User',
    avatar: participant.user_avatar,
    role: participant.role || 'participant',
    isActive: participant.is_active,
    joinedAt: participant.joined_at,
    lastSeen: participant.left_at || participant.joined_at
  })).filter(p => p.id !== hostId); // Exclude host from participants list
}

export function parseSessionFeatures(features: any): SessionFeatures {
  const defaultFeatures: SessionFeatures = {
    chat: true,
    audio: true,
    video: true,
    whiteboard: true,
    polls: true,
    screenSharing: true,
    breakoutRooms: false
  };

  if (!features || typeof features !== 'object') {
    return defaultFeatures;
  }

  return {
    chat: features.chat ?? defaultFeatures.chat,
    audio: features.audio ?? defaultFeatures.audio,
    video: features.video ?? defaultFeatures.video,
    whiteboard: features.whiteboard ?? defaultFeatures.whiteboard,
    polls: features.polls ?? defaultFeatures.polls,
    screenSharing: features.screenSharing ?? defaultFeatures.screenSharing,
    breakoutRooms: features.breakoutRooms ?? defaultFeatures.breakoutRooms
  };
}

export function sessionFeaturesToJson(features: SessionFeatures): Record<string, boolean> {
  return {
    chat: features.chat,
    audio: features.audio,
    video: features.video,
    whiteboard: features.whiteboard,
    polls: features.polls,
    screenSharing: features.screenSharing,
    breakoutRooms: features.breakoutRooms
  };
}
