
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubjectAreas from '@/components/qualifications/SubjectAreas';
import AccountingQualifications from '@/components/qualifications/AccountingQualifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabErrorBoundary } from '@/components/ui/TabErrorBoundary';
import { Book, Award } from 'lucide-react';

const QualificationsHeader = () => (
  <section className="bg-bee-light py-12">
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Qualifications & Subject Areas</h1>
      <p className="text-muted-foreground max-w-3xl">
        Browse our comprehensive range of qualifications across multiple academic levels.
        From certificates to master's degrees, Study Bee provides AI-powered learning for
        over 400+ subjects with complete curriculum coverage.
      </p>
    </div>
  </section>
);

const Qualifications = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <QualificationsHeader />
        
        <section className="py-12">
          <div className="container">
            <TabErrorBoundary>
              <Tabs defaultValue="subjects" className="space-y-8">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="subjects" className="flex items-center gap-2">
                    <Book className="h-4 w-4" />
                    <span className="hidden sm:inline">Subject Areas</span>
                  </TabsTrigger>
                  <TabsTrigger value="accounting" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span className="hidden sm:inline">Accounting</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="subjects">
                  <SubjectAreas />
                </TabsContent>
                
                <TabsContent value="accounting">
                  <AccountingQualifications />
                </TabsContent>
              </Tabs>
            </TabErrorBoundary>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Qualifications;
