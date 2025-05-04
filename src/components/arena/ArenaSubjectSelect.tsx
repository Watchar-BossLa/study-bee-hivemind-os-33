
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';
import { subjectAreas } from '@/data/qualifications';

interface ArenaSubjectSelectProps {
  selectedSubject: string | null;
  onSelectSubject: (subject: string) => void;
  disabled?: boolean;
}

export const ArenaSubjectSelect: React.FC<ArenaSubjectSelectProps> = ({
  selectedSubject,
  onSelectSubject,
  disabled = false
}) => {
  return (
    <Select value={selectedSubject || ''} onValueChange={onSelectSubject} disabled={disabled}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Random Topics</SelectItem>
        {subjectAreas.map((subject) => (
          <SelectItem key={subject.id} value={subject.id}>
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              {subject.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
