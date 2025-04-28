
import { SubjectArea } from '@/types/qualifications';
import { engineeringModules } from './modules';

export const engineeringSubjectArea: SubjectArea = {
  id: "engineering",
  name: "Engineering",
  description: "Study of various engineering disciplines including mechanical, electrical, civil, and chemical engineering",
  icon: "book",
  modules: engineeringModules
};
