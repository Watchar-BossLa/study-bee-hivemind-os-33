
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const itModules: Module[] = [
  {
    id: "it-cert",
    name: "Certificate in IT",
    level: "certificate",
    courses: certificateCourses
  },
  {
    id: "it-cvq",
    name: "CVQ in Information Technology",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "it-dip",
    name: "Diploma in Information Technology",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "it-bach",
    name: "Bachelor of Science in Information Technology",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "it-mast",
    name: "Master of Science in Information Technology",
    level: "masters",
    courses: mastersCourses
  }
];
