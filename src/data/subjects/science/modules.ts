
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const scienceModules: Module[] = [
  {
    id: "sci-cert",
    name: "Certificate in Science",
    level: "certificate",
    courses: certificateCourses
  },
  {
    id: "sci-cvq",
    name: "CVQ in Laboratory Science",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "sci-dip",
    name: "Diploma in Applied Sciences",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "sci-bach",
    name: "Bachelor of Science",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "sci-mast",
    name: "Master of Science",
    level: "masters",
    courses: mastersCourses
  }
];
