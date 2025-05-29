
export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  host: SessionParticipant;
  participants: SessionParticipant[];
  subject: string;
  maxParticipants: number;
  isPrivate: boolean;
  accessCode?: string;
  status: 'active' | 'ended' | 'scheduled';
  features: SessionFeatures;
  createdAt: string;
  updatedAt: string;
  startTime: string;
  endTime?: string;
}

export interface SessionParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'moderator' | 'participant';
  isActive: boolean;
  joinedAt: string;
  lastSeen: string;
}

export interface SessionFeatures {
  chat: boolean;
  audio: boolean;
  video: boolean;
  whiteboard: boolean;
  polls: boolean;
  screenSharing: boolean;
  breakoutRooms: boolean;
  [key: string]: boolean; // Index signature for Supabase Json compatibility
}

export interface SessionMessage {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  type: 'text' | 'system' | 'poll' | 'file';
  timestamp: string;
  editedAt?: string;
  replyTo?: string;
}

export interface SessionPoll {
  id: string;
  sessionId: string;
  creatorId: string;
  question: string;
  options: PollOption[];
  allowMultipleChoices: boolean;
  isActive: boolean;
  createdAt: string;
  endedAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollResults {
  totalVotes: number;
  options: (PollOption & { percentage: number })[];
  voters: string[];
}

export interface SessionNote {
  id: string;
  sessionId: string;
  userId: string;
  content: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteboardPath {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  pathData: number[][];
  color: string;
  brushSize: number;
  tool: 'pen' | 'eraser' | 'highlighter';
  createdAt: string;
}
