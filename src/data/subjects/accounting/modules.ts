
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const accountingModules: Module[] = [
  {
    id: "acct-cert",
    name: "Certificate in Accounting",
    level: "certificate",
    description: "Foundation program covering basic accounting principles and financial record-keeping",
    learning_outcomes: [
      "Understand fundamental accounting concepts and terminology",
      "Prepare simple financial statements for small businesses",
      "Process basic payroll and taxation documents",
      "Use accounting software for basic bookkeeping tasks"
    ],
    duration: "6 months",
    credits_required: 20,
    courses: certificateCourses
  },
  {
    id: "acct-cvq",
    name: "CVQ in Accounting",
    level: "cvq",
    description: "Vocational qualification focused on practical accounting skills for industry application",
    learning_outcomes: [
      "Apply financial accounting practices in business contexts",
      "Use computerized accounting systems for financial record-keeping",
      "Prepare business taxation documents and filings",
      "Implement basic cost accounting procedures"
    ],
    duration: "9 months",
    credits_required: 40,
    courses: cvqCourses
  },
  {
    id: "acct-dip",
    name: "Diploma in Accounting",
    level: "diploma",
    description: "Comprehensive program covering intermediate financial accounting and management principles",
    learning_outcomes: [
      "Apply intermediate financial accounting standards and practices",
      "Use management accounting techniques for business decision-making",
      "Develop effective taxation planning strategies",
      "Conduct basic audit procedures for financial statements"
    ],
    duration: "1 year",
    credits_required: 60,
    courses: diplomaCourses
  },
  {
    id: "acct-bach",
    name: "Bachelor of Accounting",
    level: "bachelors",
    description: "In-depth degree program covering advanced accounting principles, corporate finance, and auditing",
    learning_outcomes: [
      "Apply advanced financial accounting principles in complex business scenarios",
      "Analyze corporate financial structures and make strategic recommendations",
      "Implement comprehensive taxation strategies for various entities",
      "Conduct thorough audit and assurance processes",
      "Prepare detailed financial reports according to international standards"
    ],
    duration: "4 years",
    credits_required: 120,
    courses: bachelorsCourses
  },
  {
    id: "acct-mast",
    name: "Master of Accounting",
    level: "masters",
    description: "Advanced graduate program specializing in strategic financial management and research",
    learning_outcomes: [
      "Critically evaluate advanced financial reporting frameworks",
      "Develop strategic financial management approaches for organizations",
      "Implement complex international taxation strategies",
      "Apply forensic accounting techniques in investigative scenarios",
      "Conduct original accounting research addressing industry challenges"
    ],
    duration: "2 years",
    credits_required: 60,
    courses: mastersCourses
  }
];
