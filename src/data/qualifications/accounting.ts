
import { SubjectArea, AccountingQualification } from '@/types/qualifications';

export const accountingSubjectArea: SubjectArea = {
  id: "accounting",
  name: "Accounting",
  description: "Study of financial information for decision-making, reporting, and compliance",
  icon: "book-text",
  modules: [
    {
      id: "acct-cert",
      name: "Certificate in Accounting",
      level: "certificate",
      courses: [
        { id: "acct101", name: "Bookkeeping Fundamentals", credits: 5 },
        { id: "acct102", name: "Basic Financial Statements", credits: 5 },
        { id: "acct103", name: "Introduction to Taxation", credits: 5 },
        { id: "acct104", name: "Payroll Processing", credits: 5 }
      ]
    },
    {
      id: "acct-cvq",
      name: "CVQ in Accounting",
      level: "cvq",
      courses: [
        { id: "acct201", name: "Financial Accounting Practices", credits: 10 },
        { id: "acct202", name: "Computerized Accounting", credits: 10 },
        { id: "acct203", name: "Business Taxation", credits: 10 },
        { id: "acct204", name: "Cost Accounting Basics", credits: 10 }
      ]
    },
    {
      id: "acct-dip",
      name: "Diploma in Accounting",
      level: "diploma",
      courses: [
        { id: "acct301", name: "Intermediate Financial Accounting", credits: 15 },
        { id: "acct302", name: "Management Accounting", credits: 15 },
        { id: "acct303", name: "Taxation Planning", credits: 15 },
        { id: "acct304", name: "Audit Fundamentals", credits: 15 }
      ]
    },
    {
      id: "acct-bach",
      name: "Bachelor of Accounting",
      level: "bachelors",
      courses: [
        { id: "acct401", name: "Advanced Financial Accounting", credits: 20 },
        { id: "acct402", name: "Corporate Finance", credits: 20 },
        { id: "acct403", name: "Advanced Taxation", credits: 20 },
        { id: "acct404", name: "Audit & Assurance", credits: 20 },
        { id: "acct405", name: "Financial Reporting", credits: 20 },
        { id: "acct406", name: "Strategic Management Accounting", credits: 20 }
      ]
    },
    {
      id: "acct-mast",
      name: "Master of Accounting",
      level: "masters",
      courses: [
        { id: "acct501", name: "Advanced Financial Reporting", credits: 15 },
        { id: "acct502", name: "Strategic Financial Management", credits: 15 },
        { id: "acct503", name: "International Taxation", credits: 15 },
        { id: "acct504", name: "Forensic Accounting", credits: 15 },
        { id: "acct505", name: "Research Methods in Accounting", credits: 15 }
      ]
    }
  ]
};

export const accountingQualifications: AccountingQualification[] = [
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
  },
  {
    id: "cpa",
    name: "Certified Public Accountant (CPA)",
    description: "US-based professional accounting designation",
    modules: [
      { name: "Core Exam Sections", courses: ["Auditing and Attestation (AUD)", "Business Environment and Concepts (BEC)", "Financial Accounting and Reporting (FAR)", "Regulation (REG)"] }
    ]
  },
  {
    id: "cga",
    name: "Chartered Professional Accountant (CPA Canada)",
    description: "Canadian professional accounting designation",
    modules: [
      { name: "PEP Core Modules", courses: ["Core 1", "Core 2"] },
      { name: "PEP Elective Modules", courses: ["Assurance", "Finance", "Information Technology", "Performance Management", "Taxation"] },
      { name: "Capstone Modules", courses: ["Capstone 1: Integrative Analysis", "Capstone 2: Examination Preparation"] }
    ]
  }
];
