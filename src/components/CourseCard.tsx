
import { CourseProps } from '@/types/course';
import CourseGridItem from './courses/CourseGridItem';

const CourseCard = ({ course }: { course: CourseProps }) => {
  return <CourseGridItem course={course} />;
};

export default CourseCard;
