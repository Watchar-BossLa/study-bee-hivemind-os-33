
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
    name: "Certificate in Information Technology",
    level: "certificate",
    description: "Foundation program covering essential IT concepts and basic technical skills",
    courses: certificateCourses
  },
  {
    id: "it-cvq",
    name: "CVQ in Information Technology",
    level: "cvq",
    description: "Vocational qualification focused on practical IT skills and industry readiness",
    courses: cvqCourses
  },
  {
    id: "it-dip",
    name: "Diploma in Information Technology",
    level: "diploma",
    description: "Comprehensive program covering core IT concepts and specialized technical skills",
    courses: diplomaCourses
  },
  {
    id: "it-bach",
    name: "Bachelor of Science in Information Technology",
    level: "bachelors",
    description: "Extensive degree program covering advanced IT concepts, development, and management",
    courses: bachelorsCourses
  },
  {
    id: "it-mast",
    name: "Master of Science in Information Technology",
    level: "masters",
    description: "Advanced studies in specialized IT areas with focus on innovation and research",
    courses: mastersCourses
  }
];
