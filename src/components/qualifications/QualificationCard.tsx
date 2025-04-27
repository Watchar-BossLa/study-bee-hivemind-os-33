
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Module, QualificationLevel } from '@/types/qualifications';

interface QualificationCardProps {
  module: Module;
  qualificationLevel?: QualificationLevel;
}

const QualificationCard = ({ module, qualificationLevel }: QualificationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {module.level === 'professional' ? 'Professional' : qualificationLevel?.name}
            </Badge>
            <CardTitle>{module.name}</CardTitle>
            {module.description && (
              <CardDescription className="mt-2">{module.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-4">
          <div className="text-sm font-medium mb-1">Courses:</div>
          <ul className={`space-y-1 text-sm ${!isExpanded && 'max-h-28 overflow-hidden'}`}>
            {module.courses.map((course, index) => (
              <li key={course.id} className="flex items-start gap-2">
                <Book className="h-4 w-4 mt-1 text-muted-foreground" />
                <span>{course.name} <span className="text-muted-foreground">({course.credits} credits)</span></span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 mt-auto">
        {module.courses.length > 3 && (
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
