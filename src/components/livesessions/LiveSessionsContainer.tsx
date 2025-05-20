
import React from 'react';
import AuthenticationAlert from './AuthenticationAlert';
import SessionAuthManager from './container/SessionAuthManager';
import ActiveSessionManager from './container/ActiveSessionManager';
import SessionTabs from './container/SessionTabs';
import { useToast } from "@/components/ui/use-toast";

/**
 * Main container component for live sessions functionality
 */
const LiveSessionsContainer = () => {
  const { toast } = useToast();
  
  const handleSignIn = async () => {
    // Redirect to login page or show modal
    window.location.href = "/login"; // Adjust as needed for your auth flow
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Live Study Sessions</h1>
      
      <SessionAuthManager>
        {(isAuthenticated) => (
          <>
            {!isAuthenticated && (
              <AuthenticationAlert onSignIn={handleSignIn} />
            )}

            <ActiveSessionManager 
              isAuthenticated={isAuthenticated}
              // Passing the children properly
              children={<SessionTabs isAuthenticated={isAuthenticated} />} 
            />
          </>
        )}
      </SessionAuthManager>
    </div>
  );
};

export default LiveSessionsContainer;
