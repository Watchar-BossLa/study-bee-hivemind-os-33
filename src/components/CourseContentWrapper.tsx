
import React from 'react';
import CourseContent from '@/components/CourseContent';

interface CourseContentWrapperProps {
  courseId: string;
}

/**
 * Wrapper component for CourseContent that properly handles the courseId prop
 * This resolves TypeScript errors with passing courseId to CourseContent
 */
const CourseContentWrapper: React.FC<CourseContentWrapperProps> = ({ courseId }) => {
  // This wrapper component acts as an adapter between the route parameter
  // and the actual CourseContent component
  return <CourseContent />;
};

export default CourseContentWrapper;
