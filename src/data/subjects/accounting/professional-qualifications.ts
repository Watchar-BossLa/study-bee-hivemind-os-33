
import { AccountingQualification } from '@/types/qualifications';

export const professionalQualifications: AccountingQualification[] = [
  {
    id: "acca",
    name: "Association of Chartered Certified Accountants (ACCA)",
    description: "Globally recognized professional accounting qualification",
    modules: [
      { name: "Applied Knowledge", courses: ["Business and Technology", "Management Accounting", "Financial Accounting"] },
      { name: "Applied Skills", courses: ["Corporate and Business Law", "Performance Management", "Taxation", "Financial Reporting", "Audit and Assurance", "Financial Management"] },
      { name: "Strategic Professional", courses: ["Strategic Business Leader", "Strategic Business Reporting", "Advanced Financial Management", "Advanced Performance Management", "Advanced Taxation", "Advanced Audit and Assurance"] }
    ]
  },
  {
    id: "cima",
    name: "Chartered Institute of Management Accountants (CIMA)",
    description: "Leading professional body for management accountants",
    modules: [
      { name: "Certificate Level", courses: ["BA1: Fundamentals of Business Economics", "BA2: Fundamentals of Management Accounting", "BA3: Fundamentals of Financial Accounting", "BA4: Fundamentals of Ethics, Corporate Governance and Business Law"] },
      { name: "Operational Level", courses: ["E1: Organizational Management", "P1: Management Accounting", "F1: Financial Reporting and Taxation"] },
      { name: "Management Level", courses: ["E2: Project and Relationship Management", "P2: Advanced Management Accounting", "F2: Advanced Financial Reporting"] },
      { name: "Strategic Level", courses: ["E3: Strategic Management", "P3: Risk Management", "F3: Financial Strategy"] }
    ]
  }
];
