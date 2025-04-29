
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SubjectProgress } from '@/types/analytics';
import { CalendarDays, ArrowUp, ArrowDown } from 'lucide-react';

interface SubjectProgressCardsProps {
  data: SubjectProgress[];
}

const MasteryBadge: React.FC<{ level: 'beginner' | 'intermediate' | 'advanced' | 'expert' }> = ({ level }) => {
  const colors: Record<string, string> = {
    beginner: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-green-100 text-green-800',
    advanced: 'bg-purple-100 text-purple-800',
    expert: 'bg-amber-100 text-amber-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

const SubjectProgressCards: React.FC<SubjectProgressCardsProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((subject) => (
        <Card key={subject.subject_id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
              <MasteryBadge level={subject.mastery_level} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span>Progress</span>
                <span className="font-medium">{subject.completion_percentage}%</span>
              </div>
              <Progress value={subject.completion_percentage} />
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Last studied: {formatDate(subject.last_studied)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <ArrowUp className="h-4 w-4 text-green-500" />
                  <span>Strengths</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {subject.strong_areas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <ArrowDown className="h-4 w-4 text-red-500" />
                  <span>Needs Work</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {subject.weak_areas.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubjectProgressCards;
