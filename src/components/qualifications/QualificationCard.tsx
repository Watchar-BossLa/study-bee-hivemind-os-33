
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronDown, ChevronUp, Clock, Award, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Module, QualificationLevel } from '@/types/qualifications';

interface QualificationCardProps {
  module: Module;
  subjectId: string;
  qualificationLevel?: QualificationLevel;
}

const QualificationCard = ({ module, subjectId, qualificationLevel }: QualificationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    navigate(`/course/${subjectId}/${module.id}`);
  };
  
  // Calculate total credits
  const totalCredits = module.courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <Card 
      className="h-full flex flex-col transition-shadow hover:shadow-md cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {module.level === 'professional' ? 'Professional' : qualificationLevel?.name || module.level}
            </Badge>
            <CardTitle>{module.name}</CardTitle>
            {module.description && (
              <CardDescription className="mt-2">{module.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {module.learning_outcomes && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Learning Outcomes:</div>
            <ul className="space-y-1 text-sm">
              {module.learning_outcomes.slice(0, isExpanded ? undefined : 2).map((outcome, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Award className="h-4 w-4 mt-1 text-muted-foreground" />
                  <span>{outcome}</span>
                </li>
              ))}
              {!isExpanded && module.learning_outcomes.length > 2 && (
                <li className="text-sm text-muted-foreground">
                  + {module.learning_outcomes.length - 2} more outcomes
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          {module.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{module.duration}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{module.courses.length} courses</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{totalCredits} credits</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{1000 + Math.floor(Math.random() * 2000)} enrolled</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-1">Courses:</div>
          <ul className={`space-y-1 text-sm ${!isExpanded && 'max-h-28 overflow-hidden'}`}>
            {module.courses.slice(0, isExpanded ? undefined : 3).map((course, index) => (
              <li key={course.id} className="flex items-start gap-2">
                <Book className="h-4 w-4 mt-1 text-muted-foreground" />
                <span>{course.name} <span className="text-muted-foreground">({course.credits} credits)</span></span>
              </li>
            ))}
            {!isExpanded && module.courses.length > 3 && (
              <li className="text-sm text-muted-foreground">
                + {module.courses.length - 3} more courses
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        {(module.courses.length > 3 || (module.learning_outcomes && module.learning_outcomes.length > 2)) && (
          <Button 
            variant="ghost" 
            onClick={toggleExpand} 
            className="flex items-center text-xs w-full justify-center"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QualificationCard;
