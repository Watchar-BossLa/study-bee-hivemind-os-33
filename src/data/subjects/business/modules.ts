
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const businessModules: Module[] = [
  {
    id: "bus-cert",
    name: "Certificate in Business Administration",
    level: "certificate",
    description: "Foundation program covering essential business concepts and administrative skills",
    courses: certificateCourses
  },
  {
    id: "bus-cvq",
    name: "CVQ in Business Management",
    level: "cvq",
    description: "Vocational qualification focused on practical business operations and management",
    courses: cvqCourses
  },
  {
    id: "bus-dip",
    name: "Diploma in Business Management",
    level: "diploma",
    description: "Comprehensive program in business management principles and practices",
    courses: diplomaCourses
  },
  {
    id: "bus-bach",
    name: "Bachelor of Business Administration",
    level: "bachelors",
    description: "Extensive degree program covering all aspects of business management and leadership",
    courses: bachelorsCourses
  },
  {
    id: "bus-mast",
    name: "Master of Business Administration (MBA)",
    level: "masters",
    description: "Advanced studies in business strategy, leadership, and organizational management",
    courses: mastersCourses
  }
];
