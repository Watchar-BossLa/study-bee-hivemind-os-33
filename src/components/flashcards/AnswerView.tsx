
import React from 'react';
import ResponseButtons from './ResponseButtons';

interface AnswerViewProps {
  answer: string;
  isSubmitting: boolean;
  onResponse: (wasCorrect: boolean) => Promise<void>;
}

const AnswerView: React.FC<AnswerViewProps> = ({ answer, isSubmitting, onResponse }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Answer:</h3>
        <p>{answer}</p>
      </div>
      <ResponseButtons isSubmitting={isSubmitting} onResponse={onResponse} />
    </div>
  );
};

export default AnswerView;
