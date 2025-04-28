
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
    courses: certificateCourses
  },
  {
    id: "acct-cvq",
    name: "CVQ in Accounting",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "acct-dip",
    name: "Diploma in Accounting",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "acct-bach",
    name: "Bachelor of Accounting",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "acct-mast",
    name: "Master of Accounting",
    level: "masters",
    courses: mastersCourses
  }
];
