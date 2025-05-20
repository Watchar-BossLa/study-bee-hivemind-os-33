
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SessionAuthManagerProps {
  children: (isAuthenticated: boolean) => React.ReactNode;
}

/**
 * Component to handle authentication state for live sessions
 */
const SessionAuthManager: React.FC<SessionAuthManagerProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkAuth();
  }, []);

  return <>{children(isAuthenticated)}</>;
};

export default SessionAuthManager;
