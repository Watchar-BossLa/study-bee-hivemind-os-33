
import { CourseProps } from '@/types/course';
import CourseGridItem from './courses/CourseGridItem';

interface CourseCardProps {
  course: CourseProps;
  isBookmarked?: boolean;
  onToggleBookmark?: (course: CourseProps) => Promise<boolean>;
}

const CourseCard = ({ course, isBookmarked, onToggleBookmark }: CourseCardProps) => {
  return (
    <CourseGridItem 
      course={course} 
      isBookmarked={isBookmarked}
      onToggleBookmark={onToggleBookmark}
    />
  );
};

export default CourseCard;
