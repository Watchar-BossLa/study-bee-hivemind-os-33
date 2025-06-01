
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CourseNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
      <Button onClick={() => navigate('/qualifications')}>
        Back to Qualifications
      </Button>
    </div>
  );
};
