
import { SubjectArea } from '@/types/qualifications';
import { educationModules } from './modules';

export const educationSubjectArea: SubjectArea = {
  id: "education",
  name: "Education",
  description: "Study of teaching methodologies, educational psychology, and curriculum development",
  icon: "school",
  modules: educationModules
};
