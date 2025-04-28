
import { Module } from '@/types/qualifications';
import { 
  certificateCourses, 
  cvqCourses, 
  diplomaCourses, 
  bachelorsCourses, 
  mastersCourses 
} from './courses';

export const medicineModules: Module[] = [
  {
    id: "med-cert",
    name: "Certificate in Healthcare",
    level: "certificate",
    courses: certificateCourses
  },
  {
    id: "med-cvq",
    name: "CVQ in Healthcare Services",
    level: "cvq",
    courses: cvqCourses
  },
  {
    id: "med-dip",
    name: "Diploma in Health Sciences",
    level: "diploma",
    courses: diplomaCourses
  },
  {
    id: "med-bach",
    name: "Bachelor of Medicine",
    level: "bachelors",
    courses: bachelorsCourses
  },
  {
    id: "med-mast",
    name: "Master of Public Health",
    level: "masters",
    courses: mastersCourses
  }
];
