
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const engineeringModules: Module[] = [
  {
    id: "eng-cert",
    name: "Certificate in Engineering",
    level: "certificate",
    courses: certificateCourses
  },
  {
    id: "eng-cvq",
    name: "CVQ in Engineering Technology",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "eng-dip",
    name: "Diploma in Engineering",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "eng-bach",
    name: "Bachelor of Engineering",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "eng-mast",
    name: "Master of Engineering",
    level: "masters",
    courses: mastersCourses
  }
];
