import { useApi } from './useApi';
import { useAuthContext } from '@/components/providers/AuthProvider';

interface SessionInfo {
  sessionId: string;
  isCurrentSession: boolean;
  lastActivity: {
    timestamp: number;
    ip: string;
    userAgent: string;
    path: string;
  } | null;
}

export function useSession() {
  const api = useApi<{ sessions: SessionInfo[] }>();
  const { logout } = useAuthContext();

  const fetchSessions = async () => {
    return api.request('/api/auth/sessions');
  };

  const terminateSession = async (sessionId: string) => {
    return api.request('/api/auth/sessions', {
      method: 'DELETE',
      body: { sessionId },
    });
  };

  const terminateAllOtherSessions = async () => {
    const { sessions } = await fetchSessions();
    const otherSessions = sessions.filter(s => !s.isCurrentSession);
    
    await Promise.all(
      otherSessions.map(session => terminateSession(session.sessionId))
    );

    return fetchSessions();
  };

  return {
    sessions: api.data?.sessions || [],
    loading: api.loading,
    error: api.error,
    fetchSessions,
    terminateSession,
    terminateAllOtherSessions,
    logout,
  };
}