
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CreatePollButtonProps {
  onClick: () => void;
}

const CreatePollButton: React.FC<CreatePollButtonProps> = ({ onClick }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Create a Poll</h3>
      <Button onClick={onClick}>Create New Poll</Button>
    </Card>
  );
};

export default CreatePollButton;
