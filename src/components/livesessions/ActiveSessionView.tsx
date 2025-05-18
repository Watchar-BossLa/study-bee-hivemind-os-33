
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { LiveSession } from '@/types/livesessions';
import SessionHeader from './SessionHeader';
import SessionTabsList from './SessionTabsList';
import SessionTabsContent from './SessionTabsContent';
import { supabase } from '@/integrations/supabase/client';

interface ActiveSessionViewProps {
  session: LiveSession;
  onLeave: () => void;
}

const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ session, onLeave }) => {
  const [activeTab, setActiveTab] = useState<string>('whiteboard');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
      }
    };
    
    getUserId();
  }, []);

  // Update the session object to include the current user's ID
  const sessionWithUserContext: LiveSession = {
    ...session,
    // Check if the current user is the host
    host: {
      ...session.host,
      isCurrentUser: session.host.id === userId
    }
  };

  return (
    <div className="container py-4">
      <SessionHeader session={sessionWithUserContext} onLeave={onLeave} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <SessionTabsList session={sessionWithUserContext} />
        <SessionTabsContent session={sessionWithUserContext} />
      </Tabs>
    </div>
  );
};

export default ActiveSessionView;
