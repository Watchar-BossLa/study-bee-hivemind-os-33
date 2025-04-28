
import { SubjectArea } from '@/types/qualifications';
import { medicineModules } from './modules';

export const medicineSubjectArea: SubjectArea = {
  id: "medicine",
  name: "Medicine & Healthcare",
  description: "Study of medical sciences, healthcare management, and clinical practice",
  icon: "graduation-cap",
  modules: medicineModules
};
