
import { SubjectArea } from '@/types/qualifications';
import { scienceModules } from './modules';

export const scienceSubjectArea: SubjectArea = {
  id: "science",
  name: "Natural Sciences",
  description: "Comprehensive study of physical and life sciences including biology, chemistry, physics, and environmental science",
  icon: "book",
  modules: scienceModules
};
