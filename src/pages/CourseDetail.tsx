
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseContent from '@/components/CourseContent';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <CourseContent courseId={courseId || ''} />
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetail;
