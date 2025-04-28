
import { SubjectArea } from '@/types/qualifications';
import { accountingModules } from './modules';
import { professionalQualifications } from './professional-qualifications';

export const accountingSubjectArea: SubjectArea = {
  id: "accounting",
  name: "Accounting",
  description: "Study of financial information for decision-making, reporting, and compliance",
  icon: "book-text",
  modules: accountingModules
};

export { professionalQualifications as accountingQualifications };
