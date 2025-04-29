
import { useState, useEffect } from 'react';
import { LiveSession } from '@/types/livesessions';
import { v4 as uuidv4 } from '@/lib/uuid';

// Mock data for development
const MOCK_SESSIONS: LiveSession[] = [
  {
    id: '1',
    title: 'Biology Final Exam Review',
    description: 'Comprehensive review of all topics for the final exam',
    subject: 'biology',
    host: {
      id: 'user-1',
      name: 'Sarah Johnson',
      avatar: ''
    },
    participants: [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
      },
      {
        id: 'user-2',
        name: 'Michael Chen',
      },
      {
        id: 'user-3',
        name: 'Emily Rodriguez',
      }
    ],
    maxParticipants: 10,
    startTime: new Date(Date.now() + 3600000).toISOString(),
    status: 'active',
    isPrivate: false,
    features: {
      video: true,
      audio: true,
      chat: true,
      whiteboard: true,
      screenSharing: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Calculus II - Integration Techniques',
    description: 'Focus on advanced integration techniques',
    subject: 'mathematics',
    host: {
      id: 'user-4',
      name: 'David Lee',
      avatar: ''
    },
    participants: [
      {
        id: 'user-4',
        name: 'David Lee',
      },
      {
        id: 'user-5',
        name: 'Jessica Wang',
      }
    ],
    maxParticipants: 5,
    startTime: new Date(Date.now() + 7200000).toISOString(),
    status: 'scheduled',
    isPrivate: true,
    accessCode: '123456',
    features: {
      video: true,
      audio: true,
      chat: true,
      whiteboard: true,
      screenSharing: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'World History - Renaissance Period',
    description: 'Discussion about key events and figures in the Renaissance',
    subject: 'history',
    host: {
      id: 'user-6',
      name: 'Alex Kim',
      avatar: ''
    },
    participants: [
      {
        id: 'user-6',
        name: 'Alex Kim',
      },
      {
        id: 'user-7',
        name: 'Olivia Smith',
      },
      {
        id: 'user-8',
        name: 'James Wilson',
      },
      {
        id: 'user-9',
        name: 'Sophia Garcia',
      }
    ],
    maxParticipants: 8,
    startTime: new Date(Date.now() - 1800000).toISOString(),
    status: 'active',
    isPrivate: false,
    features: {
      video: true,
      audio: true,
      chat: true,
      whiteboard: false,
      screenSharing: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function useLiveSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulating API call to fetch sessions
    const fetchSessions = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          setSessions(MOCK_SESSIONS);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions");
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, []);
  
  const getSessionById = (id: string) => {
    return sessions.find(session => session.id === id) || null;
  };
  
  const createSession = (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSessions([...sessions, newSession]);
    return newSession;
  };
  
  const joinSession = (sessionId: string, participant: { id: string; name: string; avatar?: string }) => {
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          // Check if participant is already in the session
          if (!session.participants.some(p => p.id === participant.id)) {
            return {
              ...session,
              participants: [...session.participants, participant],
              updatedAt: new Date().toISOString(),
            };
          }
        }
        return session;
      })
    );
  };
  
  const leaveSession = (sessionId: string, participantId: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            participants: session.participants.filter(p => p.id !== participantId),
            updatedAt: new Date().toISOString(),
          };
        }
        return session;
      })
    );
  };
  
  return {
    sessions,
    isLoading,
    error,
    getSessionById,
    createSession,
    joinSession,
    leaveSession,
  };
}
