
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SubjectArea, QualificationLevel } from '@/types/qualifications';
import { subjectAreas, qualificationLevels } from '@/data/qualificationsData';
import { Book, BookOpen } from 'lucide-react';
import QualificationCard from './QualificationCard';

const SubjectAreas = () => {
  const [activeSubject, setActiveSubject] = useState<string>(subjectAreas[0].id);

  const activeSubjectData = subjectAreas.find(subject => subject.id === activeSubject);

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8">Subject Areas</h2>
      
      <Tabs defaultValue={activeSubject} onValueChange={setActiveSubject} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {subjectAreas.map((subject) => (
            <TabsTrigger key={subject.id} value={subject.id} className="flex gap-2 items-center">
              <BookOpen className="h-4 w-4" />
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {subjectAreas.map((subject) => (
          <TabsContent key={subject.id} value={subject.id} className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
              <p className="text-muted-foreground mb-6">{subject.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subject.modules.map((module) => (
                <QualificationCard 
                  key={module.id}
                  module={module}
                  qualificationLevel={qualificationLevels.find(level => level.id === module.level)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SubjectAreas;
