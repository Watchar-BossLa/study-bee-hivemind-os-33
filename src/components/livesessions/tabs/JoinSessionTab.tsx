
import React from 'react';
import JoinSessionForm from '../JoinSessionForm';

interface JoinSessionTabProps {
  onJoin: (sessionId: string, accessCode?: string) => Promise<void>;
  disabled: boolean;
}

const JoinSessionTab: React.FC<JoinSessionTabProps> = ({ onJoin, disabled }) => {
  return (
    <div className="mt-6">
      <JoinSessionForm onJoin={onJoin} disabled={disabled} />
    </div>
  );
};

export default JoinSessionTab;
