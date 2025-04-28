
import { QualificationLevel } from '@/types/qualifications';

export const qualificationLevels: QualificationLevel[] = [
  {
    id: "certificate",
    name: "Certificate",
    description: "Foundation level qualifications focusing on core knowledge and skills",
    duration: "3-12 months",
    creditValue: "15-30 credits"
  },
  {
    id: "cvq",
    name: "Caribbean Vocational Qualification (CVQ)",
    description: "Competency-based qualifications for vocational skills and workforce preparation",
    duration: "6-18 months",
    creditValue: "30-60 credits"
  },
  {
    id: "diploma",
    name: "Diploma",
    description: "Intermediate qualification demonstrating specialized knowledge in a field",
    duration: "1-2 years",
    creditValue: "60-120 credits"
  },
  {
    id: "bachelors",
    name: "Bachelor's Degree",
    description: "Comprehensive undergraduate qualification covering theoretical and practical aspects",
    duration: "3-4 years",
    creditValue: "180-240 credits"
  },
  {
    id: "masters",
    name: "Master's Degree",
    description: "Advanced postgraduate qualification with specialization and research components",
    duration: "1-2 years",
    creditValue: "60-120 credits"
  }
];
