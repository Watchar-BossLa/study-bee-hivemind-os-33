
import { SubjectArea } from '@/types/qualifications';
import { businessModules } from './modules';

export const businessSubjectArea: SubjectArea = {
  id: "business",
  name: "Business Administration",
  description: "Comprehensive study of business management, leadership, and organizational operations",
  icon: "briefcase",
  modules: businessModules
};
