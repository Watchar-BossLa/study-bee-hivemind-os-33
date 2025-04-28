
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const educationModules: Module[] = [
  {
    id: "edu-cert",
    name: "Certificate in Education",
    level: "certificate",
    courses: certificateCourses
  },
  {
    id: "edu-cvq",
    name: "CVQ in Education Assistant",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "edu-dip",
    name: "Diploma in Education",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "edu-bach",
    name: "Bachelor of Education",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "edu-mast",
    name: "Master of Education",
    level: "masters",
    courses: mastersCourses
  }
];
