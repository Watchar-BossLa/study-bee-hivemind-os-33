
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LearningContent from '@/components/learning/LearningContent';
import { Book, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseLearning = () => {
  const { subjectId, moduleId, courseId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
        </div>
        <LearningContent subjectId={subjectId} moduleId={moduleId} courseId={courseId} />
      </main>
      <Footer />
    </div>
  );
};

export default CourseLearning;
