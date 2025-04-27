
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { accountingQualifications } from '@/data/qualificationsData';
import { Book, Award, CheckCircle } from 'lucide-react';

const AccountingQualifications = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Award className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">International Accounting Qualifications</h2>
      </div>
      
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Study Bee supports preparation for these globally recognized accounting qualifications. 
        Our comprehensive study materials, practice exams, and AI tutoring are designed to help 
        you succeed in these prestigious professional certifications.
      </p>
      
      <div className="space-y-8">
        {accountingQualifications.map((qualification) => (
          <Card key={qualification.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                {qualification.name}
              </CardTitle>
              <CardDescription>{qualification.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {qualification.modules.map((module, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Book className="h-4 w-4 text-primary" />
                      {module.name}
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 pl-6">
                      {module.courses.map((course, courseIdx) => (
                        <li key={courseIdx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{course}</span>
                        </li>
                      ))}
                    </ul>
                    {idx < qualification.modules.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountingQualifications;
