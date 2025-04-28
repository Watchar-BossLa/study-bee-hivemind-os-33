import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subjectAreas } from '@/data/qualifications';

const CourseContent = () => {
  const { subjectId, moduleId } = useParams();
  const navigate = useNavigate();

  const subject = subjectAreas.find(s => s.id === subjectId);
  const module = subject?.modules.find(m => m.id === moduleId);

  if (!subject || !module) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/qualifications')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Qualifications
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/qualifications')}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Qualifications
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{module.name}</h1>
          <p className="text-muted-foreground">{subject.description}</p>
        </div>

        <div className="grid gap-6">
          {module.courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {course.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {course.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {course.credits} credits
                  </span>
                  <Button onClick={() => navigate(`/learn/${subjectId}/${moduleId}/${course.id}`)}>
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseContent;
