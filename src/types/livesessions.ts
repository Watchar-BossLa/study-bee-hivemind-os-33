
export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  subject: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  maxParticipants: number;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'ended';
  isPrivate: boolean;
  accessCode?: string;
  features: {
    video: boolean;
    audio: boolean;
    chat: boolean;
    whiteboard: boolean;
    screenSharing: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'text' | 'system' | 'file';
  timestamp: string;
}

export interface WhiteboardDrawing {
  id: string;
  sessionId: string;
  userId: string;
  paths: any[];
  timestamp: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  timestamp: string;
  isShared: boolean;
}
