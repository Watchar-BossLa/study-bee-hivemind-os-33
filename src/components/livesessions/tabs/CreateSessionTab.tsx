
import React from 'react';
import CreateSessionForm from '../CreateSessionForm';
import { LiveSession } from '@/types/livesessions';

interface CreateSessionTabProps {
  onSessionCreated: (sessionData: Omit<LiveSession, 'id' | 'createdAt' | 'updatedAt' | 'host' | 'participants'>) => Promise<void>;
  disabled: boolean;
}

const CreateSessionTab: React.FC<CreateSessionTabProps> = ({ onSessionCreated, disabled }) => {
  return (
    <div className="mt-6">
      <CreateSessionForm onSessionCreated={onSessionCreated} disabled={disabled} />
    </div>
  );
};

export default CreateSessionTab;
