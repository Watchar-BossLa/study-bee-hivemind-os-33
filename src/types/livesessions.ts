
export interface LiveSession {
  id: string;
  title: string;
  description?: string;
  subject: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
    isCurrentUser?: boolean;
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
    polls?: boolean;
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

export interface SessionPoll {
  id: string;
  sessionId: string;
  creatorId: string;
  question: string;
  options: { text: string }[];
  isActive: boolean;
  allowMultipleChoices: boolean;
  createdAt: string;
  endedAt?: string;
}

export interface PollResponse {
  id: string;
  pollId: string;
  userId: string;
  selectedOptions: number[];
  createdAt: string;
}

export interface PollResults {
  totalResponses: number;
  optionCounts: number[];
  respondents: {
    id: string;
    name: string;
    avatar?: string;
    selectedOptions: number[];
  }[];
}
