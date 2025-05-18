
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthenticationAlertProps {
  onSignIn: () => void;
}

const AuthenticationAlert: React.FC<AuthenticationAlertProps> = ({ onSignIn }) => {
  return (
    <Alert className="mb-6" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication required</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>You need to be logged in to create or join sessions.</span>
        <Button variant="outline" onClick={onSignIn}>Sign In</Button>
      </AlertDescription>
    </Alert>
  );
};

export default AuthenticationAlert;
