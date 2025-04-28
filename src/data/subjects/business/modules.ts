
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
    courses: certificateCourses
  },
  {
    id: "bus-cvq",
    name: "CVQ in Business Management",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "bus-dip",
    name: "Diploma in Business Management",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "bus-bach",
    name: "Bachelor of Business Administration",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "bus-mast",
    name: "Master of Business Administration (MBA)",
    level: "masters",
    courses: mastersCourses
  }
];
