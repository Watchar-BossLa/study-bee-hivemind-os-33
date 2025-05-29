
import { renderHook, act } from '@testing-library/react';
import { useSessionFetching } from '../useSessionFetching';

// Mock the LiveSessionService
jest.mock('@/services/LiveSessionService', () => ({
  liveSessionService: {
    getActiveSessions: jest.fn()
  }
}));

import { liveSessionService } from '@/services/LiveSessionService';

describe('useSessionFetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch sessions successfully', async () => {
    const mockSessions = [
      { id: '1', title: 'Math Session', status: 'active' },
      { id: '2', title: 'Science Session', status: 'active' }
    ];

    (liveSessionService.getActiveSessions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockSessions
    });

    const { result } = renderHook(() => useSessionFetching());

    let sessions: any[] = [];
    await act(async () => {
      sessions = await result.current.fetchSessions();
    });

    expect(sessions).toEqual(mockSessions);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch sessions';
    (liveSessionService.getActiveSessions as jest.Mock).mockResolvedValue({
      success: false,
      error: new Error(errorMessage)
    });

    const { result } = renderHook(() => useSessionFetching());

    let sessions: any[] = [];
    await act(async () => {
      sessions = await result.current.fetchSessions();
    });

    expect(sessions).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should get session by ID', async () => {
    const mockSessions = [
      { id: '1', title: 'Math Session', status: 'active' },
      { id: '2', title: 'Science Session', status: 'active' }
    ];

    (liveSessionService.getActiveSessions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockSessions
    });

    const { result } = renderHook(() => useSessionFetching());

    let session: any = null;
    await act(async () => {
      session = await result.current.getSessionById('1');
    });

    expect(session).toEqual(mockSessions[0]);
  });

  it('should return null for non-existent session', async () => {
    const mockSessions = [
      { id: '1', title: 'Math Session', status: 'active' }
    ];

    (liveSessionService.getActiveSessions as jest.Mock).mockResolvedValue({
      success: true,
      data: mockSessions
    });

    const { result } = renderHook(() => useSessionFetching());

    let session: any = null;
    await act(async () => {
      session = await result.current.getSessionById('non-existent');
    });

    expect(session).toBe(null);
  });
});
