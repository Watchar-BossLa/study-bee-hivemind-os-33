
import { SubjectArea } from '@/types/qualifications';
import { businessModules } from './modules';

export const businessSubjectArea: SubjectArea = {
  id: "business",
  name: "Business Administration",
  description: "Study of management principles, organizational behavior, and business operations",
  icon: "briefcase",
  modules: businessModules
};
